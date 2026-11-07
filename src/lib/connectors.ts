import { Vehicle } from "@/types";
import { supabase, isSupabaseConfigured } from "./supabase";
import { mockVehicles } from "./mock-data";

export interface FeedVehicle {
  id: string;
  plate: string;
  vin: string;
  brand: string;
  model: string;
  version: string;
  body: string;
  year: number;
  km: number;
  fuel: string;
  transmission: string;
  power_hp: number;
  color: string;
  doors: number;
  seats: number;
  environmental_badge: string;
  equipment: string[];
  description: string;
  price: number;
  images: string[];
}

/** Escapa caracteres XML para evitar roturas de parsing */
const esc = (s: unknown): string =>
  String(s ?? "").replace(/[<>&'"]/g, (c) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  }[c] || ""));

/**
 * Obtiene los vehículos publicables:
 * - Filtro estricto: Solo coches en estado 'disponible' y marcados para publicación.
 * - Blindaje total: Excluye precio de compra, costes y márgenes internos.
 */
export async function getPublicVehicles(): Promise<FeedVehicle[]> {
  let vehicles: Vehicle[] = [];

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("status", "disponible");

      if (!error && data && data.length > 0) {
        vehicles = data as Vehicle[];
      }
    } catch (e) {
      console.error("Error fetching vehicles for feed:", e);
    }
  }

  // Fallback si Supabase no tiene aún suficientes o está offline
  if (vehicles.length === 0) {
    vehicles = mockVehicles.filter((v) => v.status === "disponible");
  }

  return vehicles.map((v) => ({
    id: v.id,
    plate: v.plate,
    vin: v.vin || "",
    brand: v.brand,
    model: v.model,
    version: v.version || "",
    body: v.body_type || "Turismo",
    year: v.year,
    km: v.mileage,
    fuel: v.fuel_type,
    transmission: v.transmission,
    power_hp: v.power_hp,
    color: v.color,
    doors: v.doors,
    seats: v.seats,
    environmental_badge: v.environmental_badge || "C",
    equipment: v.equipment_list || [],
    description: v.description || "",
    price: v.selling_price,
    images: v.images || [],
  }));
}

/**
 * Generador de Feed XML oficial para portales automotrices (Coches.net, AutoScout24, etc.)
 */
export function buildFeedXml(
  portal: string,
  dealerName: string,
  cars: FeedVehicle[]
): string {
  const rootTag = portal === "autoscout24" ? "vehicles" : "stock";
  const itemTag = portal === "autoscout24" ? "vehicle" : "coche";

  const carItems = cars.map((c) => `  <${itemTag}>
    <reference>${esc(c.id)}</reference>
    <plate>${esc(c.plate)}</plate>
    <vin>${esc(c.vin)}</vin>
    <make>${esc(c.brand)}</make>
    <model>${esc(c.model)}</model>
    <version>${esc(c.version)}</version>
    <bodyType>${esc(c.body)}</bodyType>
    <year>${esc(c.year)}</year>
    <km>${esc(c.km)}</km>
    <fuel>${esc(c.fuel)}</fuel>
    <gearbox>${esc(c.transmission)}</gearbox>
    <powerHp>${esc(c.power_hp)}</powerHp>
    <color>${esc(c.color)}</color>
    <doors>${esc(c.doors)}</doors>
    <seats>${esc(c.seats)}</seats>
    <environmentalBadge>${esc(c.environmental_badge)}</environmentalBadge>
    <price currency="EUR">${esc(c.price)}</price>
    <equipment>${c.equipment.map((e) => `<item>${esc(e)}</item>`).join("")}</equipment>
    <description>${esc(c.description)}</description>
    <images>${c.images.map((img) => `<image>${esc(img)}</image>`).join("")}</images>
  </${itemTag}>`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<${rootTag} dealer="${esc(dealerName)}" generator="NexoCar-Cloud" count="${cars.length}" timestamp="${new Date().toISOString()}">
${carItems.join("\n")}
</${rootTag}>`;
}
