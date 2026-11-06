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
  Camera,
  Image as ImageIcon,
} from "lucide-react";
import { formatCurrency, calculateREBUMargin } from "@/lib/utils";
import { saveVehicle } from "@/lib/storage";
import { Vehicle } from "@/types";

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
  const [fuelType, setFuelType] = useState<any>("diesel");
  const [transmission, setTransmission] = useState<any>("automatico");
  const [powerHp, setPowerHp] = useState(150);
  const [color, setColor] = useState("Gris Metalizado");
  const [environmentalBadge, setEnvironmentalBadge] = useState<any>("ECO");
  const [bodyType, setBodyType] = useState("suv");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80");
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setUploadedPhotos((prev) => [dataUrl, ...prev]);
          setImageUrl(dataUrl); // Set as main image
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const allImages = uploadedPhotos.length > 0 ? uploadedPhotos : [imageUrl];

    const newVehicle: Vehicle = {
      id: `veh-${Date.now()}`,
      company_id: dealership === "Orlando Cars" ? "comp-orlando" : "comp-loewe",
      brand,
      model,
      version: version || "Acabado Superior",
      plate,
      vin,
      year: Number(year),
      mileage: Number(mileage),
      fuel_type: fuelType,
      transmission,
      power_hp: Number(powerHp),
      color,
      doors: 5,
      seats: 5,
      environmental_badge: environmentalBadge,
      body_type: bodyType,
      purchase_price: Number(purchasePrice),
      preparation_costs: Number(preparationCosts),
      additional_costs: Number(additionalCosts),
      total_cost: totalCost,
      selling_price: Number(sellingPrice),
      financed_price: Number(financedPrice),
      min_selling_price: Number(sellingPrice) * 0.96,
      tax_scheme: "REBU",
      status: "disponible",
      location: dealership === "Orlando Cars" ? "Exposición Central - Orlando Cars" : "Showroom Exclusivo Loewe Cars",
      purchase_date: new Date().toISOString().split("T")[0],
      supplier_name: "Particular / Adquisición Directa",
      title: `${brand} ${model} ${version} ${powerHp}CV`,
      description: `Vehículo recién incorporado a la flota de ${dealership}. Revisión de 150 puntos superada con éxito. Garantía mecánica completa de 12 meses. Historial verificado.`,
      images: allImages,
      equipment_list: [
        "Etiqueta DGT " + environmentalBadge,
        "Garantía Mecánica 12 Meses",
        "Revisión Oficial Pre-Entrega",
        "Financiación a Medida",
      ],
      is_featured: true,
      published_on_web: true,
      days_in_stock: 0,
      created_at: new Date().toISOString(),
    };

    saveVehicle(newVehicle);

    setTimeout(() => {
      setSaving(false);
      router.push(`/vehicles/${newVehicle.id}`);
    }, 400);
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
              Persistencia real en el sistema con cálculo automático de margen REBU e integración en el stock
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
          {/* Section 0: HIGH PRIORITY PHOTO UPLOAD BOX (PC / MOBILE) */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-950/40 via-slate-900 to-slate-900 border-2 border-blue-500/40 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Fotografías del Vehículo (PC o Móvil)</h2>
                  <p className="text-[11px] text-slate-400">Sube fotos directamente desde los archivos de tu ordenador o usa la cámara de tu móvil</p>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                ✓ Almacenamiento Local Activo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: File from PC */}
              <label className="cursor-pointer group flex flex-col items-center justify-center p-6 rounded-xl bg-slate-950 border-2 border-dashed border-blue-500/40 hover:border-blue-400 hover:bg-blue-600/5 transition-all text-center">
                <Upload className="w-7 h-7 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white group-hover:text-blue-300">
                  💻 Seleccionar desde Ordenador
                </span>
                <span className="text-[11px] text-slate-400 mt-1">
                  Arrastra o examina imágenes (JPG, PNG, WEBP)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Option 2: Direct Mobile Camera */}
              <label className="cursor-pointer group flex flex-col items-center justify-center p-6 rounded-xl bg-slate-950 border-2 border-dashed border-purple-500/40 hover:border-purple-400 hover:bg-purple-600/5 transition-all text-center">
                <Camera className="w-7 h-7 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white group-hover:text-purple-300">
                  📱 Tomar Foto con el Teléfono
                </span>
                <span className="text-[11px] text-slate-400 mt-1">
                  Abre la cámara directamente en el móvil
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Uploaded Photos Preview Grid */}
            {uploadedPhotos.length > 0 ? (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {uploadedPhotos.length} {uploadedPhotos.length === 1 ? "foto cargada" : "fotos cargadas"} para este vehículo
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedPhotos([]);
                      setImageUrl("https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80");
                    }}
                    className="text-[11px] text-red-400 hover:underline"
                  >
                    Borrar todas
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {uploadedPhotos.map((photo, i) => (
                    <div key={i} className="relative aspect-[16/10] rounded-xl overflow-hidden border border-blue-500/50 shadow">
                      <img src={photo} alt={`Subida ${i}`} className="w-full h-full object-cover" />
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-blue-600 text-white text-[9px] font-bold">
                          Portada
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 text-center italic">
                (Si no subes foto ahora, se asignará una foto provisional que luego podrás cambiar o retocar con la IA)
              </p>
            )}
          </div>

          {/* Section 1: Identification & Registration */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-sm font-bold text-white">
              <Car className="w-4 h-4 text-blue-400" />
              <span>Identificación del Vehículo</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Concesionario Destino
                </label>
                <select
                  value={dealership}
                  onChange={(e) => setDealership(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Orlando Cars">Orlando Cars (Central Alcalá)</option>
                  <option value="Loewe Cars">Loewe Cars (Showroom Pozuelo)</option>
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
                  placeholder="ej. Mercedes-Benz, Audi, BMW..."
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
                  placeholder="ej. Clase A, Q5, Serie 3..."
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Versión / Acabado</label>
                <input
                  type="text"
                  placeholder="ej. 200d AMG Line 8G-DCT"
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
