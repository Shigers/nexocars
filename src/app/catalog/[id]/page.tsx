"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  Car,
  ArrowLeft,
  Phone,
  MessageSquare,
  ShieldCheck,
  Calendar,
  Gauge,
  Fuel,
  Sparkles,
  CheckCircle2,
  MapPin,
  Clock,
  Calculator,
  Lock,
  Share2,
} from "lucide-react";
import { getStoredVehicles } from "@/lib/storage";
import { formatCurrency, formatNumber, getFuelLabel } from "@/lib/utils";
import { Vehicle } from "@/types";
import { mockVehicles } from "@/lib/mock-data";

export default function PublicVehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [selectedPhoto, setSelectedPhoto] = useState<string>("");

  // Finance Simulator
  const [deposit, setDeposit] = useState<number>(0);
  const [months, setMonths] = useState<number>(72);

  useEffect(() => {
    const list = getStoredVehicles();
    setVehicles(list);
    const found = list.find((v) => v.id === resolvedParams.id);
    if (found && found.images && found.images.length > 0) {
      setSelectedPhoto(found.images[0]);
    }
  }, [resolvedParams.id]);

  const vehicle = vehicles.find((v) => v.id === resolvedParams.id) || vehicles[0];

  const currentPhoto = selectedPhoto || (vehicle.images && vehicle.images[0]) || "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80";

  // Financial calculation
  const financedBase = Math.max(1000, (vehicle.financed_price || vehicle.selling_price) - deposit);
  const monthlyRate = 0.079 / 12; // 7.9% APR
  const monthlyPayment = Math.round(
    (financedBase * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
      (Math.pow(1 + monthlyRate, months) - 1)
  );

  const isLoewe = vehicle.company_id === "comp-loewe";

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col">
      {/* Public Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#070b13]/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/catalog" className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span>Volver al Catálogo</span>
          </Link>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/34658803533?text=Hola%20Orlando%20Cars,%20estoy%20interesado%20en%20el%20${encodeURIComponent(vehicle.brand + " " + vehicle.model)}%20(${vehicle.plate})`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contactar por WhatsApp</span>
            </a>

            <Link
              href={`/vehicles/${vehicle.id}`}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs"
              title="Abrir en el ERP de gestión"
            >
              <Lock className="w-4 h-4 text-amber-400" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Detail Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 space-y-6 w-full">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                isLoewe ? "bg-purple-500/20 text-purple-300" : "bg-blue-500/20 text-blue-300"
              }`}>
                {isLoewe ? "Loewe Cars Exclusive" : "Orlando Cars Ocasión"}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                Etiqueta DGT: {vehicle.environmental_badge}
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white">
              {vehicle.brand} {vehicle.model}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">{vehicle.version}</p>
          </div>

          <div className="flex items-end gap-6">
            <div>
              <span className="text-xs text-slate-400 block">PVP al contado</span>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {formatCurrency(vehicle.selling_price)}
              </div>
            </div>
            {vehicle.financed_price && (
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-950/60 to-slate-900 border border-blue-500/30">
                <span className="text-[10px] text-blue-300 font-bold block">PVP Financiado</span>
                <span className="text-lg font-black text-blue-400">
                  {formatCurrency(vehicle.financed_price)}
                </span>
                <span className="text-[10px] text-cyan-300 block font-semibold">
                  Desde {monthlyPayment} € / mes
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Gallery & Finance Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: High-Res Gallery */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
              <img
                src={currentPhoto}
                alt={vehicle.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Strip */}
            {vehicle.images && vehicle.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {vehicle.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhoto(img)}
                    className={`relative w-24 aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      currentPhoto === img
                        ? "border-blue-500 shadow-md scale-105"
                        : "border-slate-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Foto ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Vehicle Description */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Descripción del Vehículo
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {vehicle.description}
              </p>
            </div>

            {/* Equipment Grid */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Equipamiento Incluido & Seguridad
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {vehicle.equipment_list.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Financial Calculator & Direct Booking */}
          <div className="space-y-6">
            {/* Finance Simulator Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-[#0a1122] to-slate-900 border border-blue-900/40 space-y-5 shadow-2xl">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Calculadora de Financiación</h3>
              </div>

              {/* Monthly Result Box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-blue-500/30 text-center space-y-1">
                <span className="text-[11px] text-slate-400 block">Tu cuota estimada</span>
                <span className="text-3xl font-black text-cyan-400 block">
                  {monthlyPayment} € <span className="text-xs text-slate-400 font-normal">/ mes</span>
                </span>
                <span className="text-[10px] text-slate-500 block">Sin entrada obligatoria • Respuesta en 24h</span>
              </div>

              {/* Deposit Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Entrada inicial:</span>
                  <span className="font-bold text-white">{formatCurrency(deposit)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={Math.round(vehicle.selling_price * 0.6)}
                  step={500}
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              {/* Months Selector */}
              <div className="space-y-2">
                <span className="text-xs text-slate-400 font-medium block">Plazo de financiación:</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[48, 60, 72, 84].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMonths(m)}
                      className={`py-1.5 text-xs font-bold rounded-xl transition-all ${
                        months === m
                          ? "bg-blue-600 text-white shadow"
                          : "bg-slate-950 text-slate-400 hover:text-white"
                      }`}
                    >
                      {m} m
                    </button>
                  ))}
                </div>
              </div>

              {/* Request Finance Button */}
              <a
                href={`https://wa.me/34658803533?text=Hola%20Orlando%20Cars,%20quiero%20solicitar%20el%20estudio%20de%20financiación%20para%20el%20${encodeURIComponent(vehicle.brand + " " + vehicle.model)}%20con%20cuota%20de%20${monthlyPayment}€/mes%20y%20entrada%20de%20${deposit}€`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30"
              >
                <Sparkles className="w-4 h-4" />
                <span>Solicitar Estudio de Financiación</span>
              </a>
            </div>

            {/* Technical Specs Summary */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Ficha Técnica Certificada
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Kilometraje:</span>
                  <span className="font-bold text-white">{formatNumber(vehicle.mileage)} km</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Año de Matriculación:</span>
                  <span className="font-bold text-white">{vehicle.year}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Combustible:</span>
                  <span className="font-bold text-white capitalize">{getFuelLabel(vehicle.fuel_type)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Transmisión:</span>
                  <span className="font-bold text-white capitalize">{vehicle.transmission}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Potencia:</span>
                  <span className="font-bold text-white">{vehicle.power_hp} CV</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Garantía Mecánica:</span>
                  <span className="font-bold text-emerald-400">12 Meses Incluida</span>
                </div>
              </div>
            </div>

            {/* Direct Contact Card */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
              <h3 className="font-bold text-white">¿Quieres ver o probar este coche?</h3>
              <p className="text-slate-400">
                Pide tu cita previa en nuestras instalaciones de Paterna o solicita entrega a domicilio en cualquier punto de España.
              </p>
              <div className="space-y-2 pt-1">
                <a
                  href="tel:+34961475660"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Llamar al 96 147 5660</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}