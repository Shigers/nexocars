// Motor Financiero y Fiscal NexoCar - Especializado en Automoción y Régimen Especial de Bienes Usados (REBU)

export type TaxRegime = "REBU" | "GENERAL_IVA" | "EXENTO";

export const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * IVA devengado en la venta de un vehículo según el régimen fiscal aplicable.
 * - REBU (Art. 135-139 LIVA): El IVA solo grava el margen comercial (PVP Venta - Precio Compra).
 * - Régimen General: El IVA grava el importe total de la venta (Base + 21% IVA).
 * - Exento: 0 IVA.
 */
export function vatOnSale(
  regime: TaxRegime | string,
  salePrice: number,
  purchasePrice: number,
  ratePct = 21
): number {
  if (regime === "EXENTO") return 0;
  const r = ratePct / 100;

  if (regime === "REBU") {
    // Si la venta es inferior o igual a la compra, el margen es 0 y no se devenga IVA
    const marginBase = Math.max(0, salePrice - purchasePrice);
    return round2((marginBase * r) / (1 + r));
  }

  // Régimen General (Desglose estándar de IVA incluido)
  return round2((salePrice * r) / (1 + r));
}

export interface MarginInput {
  regime: TaxRegime | string;
  salePrice: number;
  purchasePrice: number;
  expenses: number;
  days?: number;
  holdingPerDay?: number; // Coste medio de estancia/depreciación diario (€/día)
  ratePct?: number;
}

export interface MarginResult {
  vat: number;
  totalCost: number;
  initialMargin: number;
  holdingCost: number;
  currentMargin: number;
  marginPct: number;
  isLoss: boolean;
  daysUntilZero: number | null;
}

/**
 * Calcula el desglose completo del margen de un coche hoy.
 * Descuenta compra, reacondicionamiento, IVA correspondiente y coste financiero por días en patio.
 */
export function vehicleMargin(input: MarginInput): MarginResult {
  const holdingPerDay = input.holdingPerDay ?? 8; // Promedio estándar concesionario VO
  const days = Math.max(0, input.days ?? 0);
  
  const vat = vatOnSale(input.regime, input.salePrice, input.purchasePrice, input.ratePct ?? 21);
  const totalCost = round2(input.purchasePrice + input.expenses);
  const initialMargin = round2(input.salePrice - totalCost - vat);
  const holdingCost = round2(days * holdingPerDay);
  const currentMargin = round2(initialMargin - holdingCost);
  const marginPct = input.salePrice > 0 ? round2((currentMargin / input.salePrice) * 100) : 0;
  
  let daysLeft: number | null = null;
  if (holdingPerDay > 0 && initialMargin > 0) {
    daysLeft = Math.max(0, Math.floor(initialMargin / holdingPerDay) - days);
  }

  return {
    vat,
    totalCost,
    initialMargin,
    holdingCost,
    currentMargin,
    marginPct,
    isLoss: currentMargin <= 0,
    daysUntilZero: daysLeft,
  };
}

/**
 * Tasación Inversa: Precio MÁXIMO que el compraventa puede pagar al particular
 * para garantizar el margen neto deseado tras pagar reacondicionamiento e IVA.
 */
export function maxPurchasePrice(
  regime: TaxRegime | string,
  estSalePrice: number,
  expenses: number,
  desiredMargin: number,
  ratePct = 21
): number {
  const f = 1 + ratePct / 100;
  
  if (regime === "REBU") {
    // Fórmula analítica: Precio Compra = Venta - (MargenDeseado + Gastos) * 1.21
    const price = estSalePrice - (desiredMargin + expenses) * f;
    return Math.max(0, round2(price));
  }

  if (regime === "EXENTO") {
    return Math.max(0, round2(estSalePrice - expenses - desiredMargin));
  }

  // Régimen General
  const price = estSalePrice / f - expenses - desiredMargin;
  return Math.max(0, round2(price));
}

export type UrgencyLevel = "liquidation" | "warning" | "normal" | "closed";

export interface UrgencyReport {
  score: number;
  level: UrgencyLevel;
  badgeLabel: string;
  badgeColor: string;
  suggestedMarkdown: number | null;
}

/**
 * Algoritmo de Priorización de Venta en Patio.
 * Identifica qué coches deben liquidarse antes de que devoren el margen del concesionario.
 */
export function urgencyReport(
  days: number,
  currentMargin: number,
  initialMargin: number,
  status: string,
  currentPrice: number
): UrgencyReport {
  if (["vendido", "baja", "archivado"].includes(status.toLowerCase())) {
    return {
      score: -1,
      level: "closed",
      badgeLabel: "Cerrado",
      badgeColor: "bg-slate-800 text-slate-400",
      suggestedMarkdown: null,
    };
  }

  let score = days;
  if (currentMargin < 0) score += 250;
  else if (initialMargin > 0 && currentMargin / initialMargin < 0.5) score += 90;
  if (status.toLowerCase() === "reservado") score += 30;

  // Sugerencia de rebaja para acelerar salida si lleva más de 45 días
  let suggestedMarkdown: number | null = null;
  if (days >= 45 && currentPrice > 0) {
    const cut = Math.max(currentPrice * 0.03, Math.max(currentMargin, 0) * 0.5);
    const target = currentPrice - Math.min(cut, currentPrice * 0.08);
    suggestedMarkdown = Math.floor(target / 100) * 100 - 10; // Redondeado a psicológica terminada en 90
  }

  if (score >= 200 || currentMargin < 0) {
    return {
      score,
      level: "liquidation",
      badgeLabel: "Liquidación Urgente",
      badgeColor: "bg-rose-500/10 text-rose-400 border border-rose-500/30",
      suggestedMarkdown,
    };
  }

  if (score >= 60 || days >= 45) {
    return {
      score,
      level: "warning",
      badgeLabel: "Rotación Lenta",
      badgeColor: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
      suggestedMarkdown,
    };
  }

  return {
    score,
    level: "normal",
    badgeLabel: "Margen Saludable",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
    suggestedMarkdown: null,
  };
}
