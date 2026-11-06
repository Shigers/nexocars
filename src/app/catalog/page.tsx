"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Car,
  Search,
  Filter,
  Phone,
  MessageSquare,
  ShieldCheck,
  Calendar,
  Gauge,
  Fuel,
  Sparkles,
  ChevronRight,
  MapPin,
  Clock,
  Building2,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { getStoredVehicles } from "@/lib/storage";
import { formatCurrency, formatNumber, getFuelLabel } from "@/lib/utils";
import { Vehicle } from "@/types";
import { mockDealership } from "@/lib/mock-data";

export default function PublicCatalogPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedBody, setSelectedBody] = useState("all");
  const [selectedFuel, setSelectedFuel] = useState("all");
  const [maxMonthly, setMaxMonthly] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [dealershipFilter, setDealershipFilter] = useState<"all" | "orlando" | "loewe">("all");

  useEffect(() => {
    setVehicles(getStoredVehicles());
    const handleUpdate = () => setVehicles(getStoredVehicles());
    window.addEventListener("nexo_storage_updated", handleUpdate);
    return () => window.removeEventListener("nexo_storage_updated", handleUpdate);
  }, []);

  const calculateMonthlyEstimate = (sellingPrice: number, financedPrice?: number) => {
    const base = financedPrice || sellingPrice * 0.95;
    // Standard auto loan: 72 months, 7.9% APR, no deposit
    const monthlyRate = 0.079 / 12;
    const months = 72;
    const payment = (base * (monthlyRate * Math.pow(1 + monthlyRate, months))) / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(payment);
  };

  const filtered = vehicles.filter((v) => {
    if (v.status === "vendido") return false;

    const matchesSearch =
      v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBrand = selectedBrand === "all" || v.brand === selectedBrand;
    const matchesBody = selectedBody === "all" || v.body_type === selectedBody;
    const matchesFuel = selectedFuel === "all" || v.fuel_type === selectedFuel;

    const matchesDealership =
      dealershipFilter === "all"
        ? true
        : dealershipFilter === "orlando"
        ? v.company_id === "comp-orlando"
        : v.company_id === "comp-loewe";

    const monthly = calculateMonthlyEstimate(v.selling_price, v.financed_price);
    const matchesMonthly = maxMonthly === 0 || monthly <= maxMonthly;

    return matchesSearch && matchesBrand && matchesBody && matchesFuel && matchesDealership && matchesMonthly;
  });

  const allBrands = Array.from(new Set(vehicles.map((v) => v.brand))).sort();

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col">
      {/* Public Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#070b13]/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-900/30">
              O
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">ORLANDO CARS</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                  OFICIAL
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                Paterna (Valencia) • División Alta Gama Loewe Cars
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="tel:+34961475660"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>96 147 5660</span>
            </a>

            <a
              href="https://wa.me/34658803533?text=Hola%20Orlando%20Cars,%20estoy%20viendo%20vuestro%20stock%20online"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Ventas</span>
            </a>

            {/* Back to ERP Link */}
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
              title="Volver al panel interno de control de Orlando Cars"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Panel ERP</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Showcase Strip */}
      <section className="bg-gradient-to-b from-blue-950/30 via-[#0a1122] to-[#070b13] border-b border-slate-800/80 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Vehículos de Ocasión, Seminuevos e Industriales Garantizados</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Encuentra tu próximo coche en Orlando Cars
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1.5">
                Revisión técnica de 150 puntos, historial certificado, financiación a tu medida en menos de 24 horas y 12 meses de garantía europea completa.
              </p>
            </div>

            {/* Dealership Division Switcher */}
            <div className="flex items-center justify-center sm:justify-start gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold self-center lg:self-auto">
              <button
                onClick={() => setDealershipFilter("all")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  dealershipFilter === "all"
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Todo el Stock ({vehicles.filter(v => v.status !== "vendido").length})
              </button>
              <button
                onClick={() => setDealershipFilter("orlando")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  dealershipFilter === "orlando"
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Orlando Cars (Paterna)
              </button>
              <button
                onClick={() => setDealershipFilter("loewe")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  dealershipFilter === "loewe"
                    ? "bg-purple-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Loewe Cars Exclusive
              </button>
            </div>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] text-slate-300">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Garantía Mecánica 12 Meses</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>Revisión Oficial 150 Puntos</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Financiación al 100% Sin Entrada</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>Paterna (Pol. Fuente del Jarro)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 space-y-6 w-full">
        {/* Filters Box */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por marca o modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Brand Filter */}
            <div>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              >
                <option value="all">Todas las Marcas</option>
                {allBrands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Body Type Filter */}
            <div>
              <select
                value={selectedBody}
                onChange={(e) => setSelectedBody(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              >
                <option value="all">Cualquier Carrocería</option>
                <option value="suv">SUV / Crossover</option>
                <option value="compacto">Compacto</option>
                <option value="berlina">Berlina</option>
                <option value="deportivo">Deportivo / Cupé</option>
                <option value="furgoneta">Furgoneta / Industrial</option>
              </select>
            </div>

            {/* Fuel Filter */}
            <div>
              <select
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              >
                <option value="all">Cualquier Combustible</option>
                <option value="diesel">Diésel</option>
                <option value="gasolina">Gasolina</option>
                <option value="hibrido">Híbrido ECO</option>
                <option value="electrico">100% Eléctrico 0</option>
              </select>
            </div>

            {/* Monthly Payment Filter */}
            <div>
              <select
                value={maxMonthly}
                onChange={(e) => setMaxMonthly(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              >
                <option value={0}>Cualquier Cuota Mensual</option>
                <option value={180}>Hasta 180 € / mes</option>
                <option value={250}>Hasta 250 € / mes</option>
                <option value={350}>Hasta 350 € / mes</option>
                <option value={500}>Hasta 500 € / mes</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Mostrando <strong>{filtered.length}</strong> vehículos disponibles con entrega inmediata</span>
            {(selectedBrand !== "all" || selectedBody !== "all" || selectedFuel !== "all" || maxMonthly !== 0 || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedBrand("all");
                  setSelectedBody("all");
                  setSelectedFuel("all");
                  setMaxMonthly(0);
                  setSearchTerm("");
                }}
                className="text-blue-400 hover:underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((vehicle) => {
            const monthly = calculateMonthlyEstimate(vehicle.selling_price, vehicle.financed_price);
            const isLoewe = vehicle.company_id === "comp-loewe";

            return (
              <div
                key={vehicle.id}
                className="group rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-900/10 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo Cover with Badges */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                    <img
                      src={vehicle.images[0] || "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80"}
                      alt={vehicle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase backdrop-blur-md shadow-md ${
                        isLoewe
                          ? "bg-purple-950/90 text-purple-300 border border-purple-500/40"
                          : "bg-blue-950/90 text-blue-300 border border-blue-500/40"
                      }`}>
                        {isLoewe ? "Loewe Cars Exclusive" : "Orlando Cars Ocasión"}
                      </span>

                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500 text-slate-950 shadow">
                        DGT: {vehicle.environmental_badge}
                      </span>
                    </div>

                    {/* Estimated Monthly Pill Over Image */}
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-black/85 border border-white/20 text-white backdrop-blur-md shadow-lg">
                      <span className="text-[10px] text-slate-400 block">Cuota estimada</span>
                      <span className="text-sm font-black text-cyan-400">Desde {monthly} € / mes</span>
                    </div>
                  </div>

                  {/* Vehicle Body Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
                        {vehicle.brand}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                        {vehicle.model} {vehicle.version}
                      </h3>
                    </div>

                    {/* Specs Icons */}
                    <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-800 text-[11px] text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Gauge className="w-3.5 h-3.5 text-slate-500" />
                        <span>{formatNumber(vehicle.mileage)} km</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>Año {vehicle.year}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Fuel className="w-3.5 h-3.5 text-slate-500" />
                        <span>{getFuelLabel(vehicle.fuel_type)}</span>
                      </div>
                    </div>

                    {/* Price Block */}
                    <div className="flex items-end justify-between pt-1">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Precio al contado</span>
                        <div className="text-xl font-black text-white">
                          {formatCurrency(vehicle.selling_price)}
                        </div>
                      </div>
                      {vehicle.financed_price && (
                        <div className="text-right">
                          <span className="text-[10px] text-blue-400 font-semibold block">Precio Financiado</span>
                          <span className="text-sm font-bold text-blue-300">
                            {formatCurrency(vehicle.financed_price)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-2">
                  <a
                    href={`https://wa.me/34658803533?text=Hola%20Orlando%20Cars,%20estoy%20interesado%20en%20el%20${encodeURIComponent(vehicle.brand + " " + vehicle.model)}%20(${vehicle.plate})%20por%20${vehicle.selling_price}€`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <Link
                    href={`/catalog/${vehicle.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all border border-slate-700"
                  >
                    <span>Ver Ficha 360°</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Public Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-10 px-4 sm:px-6 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-bold text-white text-sm mb-2">Orlando Cars Ocasión</h4>
            <p className="text-[11px] leading-relaxed">
              Especialistas en vehículos seminuevos, turismos y furgonetas industriales revisadas y garantizadas.
            </p>
            <p className="text-[11px] mt-2 font-mono">
              📍 C/ Ciudad de Llíria, 61, Pol. Ind. Fuente del Jarro, 46988 Paterna (Valencia)
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-2">Loewe Cars Exclusive</h4>
            <p className="text-[11px] leading-relaxed">
              División de alta gama, vehículos deportivos y de representación con certificado de autenticidad y garantía VIP.
            </p>
            <p className="text-[11px] mt-2">
              📞 Atención directa: <strong>96 147 5660</strong> • <strong>658 803 533</strong>
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-2">Acceso a la Plataforma</h4>
            <p className="text-[11px] leading-relaxed mb-3">
              ¿Eres parte del equipo comercial de Orlando Cars o Loewe Cars?
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Entrar al ERP de Gestión</span>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-slate-900 text-center text-[10px] text-slate-500">
          © {new Date().getFullYear()} Orlando Cars & Loewe Cars. Desarrollado con tecnología Nexo-Car. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}