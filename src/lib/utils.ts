import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { VehicleStatus, FuelType } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("es-ES").format(num);
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return dateString;
  }
}

/**
 * REBU (Régimen Especial de Bienes Usados) calculation in Spain:
 * Margin = Selling Price - Total Cost
 * Tax Base = Margin / 1.21 (if positive)
 * VAT to pay = Margin - Tax Base
 */
export function calculateREBUMargin(sellingPrice: number, totalCost: number, taxRate = 21) {
  const grossProfit = sellingPrice - totalCost;
  if (grossProfit <= 0) {
    return {
      grossProfit,
      marginPercentage: 0,
      taxBase: 0,
      vatToPay: 0,
      netProfit: grossProfit,
    };
  }
  const factor = 1 + taxRate / 100;
  const taxBase = grossProfit / factor;
  const vatToPay = grossProfit - taxBase;
  const netProfit = grossProfit - vatToPay;
  const marginPercentage = (grossProfit / sellingPrice) * 100;

  return {
    grossProfit,
    marginPercentage,
    taxBase,
    vatToPay,
    netProfit,
  };
}

/**
 * FINANCIAL HOLDING COST & STOCK DEPRECIATION
 * Coste diario por tener el coche parado en campa (interés de crédito de stock, seguro, ocupación).
 * Estándar de compraventa en España: 14 € / día.
 */
export const HOLDING_COST_PER_DAY = 14;

export function calculateHoldingCost(daysInStock: number, holdingPerDay = HOLDING_COST_PER_DAY) {
  const safeDays = Math.max(0, daysInStock);
  return safeDays * holdingPerDay;
}

export function calculateRealCurrentMargin(
  sellingPrice: number,
  totalCost: number,
  daysInStock: number,
  holdingPerDay = HOLDING_COST_PER_DAY
) {
  const rebu = calculateREBUMargin(sellingPrice, totalCost);
  const holdingLoss = calculateHoldingCost(daysInStock, holdingPerDay);
  const realMarginToday = rebu.grossProfit - holdingLoss;
  const daysToZero =
    rebu.grossProfit > 0 && holdingPerDay > 0
      ? Math.floor(rebu.grossProfit / holdingPerDay) - daysInStock
      : 0;

  // Suggested discount price for stagnant stock (>40 days)
  let suggestedPrice = sellingPrice;
  if (daysInStock >= 40 && sellingPrice > 0) {
    const cut = Math.max(sellingPrice * 0.03, Math.max(realMarginToday, 0) * 0.4);
    const target = sellingPrice - Math.min(cut, sellingPrice * 0.08);
    suggestedPrice = Math.floor(target / 100) * 100 - 10; // Rounded to attractive 90 EUR ending
  }

  return {
    initialGrossMargin: rebu.grossProfit,
    initialNetProfit: rebu.netProfit,
    holdingLoss,
    realMarginToday,
    daysToZero,
    isAtRisk: daysToZero <= 15,
    suggestedPrice,
  };
}

export function getVehicleStatusBadge(status: VehicleStatus) {
  switch (status) {
    case "disponible":
      return {
        label: "Disponible",
        className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      };
    case "en_preparacion":
      return {
        label: "En Taller",
        className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      };
    case "reservado":
      return {
        label: "Reservado",
        className: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      };
    case "vendido":
      return {
        label: "Vendido",
        className: "bg-purple-500/15 text-purple-400 border-purple-500/30",
      };
    case "baja":
      return {
        label: "Baja",
        className: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
      };
    default:
      return {
        label: status,
        className: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
      };
  }
}

export function getFuelLabel(fuel: FuelType): string {
  const map: Record<FuelType, string> = {
    gasolina: "Gasolina",
    diesel: "Diésel",
    hibrido: "Híbrido",
    hibrido_enchufable: "PHEV",
    electrico: "Eléctrico 100%",
    glp: "GLP",
    gnc: "GNC",
  };
  return map[fuel] || fuel;
}
