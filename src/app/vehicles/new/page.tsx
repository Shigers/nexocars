"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Car,
  ArrowLeft,
  Save,
  Calculator,
  Upload,
  Info,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles,
} from "lucide-react";
import { formatCurrency, calculateREBUMargin } from "@/lib/utils";

export default function NewVehiclePage() {
  const router = useRouter();

  // Form states
  const [dealership, setDealership] = useState("Orlando Cars");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [version, setVersion] = useState("");
  const [plate, setPlate] = useState("");
  const [vin, setVin] = useState("");
  const [year, setYear] = useState(2023);
  const [mileage, setMileage] = useState(45000);
  const [fuelType, setFuelType] = useState("diesel");
  const [transmission, setTransmission] = useState("automatico");
  const [powerHp, setPowerHp] = useState(150);
  const [color, setColor] = useState("Gris Metalizado");
  const [environmentalBadge, setEnvironmentalBadge] = useState("ECO");
  const [bodyType, setBodyType] = useState("suv");

  // Economics
  const [purchasePrice, setPurchasePrice] = useState(22000);
  const [preparationCosts, setPreparationCosts] = useState(850);
  const [additionalCosts, setAdditionalCosts] = useState(400);
  const [sellingPrice, setSellingPrice] = useState(27900);
  const [financedPrice, setFinancedPrice] = useState(26400);

  // Auto-calculated
  const totalCost = Number(purchasePrice) + Number(preparationCosts) + Number(additionalCosts);
  const marginData = calculateREBUMargin(Number(sellingPrice), totalCost);

  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert(`Vehículo ${brand} ${model} (${plate}) registrado con éxito en ${dealership}!`);
      router.push("/vehicles");
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/vehicles"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Alta de Nuevo Vehículo
            </h1>
            <p className="text-xs text-slate-400">
              Introduce las especificaciones técnicas y los costes de compra para calcular el margen REBU
            </p>
          </div>
        </div>

        {/* Selected Dealership Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
          <Building2 className="w-3.5 h-3.5" />
          <span>{dealership}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Technical Details (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Identification & Registration */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-sm font-bold text-white">
              <Car className="w-4 h-4 text-blue-400" />
              <span>Identificación del Vehículo</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Concesionario
                </label>
                <select
                  value={dealership}
                  onChange={(e) => setDealership(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Orlando Cars">Orlando Cars (Central)</option>
                  <option value="Loewe Cars">Loewe Cars (Showroom Alta Gama)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Matrícula *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. 5421-MCB"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono font-bold text-white uppercase focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Número de Bastidor (VIN) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="17 caracteres alfanuméricos"
                  value={vin}
                  onChange={(e) => setVin(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white uppercase focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Marca *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Audi, BMW, Mercedes..."
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Modelo *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Q5, Serie 3, Clase A..."
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Versión / Acabado</label>
                <input
                  type="text"
                  placeholder="ej. S Line S-Tronic 204CV"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Technical Specifications */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-sm font-bold text-white">
              <Info className="w-4 h-4 text-blue-400" />
              <span>Ficha Técnica y Homologación</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Año</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Kilómetros</label>
                <input
                  type="number"
                  value={mileage}
                  onChange={(e) => setMileage(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Potencia (CV)</label>
                <input
                  type="number"
                  value={powerHp}
                  onChange={(e) => setPowerHp(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Etiqueta DGT</label>
                <select
                  value={environmentalBadge}
                  onChange={(e) => setEnvironmentalBadge(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                >
                  <option value="ECO">ECO</option>
                  <option value="0">0 Emisiones</option>
                  <option value="C">C (Verde)</option>
                  <option value="B">B (Amarilla)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Combustible</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                >
                  <option value="diesel">Diésel</option>
                  <option value="gasolina">Gasolina</option>
                  <option value="hibrido">Híbrido MHEV / HEV</option>
                  <option value="hibrido_enchufable">Híbrido Enchufable (PHEV)</option>
                  <option value="electrico">Eléctrico 100%</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Transmisión</label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                >
                  <option value="automatico">Automático</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Color Carrocería</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Breakdown & Live REBU Calculator */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-[#0b1322] border border-blue-900/40 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-sm font-bold text-white">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>Calculadora de Márgenes & REBU</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Coste de Adquisición / Compra (€)
                </label>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Gastos de Taller / Chapa / Pintura (€)
                </label>
                <input
                  type="number"
                  value={preparationCosts}
                  onChange={(e) => setPreparationCosts(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-300"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Transporte, Garantía Mecánica e ITV (€)
                </label>
                <input
                  type="number"
                  value={additionalCosts}
                  onChange={(e) => setAdditionalCosts(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-300"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Coste Total Consolidado:</span>
                <span className="text-sm font-black text-white">{formatCurrency(totalCost)}</span>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Precio Venta Contado (PVP €) *
                  </label>
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-blue-950/40 border border-blue-500/40 rounded-xl text-sm font-black text-blue-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Precio Financiado (€)
                  </label>
                  <input
                    type="number"
                    value={financedPrice}
                    onChange={(e) => setFinancedPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300"
                  />
                </div>
              </div>

              {/* Dynamic REBU Breakdown Card */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Margen Bruto:</span>
                  <span className="font-bold text-white">
                    {formatCurrency(marginData.grossProfit)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Base Imponible REBU (21%):</span>
                  <span>{formatCurrency(marginData.taxBase)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>IVA Repercutido a Ingresar:</span>
                  <span className="text-amber-300">{formatCurrency(marginData.vatToPay)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-emerald-500/20 text-emerald-400 font-extrabold text-sm">
                  <span>Beneficio Neto Estimado:</span>
                  <span>{formatCurrency(marginData.netProfit)}</span>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Guardando en el Sistema..." : "Publicar y Guardar en Stock"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
