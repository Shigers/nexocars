"use client";

import { Vehicle, Lead, Expense, Appointment, PortalPublication } from "@/types";
import { mockVehicles, mockLeads, mockExpenses, mockAppointments, mockPortals } from "./mock-data";
import { supabase, isSupabaseConfigured } from "./supabase";

const STORAGE_KEYS = {
  VEHICLES: "nexo_car_vehicles_v3",
  LEADS: "nexo_car_leads_v2",
  EXPENSES: "nexo_car_expenses_v1",
  APPOINTMENTS: "nexo_car_appointments_v1",
  PORTALS: "nexo_car_portals_v1",
  VEHICLE_PORTALS: "nexo_car_veh_portals_v1",
};

// Background Cloud Sync Trigger
let hasFetchedFromSupabase = false;

// ---------------------------------------------------------------------------
// VEHICLES PERSISTENCE (Hybrid Offline-First + PostgreSQL Cloud Sync)
// ---------------------------------------------------------------------------
export function resetVehiclesToDefault(): Vehicle[] {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(mockVehicles));
    window.dispatchEvent(new Event("nexo_storage_updated"));
  }
  return mockVehicles;
}

export function getStoredVehicles(): Vehicle[] {
  if (typeof window === "undefined") return mockVehicles;

  // Real-time Cloud Fetch from Supabase PostgreSQL
  if (isSupabaseConfigured && supabase && !hasFetchedFromSupabase) {
    hasFetchedFromSupabase = true;
    supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(async ({ data, error }) => {
        if (!error && data) {
          const dbVehicles = data as Vehicle[];
          const existingIds = new Set(dbVehicles.map((d) => d.id));
          const existingPlates = new Set(dbVehicles.map((d) => d.plate));

          // Retain mockVehicles that aren't in Supabase yet (e.g. Loewe fleet)
          const missingMocks = mockVehicles.filter(
            (m) => !existingIds.has(m.id) && !existingPlates.has(m.plate)
          );

          const combined = [...dbVehicles, ...missingMocks];
          localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(combined));
          window.dispatchEvent(new Event("nexo_storage_updated"));

          // Automatically sync missing Loewe and Orlando vehicles to Supabase PostgreSQL
          if (missingMocks.length > 0 && supabase) {
            for (const v of missingMocks) {
              try {
                await supabase.from("vehicles").upsert({
                  id: v.id,
                  company_id: v.company_id || "comp-orlando",
                  brand: v.brand,
                  model: v.model,
                  version: v.version,
                  plate: v.plate,
                  vin: v.vin,
                  year: v.year,
                  mileage: v.mileage,
                  fuel_type: v.fuel_type,
                  transmission: v.transmission,
                  power_hp: v.power_hp,
                  color: v.color,
                  doors: v.doors || 5,
                  seats: v.seats || 5,
                  environmental_badge: v.environmental_badge,
                  body_type: v.body_type,
                  purchase_price: v.purchase_price,
                  preparation_costs: v.preparation_costs,
                  additional_costs: v.additional_costs,
                  total_cost: v.total_cost,
                  selling_price: v.selling_price,
                  financed_price: v.financed_price,
                  min_selling_price: v.min_selling_price,
                  tax_scheme: v.tax_scheme,
                  status: v.status,
                  location: v.location,
                  purchase_date: v.purchase_date,
                  supplier_name: v.supplier_name,
                  title: v.title,
                  description: v.description,
                  images: v.images,
                  equipment_list: v.equipment_list,
                  is_featured: v.is_featured,
                  published_on_web: v.published_on_web,
                  days_in_stock: v.days_in_stock,
                  created_at: v.created_at,
                });
              } catch (e) {
                // Ignore silent network upsert errors
              }
            }
          }
        }
      });
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(mockVehicles));
      return mockVehicles;
    }
    const parsed: Vehicle[] = JSON.parse(raw);
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

  // Direct Cloud Write to PostgreSQL Supabase
  if (isSupabaseConfigured && supabase) {
    supabase
      .from("vehicles")
      .upsert({
        id: vehicle.id,
        company_id: vehicle.company_id || "comp-orlando",
        brand: vehicle.brand,
        model: vehicle.model,
        version: vehicle.version,
        plate: vehicle.plate,
        vin: vehicle.vin,
        year: vehicle.year,
        mileage: vehicle.mileage,
        fuel_type: vehicle.fuel_type,
        transmission: vehicle.transmission,
        power_hp: vehicle.power_hp,
        color: vehicle.color,
        doors: vehicle.doors || 5,
        seats: vehicle.seats || 5,
        environmental_badge: vehicle.environmental_badge,
        body_type: vehicle.body_type,
        purchase_price: vehicle.purchase_price,
        preparation_costs: vehicle.preparation_costs,
        additional_costs: vehicle.additional_costs,
        total_cost: vehicle.total_cost,
        selling_price: vehicle.selling_price,
        financed_price: vehicle.financed_price,
        min_selling_price: vehicle.min_selling_price,
        tax_scheme: vehicle.tax_scheme || "REBU",
        status: vehicle.status || "disponible",
        location: vehicle.location,
        purchase_date: vehicle.purchase_date,
        supplier_name: vehicle.supplier_name,
        title: vehicle.title,
        description: vehicle.description,
        images: vehicle.images,
        equipment_list: vehicle.equipment_list,
        is_featured: vehicle.is_featured,
        published_on_web: vehicle.published_on_web,
        days_in_stock: vehicle.days_in_stock,
        created_at: vehicle.created_at || new Date().toISOString(),
      })
      .then(({ error }) => {
        if (error) console.error("Cloud Supabase sync error:", error);
      });
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

  // Direct Cloud Delete in Supabase PostgreSQL
  if (isSupabaseConfigured && supabase) {
    supabase
      .from("vehicles")
      .delete()
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.error("Cloud Supabase delete error:", error);
      });
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
  const updated: PortalPublication[] = current.map((p) => {
    if (p.portal === portalKey) {
      const nextStatus: PortalPublication["status"] = p.status === "publicado" ? "retirado" : "publicado";
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
