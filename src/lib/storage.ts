"use client";

import { Vehicle, Lead, Expense, Appointment } from "@/types";
import { mockVehicles, mockLeads, mockExpenses, mockAppointments } from "./mock-data";

const STORAGE_KEYS = {
  VEHICLES: "nexo_car_vehicles_v1",
  LEADS: "nexo_car_leads_v1",
  EXPENSES: "nexo_car_expenses_v1",
  APPOINTMENTS: "nexo_car_appointments_v1",
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
    return JSON.parse(raw);
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
