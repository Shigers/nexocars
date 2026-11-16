import { Vehicle, FuelType, VehicleStatus, TaxScheme } from "@/types";

/**
 * Intelligent CSV / TSV Parser for Automotive Stock Migration
 * Supports WordPress (WP All Import, Motors Theme, WooCommerce), Excel, AutoTrader, Coches.net exports.
 */

// Detect delimiter: semicolon (typical in Spanish Excel), comma, or tab
export function detectDelimiter(firstLine: string): string {
  const semicolons = (firstLine.match(/;/g) || []).length;
  const commas = (firstLine.match(/,/g) || []).length;
  const tabs = (firstLine.match(/\t/g) || []).length;

  if (semicolons >= commas && semicolons >= tabs && semicolons > 0) return ";";
  if (tabs >= commas && tabs > 0) return "\t";
  return ",";
}

// Parses a single CSV line respecting quoted strings with internal delimiters
export function parseCSVLine(line: string, delimiter: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values.map((val) => val.replace(/^["']|["']$/g, "").trim());
}

// Normalize strings (lowercase, remove accents, strip spaces)
function normalizeKey(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

// Map column aliases
const ALIAS_MAP: Record<string, string[]> = {
  brand: ["marca", "brand", "make", "fabricante"],
  model: ["modelo", "model", "gama"],
  version: ["version", "acabado", "trim", "submodelo", "variante"],
  plate: ["matricula", "plate", "reg", "registration", "placa"],
  vin: ["vin", "bastidor", "chasis", "frame"],
  year: ["ano", "year", "ejercicio", "fecha_matriculacion", "matriculacion"],
  mileage: ["km", "kilometraje", "kilometros", "mileage", "kms"],
  fuel_type: ["combustible", "fuel", "fueltype", "carburante", "motor"],
  transmission: ["cambio", "transmision", "transmission", "caja"],
  power_hp: ["potencia", "cv", "hp", "power", "caballos"],
  color: ["color", "pintura"],
  selling_price: ["pvp", "precio", "price", "precioventa", "sellingprice", "precioalcontado", "importe"],
  purchase_price: ["coste", "cost", "preciocompra", "purchaseprice", "adquisicion", "valorcompra"],
  images: ["imagenes", "images", "fotos", "photos", "foto", "image", "picture", "gallery", "urlfoto"],
  description: ["descripcion", "description", "observaciones", "notas", "notes", "detalles", "texto"],
  company_id: ["empresa", "sede", "tienda", "concesionario", "company", "dealership"],
};

// Normalize numeric values (supports "25.000,00 €" or "25000.00")
function cleanNumber(val: any): number {
  if (typeof val === "number") return val;
  if (!val) return 0;
  let str = String(val).replace(/[^\d.,-]/g, "").trim();
  if (str.includes(",") && str.includes(".")) {
    // e.g. "25.000,50" -> 25000.50
    str = str.replace(/\./g, "").replace(",", ".");
  } else if (str.includes(",")) {
    // e.g. "25000,50" -> 25000.50
    str = str.replace(",", ".");
  }
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

// Normalize fuel type
function cleanFuel(val: string): FuelType {
  const norm = normalizeKey(val || "");
  if (norm.includes("diesel") || norm.includes("gasoil")) return "diesel";
  if (norm.includes("hib") || norm.includes("eco") || norm.includes("phev")) return "hibrido";
  if (norm.includes("elec") || norm.includes("ev")) return "electrico";
  return "gasolina";
}

export interface CSVParseResult {
  vehicles: Vehicle[];
  totalRows: number;
  validRows: number;
  errors: string[];
}

export function parseVehiclesCSV(
  csvContent: string,
  defaultCompany: "comp-orlando" | "comp-loewe" = "comp-orlando"
): CSVParseResult {
  const errors: string[] = [];
  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    return {
      vehicles: [],
      totalRows: 0,
      validRows: 0,
      errors: ["El archivo CSV debe tener al menos una cabecera y una fila de datos."],
    };
  }

  const delimiter = detectDelimiter(lines[0]);
  const rawHeaders = parseCSVLine(lines[0], delimiter);
  const normalizedHeaders = rawHeaders.map(normalizeKey);

  // Map header index to target vehicle property
  const headerMap: Record<string, number> = {};
  for (const [targetKey, aliases] of Object.entries(ALIAS_MAP)) {
    const idx = normalizedHeaders.findIndex((nh) => aliases.some((a) => nh.includes(a)));
    if (idx !== -1) {
      headerMap[targetKey] = idx;
    }
  }

  const vehicles: Vehicle[] = [];

  for (let rowIdx = 1; rowIdx < lines.length; rowIdx++) {
    const rowValues = parseCSVLine(lines[rowIdx], delimiter);
    if (rowValues.length === 0 || rowValues.every((v) => !v)) continue;

    const getValue = (key: string): string => {
      const idx = headerMap[key];
      if (idx !== undefined && idx < rowValues.length) {
        return rowValues[idx] || "";
      }
      return "";
    };

    const brand = getValue("brand") || "Vehículo";
    const model = getValue("model") || "Ocasión";
    const version = getValue("version") || "Acabado de serie";
    const rawPlate = getValue("plate");
    const plate = rawPlate ? rawPlate.toUpperCase().trim() : `TEMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const vin = getValue("vin") || `VIN${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const year = cleanNumber(getValue("year")) || new Date().getFullYear();
    const mileage = cleanNumber(getValue("mileage")) || 0;
    const pvp = cleanNumber(getValue("selling_price"));
    const cost = cleanNumber(getValue("purchase_price")) || Math.round(pvp * 0.8) || 10000;
    const selling_price = pvp > 0 ? pvp : Math.round(cost * 1.25);
    const fuel_type = cleanFuel(getValue("fuel_type"));
    const power_hp = cleanNumber(getValue("power_hp")) || 150;
    const color = getValue("color") || "Blanco";
    const description = getValue("description") || `Vehículo ${brand} ${model} procedente de importación de stock. Totalmente revisado y garantizado.`;
    
    // Parse images: can be separated by pipe |, comma ,, or space
    const rawImages = getValue("images");
    let images: string[] = [];
    if (rawImages) {
      images = rawImages
        .split(/[|,\s]+/)
        .map((img) => img.trim())
        .filter((img) => img.startsWith("http://") || img.startsWith("https://"));
    }
    if (images.length === 0) {
      images = [
        "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80",
      ];
    }

    const companyVal = getValue("company_id").toLowerCase();
    const company_id = companyVal.includes("loewe") ? "comp-loewe" : defaultCompany;

    const vehicle: Vehicle = {
      id: `veh-imp-${Date.now()}-${rowIdx}`,
      company_id,
      brand,
      model,
      version,
      plate,
      vin,
      year,
      mileage,
      fuel_type,
      transmission: getValue("transmission").toLowerCase().includes("man") ? "manual" : "automatico",
      power_hp,
      color,
      doors: 5,
      seats: 5,
      environmental_badge: year >= 2021 ? "ECO" : "C",
      body_type: "turismo",
      purchase_price: cost,
      preparation_costs: 450,
      additional_costs: 250,
      total_cost: cost + 700,
      selling_price,
      financed_price: Math.max(0, selling_price - 1200),
      min_selling_price: Math.max(0, selling_price - 800),
      tax_scheme: "REBU",
      status: "disponible",
      location: company_id === "comp-loewe" ? "Showroom Exclusivo Loewe Cars" : "Exposición Paterna - Orlando Cars",
      purchase_date: new Date().toISOString().split("T")[0],
      supplier_name: "Importación Stock CSV",
      title: `${brand} ${model} ${version} ${year}`,
      description,
      images,
      equipment_list: [
        "Garantía Mecánica 12 Meses",
        "Revisión 120 Puntos Certificada",
        "ITV al día",
      ],
      is_featured: false,
      published_on_web: true,
      days_in_stock: 1,
      created_at: new Date().toISOString(),
    };

    vehicles.push(vehicle);
  }

  return {
    vehicles,
    totalRows: lines.length - 1,
    validRows: vehicles.length,
    errors,
  };
}

/**
 * Generates a downloadable CSV sample template that users can fill in Excel
 */
export function generateCSVTemplate(): string {
  const headers = [
    "Marca",
    "Modelo",
    "Version",
    "Matricula",
    "Bastidor_VIN",
    "Ano",
    "Kilometros",
    "PVP_Venta",
    "Coste_Compra",
    "Combustible",
    "Cambio",
    "Potencia_CV",
    "Color",
    "Sede",
    "Fotos_URL",
    "Descripcion",
  ];

  const row1 = [
    "Mercedes-Benz",
    "Clase A 200d",
    "AMG Line 8G-DCT",
    "4821-LXZ",
    "WDD1770081J293841",
    "2022",
    "48500",
    "29900",
    "23500",
    "Diesel",
    "Automatico",
    "150",
    "Gris Montana",
    "Orlando Cars",
    "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80",
    "Excelente estado con paquete AMG interior y exterior, llantas 18 pulgadas y revision oficial.",
  ];

  const row2 = [
    "Porsche",
    "Macan GTS",
    "PDK 440CV Facelift III",
    "3302-MMT",
    "WP1ZZZ95ZPL109283",
    "2023",
    "21500",
    "89900",
    "74000",
    "Gasolina",
    "Automatico",
    "440",
    "Gris Crayon",
    "Loewe Cars",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    "Unidad exclusiva de coleccion con escape deportivo, frenos PSCB y paquete GTS Sport Crayon.",
  ];

  const escapeCSV = (vals: string[]) => vals.map((v) => `"${v.replace(/"/g, '""')}"`).join(";");

  return [escapeCSV(headers), escapeCSV(row1), escapeCSV(row2)].join("\r\n");
}
