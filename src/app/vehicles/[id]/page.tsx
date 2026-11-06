"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Car,
  Calendar,
  Fuel,
  Gauge,
  ShieldCheck,
  Receipt,
  Share2,
  Users,
  FileText,
  Clock,
  Printer,
  Edit,
  Building2,
  ExternalLink,
  Plus,
  Sparkles,
  CheckCircle,
  Wand2,
  SlidersHorizontal,
  RefreshCw,
  Image as ImageIcon,
  Check,
  Eye,
  AlertTriangle,
  Upload,
  Coins,
  TrendingDown,
} from "lucide-react";
import { mockVehicles, mockExpenses, mockPortals, mockLeads } from "@/lib/mock-data";
import {
  formatCurrency,
  formatNumber,
  formatDate,
  getVehicleStatusBadge,
  getFuelLabel,
  calculateREBUMargin,
  calculateRealCurrentMargin,
  HOLDING_COST_PER_DAY,
} from "@/lib/utils";
import { getStoredVehicles, saveVehicle } from "@/lib/storage";
import { Vehicle } from "@/types";

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);

  useEffect(() => {
    setVehicles(getStoredVehicles());
  }, []);

  const vehicle = vehicles.find((v) => v.id === resolvedParams.id) || vehicles[0] || mockVehicles[0];

  const [activeTab, setActiveTab] = useState<
    "general" | "fotos" | "gastos" | "publicaciones" | "leads" | "docs" | "historial"
  >("general");

  const [selectedPhoto, setSelectedPhoto] = useState(vehicle.images[0]);
  const [studioProcessing, setStudioProcessing] = useState(false);
  const [studioStatusText, setStudioStatusText] = useState("");
  const [activeEnhancement, setActiveEnhancement] = useState<"none" | "scratch_removed" | "showroom" | "plate_cover">("none");
  const [showOriginal, setShowOriginal] = useState(false);

  const vehicleExpenses = mockExpenses.filter((e) => e.vehicle_id === vehicle.id);
  const matchedLeads = mockLeads.filter((l) => l.vehicle_id === vehicle.id);
  const statusBadge = getVehicleStatusBadge(vehicle.status);
  
  // Real Financial Holding Engine
  const marginReal = calculateRealCurrentMargin(vehicle.selling_price, vehicle.total_cost, vehicle.days_in_stock);

  const handleApplyAIEnhancement = (type: "scratch_removed" | "showroom" | "plate_cover") => {
    setStudioProcessing(true);
    setActiveEnhancement("none");

    const steps = [
      "Segmentando geometría del vehículo con red neuronal...",
      type === "scratch_removed"
        ? "Identificando rozaduras y picotazos en aletas / paragolpes..."
        : type === "showroom"
        ? "Eliminando fondo de calle y generando suelo pulido de concesionario..."
        : "Reconociendo placa de matrícula y ajustando cubrematrículas corporativo...",
      "Generando textura de pintura y reflejos de luz natural...",
      "Optimizando nitidez y balance de blancos para portales...",
    ];

    let i = 0;
    setStudioStatusText(steps[0]);

    const interval = setInterval(() => {
      i++;
      if (i < steps.length) {
        setStudioStatusText(steps[i]);
      } else {
        clearInterval(interval);
        setStudioProcessing(false);
        setActiveEnhancement(type);
      }
    }, 700);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newUrl = event.target.result as string;
          const updatedImages = [newUrl, ...vehicle.images];
          const updatedVeh = { ...vehicle, images: updatedImages };
          saveVehicle(updatedVeh);
          setSelectedPhoto(newUrl);
          setVehicles(getStoredVehicles());
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/vehicles"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-white text-slate-950 font-mono text-xs font-black">
                {vehicle.plate}
              </span>
              <h1 className="text-xl font-bold tracking-tight text-white">
                {vehicle.brand} {vehicle.model}
              </h1>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold ${statusBadge.className}`}
              >
                {statusBadge.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              VIN: {vehicle.vin} • Ubicación: {vehicle.location}
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Ficha</span>
          </button>

          <button
            onClick={() =>
              alert(
                `Texto comercial generado por IA para ${vehicle.title}:\n\n¡Ocasión única! ${vehicle.title} en estado impecable. ${vehicle.description}`
              )
            }
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 text-xs font-semibold transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Redactar Anuncio IA</span>
          </button>
        </div>
      </div>

      {/* Hero Strip: Key Specs & Holding Cost Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">PVP Contado</span>
          <span className="text-lg font-black text-white">{formatCurrency(vehicle.selling_price)}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Coste Total</span>
          <span className="text-lg font-bold text-slate-300">{formatCurrency(vehicle.total_cost)}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Margen Real Hoy</span>
          <span className="text-lg font-black text-emerald-400">
            +{formatCurrency(marginReal.realMarginToday)}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Coste Campa (14€/d)</span>
          <span className="text-sm font-bold text-amber-400">
            -{formatCurrency(marginReal.holdingLoss)}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Días en Stock</span>
          <span className="text-sm font-bold text-white">
            {vehicle.days_in_stock} días
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Días a Margen 0</span>
          <span className={`text-sm font-bold ${marginReal.isAtRisk ? "text-red-400 animate-pulse" : "text-emerald-400"}`}>
            {marginReal.daysToZero > 0 ? `${marginReal.daysToZero} días` : "En riesgo"}
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto text-xs font-medium pb-px">
        {[
          { key: "general", label: "Información General", icon: Car },
          { key: "fotos", label: `Fotografías & Estudio IA (${vehicle.images.length})`, icon: Wand2 },
          { key: "gastos", label: `Gastos & Margen Real (${vehicleExpenses.length})`, icon: Receipt },
          { key: "publicaciones", label: "Publicaciones Portales", icon: ExternalLink },
          { key: "leads", label: `Clientes Interesados (${matchedLeads.length})`, icon: Users },
          { key: "docs", label: "Documentación & PDF", icon: FileText },
          { key: "historial", label: "Historial de Cambios", icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? "border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-xl"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: General */}
      {activeTab === "general" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white">Descripción Comercial</h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {vehicle.description}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white">Equipamiento Destacado</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {vehicle.equipment_list.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white">Datos de Procedencia</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Proveedor:</span>
                  <span className="font-semibold text-white">{vehicle.supplier_name || "Particular"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Fecha de Compra:</span>
                  <span className="text-slate-200">{formatDate(vehicle.purchase_date)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Régimen Fiscal:</span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold text-[10px]">
                    {vehicle.tax_scheme}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Concesionario:</span>
                  <span className="text-slate-200 font-semibold">{vehicle.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Photographs & AI Photo Studio */}
      {activeTab === "fotos" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: The High-Res Viewer */}
            <div className="lg:col-span-2 space-y-3">
              <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group">
                <img
                  src={selectedPhoto}
                  alt={vehicle.title}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    activeEnhancement === "showroom" && !showOriginal
                      ? "brightness-105 contrast-105 saturate-110"
                      : activeEnhancement === "scratch_removed" && !showOriginal
                      ? "filter contrast-100"
                      : ""
                  }`}
                />

                {/* AI Scratch Removal Hologram Indicator */}
                {activeEnhancement === "scratch_removed" && !showOriginal && (
                  <div className="absolute inset-0 pointer-events-none border-2 border-emerald-500/40 rounded-3xl flex items-center justify-center">
                    <div className="absolute top-6 right-6 px-3 py-1.5 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-xl flex items-center gap-2 backdrop-blur-md">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Defectos & Rayones Eliminados por IA (Inpainting)</span>
                    </div>

                    <div className="absolute bottom-8 left-8 p-3 rounded-2xl bg-black/80 border border-emerald-500/30 text-white text-xs max-w-sm backdrop-blur-md">
                      <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <Check className="w-4 h-4" />
                        Pintura restaurada digitalmente
                      </p>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Lista para publicar en portales mientras el vehículo entra en cabina de pintura.
                      </p>
                    </div>
                  </div>
                )}

                {/* Showroom Virtual Mode Indicator */}
                {activeEnhancement === "showroom" && !showOriginal && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="absolute top-6 right-6 px-3 py-1.5 rounded-xl bg-purple-950/90 border border-purple-500/40 text-purple-300 text-xs font-bold shadow-xl flex items-center gap-2 backdrop-blur-md">
                      <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                      <span>Fondo Showroom Orlando Cars / Loewe Cars</span>
                    </div>
                  </div>
                )}

                {/* Plate Cover Indicator */}
                {activeEnhancement === "plate_cover" && !showOriginal && (
                  <div className="absolute bottom-6 right-6 px-3 py-1.5 rounded-xl bg-blue-950/90 border border-blue-500/40 text-blue-300 text-xs font-bold shadow-xl flex items-center gap-2 backdrop-blur-md">
                    <Car className="w-3.5 h-3.5 text-blue-400" />
                    <span>Cubrematrículas Corporativo Oficial Aplicado</span>
                  </div>
                )}

                {/* Loading / Processing HUD Overlay */}
                {studioProcessing && (
                  <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center space-y-4 p-6 text-center z-30">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
                      <Wand2 className="w-6 h-6 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white tracking-wide">
                        Motor de Retoque Automotriz IA
                      </p>
                      <p className="text-xs text-cyan-300 font-mono animate-pulse">
                        {studioStatusText}
                      </p>
                    </div>
                  </div>
                )}

                {/* Compare Button */}
                {activeEnhancement !== "none" && !studioProcessing && (
                  <button
                    onMouseDown={() => setShowOriginal(true)}
                    onMouseUp={() => setShowOriginal(false)}
                    onTouchStart={() => setShowOriginal(true)}
                    onTouchEnd={() => setShowOriginal(false)}
                    className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-black border border-white/20 text-white text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1.5 shadow-2xl"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{showOriginal ? "Mostrando Original con Daño" : "Mantén pulsado para comparar"}</span>
                  </button>
                )}
              </div>

              {/* Photos Grid & Real Upload Button */}
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-slate-300">Galería del Vehículo ({vehicle.images.length})</span>
                <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600 hover:text-white transition-all text-xs font-semibold">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir Fotos de tu PC / Móvil</span>
                  <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {vehicle.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedPhoto(img);
                      setActiveEnhancement("none");
                    }}
                    className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all ${
                      selectedPhoto === img
                        ? "border-blue-500 scale-105 shadow-lg shadow-blue-500/20"
                        : "border-slate-800 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Foto ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: AI Car Studio Control Panel */}
            <div className="p-5 rounded-3xl bg-gradient-to-b from-slate-900 via-[#0a1120] to-slate-900 border border-slate-800 space-y-5 shadow-2xl">
              <div>
                <div className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Estudio Fotográfico IA</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Optimiza fotos para portales antes de que el coche entre en taller. Retoca desperfectos y sustituye fondos al estilo Dealcar.
                </p>
              </div>

              {/* Action 1 */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-emerald-500/40 transition-all space-y-2 group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                    1. Quitar Rayones & Defectos
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    Inpainting IA
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Elimina rozaduras en paragolpes o marcas si el coche se va a reparar en taller de chapa y pintura.
                </p>
                <button
                  onClick={() => handleApplyAIEnhancement("scratch_removed")}
                  disabled={studioProcessing}
                  className="w-full mt-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Eliminar Defectos Estéticos</span>
                </button>
              </div>

              {/* Action 2 */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-purple-500/40 transition-all space-y-2 group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">
                    2. Fondo Showroom de Lujo
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                    Estudio Virtual
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Sustituye la foto en campa por una sala de exposición limpia con suelo pulido y branding de Orlando / Loewe Cars.
                </p>
                <button
                  onClick={() => handleApplyAIEnhancement("showroom")}
                  disabled={studioProcessing}
                  className="w-full mt-2 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Generar Fondo de Showroom</span>
                </button>
              </div>

              {/* Action 3 */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-blue-500/40 transition-all space-y-2 group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                    3. Cubrematrículas Oficial
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                    Branding
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Oculta la matrícula original y coloca la placa decorativa oficial para proteger la identidad del vehículo.
                </p>
                <button
                  onClick={() => handleApplyAIEnhancement("plate_cover")}
                  disabled={studioProcessing}
                  className="w-full mt-2 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5"
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>Aplicar Placa Orlando / Loewe</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Expenses & Margins with Real Holding Cost Matrix */}
      {activeTab === "gastos" && (
        <div className="space-y-6">
          {/* Holding Cost Matrix Alert */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#101b30] to-slate-900 border border-blue-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Auditoría Financiera de Campa (Erosión por Días de Inmovilización)
                </h3>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                Tasa de Campa: 14 € / día
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Margen Bruto Inicial REBU</span>
                <span className="text-sm font-bold text-white">+{formatCurrency(marginReal.initialGrossMargin)}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Coste Acumulado ({vehicle.days_in_stock} días)</span>
                <span className="text-sm font-bold text-red-400">-{formatCurrency(marginReal.holdingLoss)}</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <span className="text-[10px] text-emerald-300 block">Margen Real a Día de Hoy</span>
                <span className="text-sm font-black text-emerald-400">+{formatCurrency(marginReal.realMarginToday)}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Días Restantes a Margen 0</span>
                <span className={`text-sm font-bold ${marginReal.isAtRisk ? "text-red-400" : "text-cyan-400"}`}>
                  {marginReal.daysToZero > 0 ? `${marginReal.daysToZero} días` : "¡Sin margen!"}
                </span>
              </div>
            </div>

            {/* Price cut suggestion if stock is slow */}
            {vehicle.days_in_stock >= 40 && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-amber-300">
                  <TrendingDown className="w-4 h-4" />
                  <span>
                    <strong>Recomendación del Copiloto:</strong> Bajar precio de {formatCurrency(vehicle.selling_price)} a{" "}
                    <strong>{formatCurrency(marginReal.suggestedPrice)}</strong> para acelerar venta conservando margen.
                  </span>
                </div>
                <button
                  onClick={() => alert(`Precio actualizado a ${formatCurrency(marginReal.suggestedPrice)}`)}
                  className="px-3 py-1 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-500"
                >
                  Aplicar Bajada
                </button>
              </div>
            )}
          </div>

          {/* Expenses Table */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Desglose de Gastos por Bastidor
              </h3>
              <button
                onClick={() => alert("Añadir nuevo gasto imputado...")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Imputar Gasto</span>
              </button>
            </div>

            <div className="divide-y divide-slate-800 text-xs">
              {vehicleExpenses.length === 0 ? (
                <p className="p-4 text-slate-400 text-center">No hay gastos adicionales registrados.</p>
              ) : (
                vehicleExpenses.map((exp) => (
                  <div key={exp.id} className="p-4 flex items-center justify-between hover:bg-slate-800/40">
                    <div>
                      <p className="font-semibold text-white">{exp.description}</p>
                      <p className="text-[11px] text-slate-400">
                        {exp.provider_name} • Factura: {exp.invoice_number || "S/N"} • Fecha: {formatDate(exp.invoice_date)}
                      </p>
                    </div>
                    <span className="font-bold text-amber-300 text-sm">
                      {formatCurrency(exp.amount)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Multi-portal Publications */}
      {activeTab === "publicaciones" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Sincronización automática de este vehículo en los principales portales de compraventa automotriz.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockPortals.map((p) => (
              <div
                key={p.portal}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.logo}</span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{p.name}</h4>
                    <p className="text-[11px] text-slate-400">{p.last_synced}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${
                      p.status === "publicado"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Leads */}
      {activeTab === "leads" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Compradores interesados en este vehículo
            </h3>
            {matchedLeads.length === 0 ? (
              <p className="text-xs text-slate-400">No hay oportunidades abiertas vinculadas a esta matrícula.</p>
            ) : (
              <div className="space-y-3">
                {matchedLeads.map((l) => (
                  <div
                    key={l.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-white">{l.customer_name}</p>
                      <p className="text-[11px] text-slate-400">
                        {l.customer_phone} • Origen: {l.source} • Comercial: {l.assigned_to_name}
                      </p>
                    </div>
                    <Link
                      href="/crm"
                      className="px-3 py-1 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-500"
                    >
                      Ver en CRM
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Docs */}
      {activeTab === "docs" && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Expediente Digital del Vehículo
          </h3>
          <div className="space-y-2 text-xs">
            {[
              { name: "Contrato de Compraventa Oficial (REBU)", status: "Generado", icon: FileText },
              { name: "Ficha Técnica y Permiso de Circulación (DGT)", status: "Verificado", icon: ShieldCheck },
              { name: "Póliza Garantía Mecánica 12 Meses GarantiPLUS", status: "Emitida", icon: CheckCircle },
              { name: "Hoja de Entrega y Recepción de Vehículo", status: "Borrador", icon: FileText },
            ].map((doc, idx) => {
              const Icon = doc.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold text-slate-200">{doc.name}</span>
                  </div>
                  <button
                    onClick={() => alert(`Descargando documento PDF: ${doc.name}`)}
                    className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-xs"
                  >
                    Descargar PDF
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: History */}
      {activeTab === "historial" && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <h3 className="font-bold text-white uppercase tracking-wider text-xs">
            Registro Inmutable de Actividad
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></span>
              <div>
                <p className="font-semibold text-white">Publicado en Coches.net y AutoScout24</p>
                <p className="text-[11px] text-slate-400">Hace 3 horas por Sistema Nexo-Car</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5"></span>
              <div>
                <p className="font-semibold text-white">Gasto de taller añadido (420 € - Chapa y Pintura)</p>
                <p className="text-[11px] text-slate-400">18 de Septiembre por Taller Central</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5"></span>
              <div>
                <p className="font-semibold text-white">Entrada en inventario y tasación confirmada</p>
                <p className="text-[11px] text-slate-400">15 de Septiembre por Gerencia Orlando Cars</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
