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
