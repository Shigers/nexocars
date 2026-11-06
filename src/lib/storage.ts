"use client";

import { Vehicle, Lead, Expense, Appointment, PortalPublication } from "@/types";
import { mockVehicles, mockLeads, mockExpenses, mockAppointments, mockPortals } from "./mock-data";

const STORAGE_KEYS = {
  VEHICLES: "nexo_car_vehicles_v1",
  LEADS: "nexo_car_leads_v1",
  EXPENSES: "nexo_car_expenses_v1",
  APPOINTMENTS: "nexo_car_appointments_v1",
  PORTALS: "nexo_car_portals_v1",
  VEHICLE_PORTALS: "nexo_car_veh_portals_v1",
};

// ---------------------------------------------------------------------------
// VEHICLES PERSISTENCE
// ---------------------------------------------------------------------------
export function getStoredVehicles(): Vehicle[] {
  if (typeof window === "undefined") return mockVehicles;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(mockVehicles));
      return mockVehicles;
    }
    const parsed: Vehicle[] = JSON.parse(raw);
    // Merge any mock vehicles not in parsed list (e.g. freshly added real Orlando Cars stock)
    const missingMocks = mockVehicles.filter(
      (m) => !parsed.some((p) => p.id === m.id || p.plate === m.plate)
    );
    if (missingMocks.length > 0) {
      const merged = [...parsed, ...missingMocks];
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch {
    return mockVehicles;
  }
}

export function saveVehicle(vehicle: Vehicle): Vehicle[] {
  const current = getStoredVehicles();
  const existsIndex = current.findIndex((v) => v.id === vehicle.id || v.plate === vehicle.plate);
  let updated: Vehicle[];

  if (existsIndex >= 0) {
    updated = [...current];
    updated[existsIndex] = vehicle;
  } else {
    updated = [vehicle, ...current];
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(updated));
    window.dispatchEvent(new Event("nexo_storage_updated"));
  }
  return updated;
}

export function deleteVehicle(id: string): Vehicle[] {
  const current = getStoredVehicles();
  const updated = current.filter((v) => v.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(updated));
    window.dispatchEvent(new Event("nexo_storage_updated"));
  }
  return updated;
}

export function bulkImportVehicles(newVehicles: Vehicle[]): Vehicle[] {
  const current = getStoredVehicles();
  const updated = [...newVehicles, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(updated));
    window.dispatchEvent(new Event("nexo_storage_updated"));
  }
  return updated;
}

// ---------------------------------------------------------------------------
// LEADS PERSISTENCE
// ---------------------------------------------------------------------------
export function getStoredLeads(): Lead[] {
  if (typeof window === "undefined") return mockLeads;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEADS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(mockLeads));
      return mockLeads;
    }
    return JSON.parse(raw);
  } catch {
    return mockLeads;
  }
}

export function saveLead(lead: Lead): Lead[] {
  const current = getStoredLeads();
  const updated = [lead, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(updated));
    window.dispatchEvent(new Event("nexo_storage_updated"));
  }
  return updated;
}

// ---------------------------------------------------------------------------
// EXPENSES PERSISTENCE
// ---------------------------------------------------------------------------
export function getStoredExpenses(): Expense[] {
  if (typeof window === "undefined") return mockExpenses;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(mockExpenses));
      return mockExpenses;
    }
    return JSON.parse(raw);
  } catch {
    return mockExpenses;
  }
}

export function saveExpense(expense: Expense): Expense[] {
  const current = getStoredExpenses();
  const updated = [expense, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updated));
    window.dispatchEvent(new Event("nexo_storage_updated"));
  }
  return updated;
}

// ---------------------------------------------------------------------------
// MULTI-PORTAL DISTRIBUTOR PERSISTENCE & DYNAMIC PLATFORMS
// ---------------------------------------------------------------------------
export function getStoredPortals(): PortalPublication[] {
  if (typeof window === "undefined") return mockPortals;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PORTALS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PORTALS, JSON.stringify(mockPortals));
      return mockPortals;
    }
    return JSON.parse(raw);
  } catch {
    return mockPortals;
  }
}

export function savePortal(portal: PortalPublication): PortalPublication[] {
  const current = getStoredPortals();
  const idx = current.findIndex((p) => p.portal === portal.portal);
  let updated: PortalPublication[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = portal;
  } else {
    updated = [...current, portal];
  }
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.PORTALS, JSON.stringify(updated));
    window.dispatchEvent(new Event("nexo_storage_updated"));
  }
  return updated;
}

export function deletePortal(portalKey: string): PortalPublication[] {
  const current = getStoredPortals();
  const updated = current.filter((p) => p.portal !== portalKey);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.PORTALS, JSON.stringify(updated));
    window.dispatchEvent(new Event("nexo_storage_updated"));
  }
  return updated;
}

export function togglePortalEnabled(portalKey: string): PortalPublication[] {
  const current = getStoredPortals();
  const updated = current.map((p) => {
    if (p.portal === portalKey) {
      const nextStatus = p.status === "publicado" ? "retirado" : "publicado";
      return { ...p, status: nextStatus, enabled: nextStatus === "publicado" };
    }
    return p;
  });
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.PORTALS, JSON.stringify(updated));
    window.dispatchEvent(new Event("nexo_storage_updated"));
  }
  return updated;
}

export function getVehiclePortalMatrix(): Record<string, Record<string, boolean>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VEHICLE_PORTALS);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function toggleVehiclePortalPublication(vehicleId: string, portalKey: string): boolean {
  const currentMatrix = getVehiclePortalMatrix();
  const vehMap = currentMatrix[vehicleId] || {};
  const currentVal = vehMap[portalKey] !== undefined ? vehMap[portalKey] : true;
  const newVal = !currentVal;

  currentMatrix[vehicleId] = {
    ...vehMap,
    [portalKey]: newVal,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.VEHICLE_PORTALS, JSON.stringify(currentMatrix));
    window.dispatchEvent(new Event("nexo_storage_updated"));
  }
  return newVal;
}
