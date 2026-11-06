"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Car,
  TrendingUp,
  Clock,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Receipt,
  Sparkles,
  ChevronRight,
  KanbanSquare,
  BadgeCheck,
  Building,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { mockLeads, mockAppointments } from "@/lib/mock-data";
import { formatCurrency, formatNumber, getVehicleStatusBadge } from "@/lib/utils";
import { getStoredVehicles } from "@/lib/storage";
import { Vehicle } from "@/types";

const monthlyPerformance = [
  { month: "Mayo", ventas: 68000, compras: 54000, margen: 14000 },
  { month: "Junio", ventas: 94000, compras: 72000, margen: 22000 },
  { month: "Julio", ventas: 112000, compras: 86000, margen: 26000 },
  { month: "Agosto", ventas: 78000, compras: 61000, margen: 17000 },
  { month: "Septiembre", ventas: 135000, compras: 104000, margen: 31000 },
  { month: "Octubre", ventas: 168000, compras: 129000, margen: 39000 },
  { month: "Noviembre", ventas: 89900, compras: 71000, margen: 18900 },
];

export default function DashboardPage() {
  const [period, setPeriod] = useState("30d");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    setVehicles(getStoredVehicles());

    const handleUpdate = () => {
      setVehicles(getStoredVehicles());
    };
    window.addEventListener("nexo_storage_updated", handleUpdate);
    return () => window.removeEventListener("nexo_storage_updated", handleUpdate);
  }, []);

  // Live Calculations from stored vehicles
  const totalStock = vehicles.length;
  const availableCount = vehicles.filter((v) => v.status === "disponible").length;
  const reservedCount = vehicles.filter((v) => v.status === "reservado").length;
  const soldCount = vehicles.filter((v) => v.status === "vendido").length;
  const inWorkshopCount = vehicles.filter((v) => v.status === "en_preparacion").length;

  const inventoryValue = vehicles.reduce((acc, v) => acc + v.selling_price, 0);
  const totalCost = vehicles.reduce((acc, v) => acc + v.total_cost, 0);
  const potentialMargin = inventoryValue - totalCost;
  const totalHoldingLoss = vehicles.reduce((acc, v) => acc + (v.days_in_stock * 14), 0);
  const realMarginToday = potentialMargin - totalHoldingLoss;
  const marginPercentage = inventoryValue > 0 ? ((potentialMargin / inventoryValue) * 100).toFixed(1) : "0.0";

  const stockFuelDistribution = [
    { name: "Híbrido / ECO", value: vehicles.filter(v => v.fuel_type.includes("hibrido")).length || 2, color: "#10b981" },
    { name: "Diésel", value: vehicles.filter(v => v.fuel_type === "diesel").length || 3, color: "#3b82f6" },
    { name: "Gasolina", value: vehicles.filter(v => v.fuel_type === "gasolina").length || 2, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Dealership Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1627] to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">
                Panel de Control — Orlando Cars & Loewe
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                En directo
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Persistencia reactiva activa • Flota consolidada: {totalStock} vehículos
            </p>
          </div>
        </div>

        {/* Period Selector Filter */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto text-xs">
          {[
            { label: "Últimos 30 días", value: "30d" },
            { label: "Trimestre Q4", value: "q4" },
            { label: "Año 2026", value: "year" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setPeriod(item.value)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                period === item.value
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Grid (Section 5) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Inventory Value */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Valor de Inventario (PVP)</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {formatCurrency(inventoryValue)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px]">
            <span className="text-emerald-400 flex items-center font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" /> {totalStock} vehículos en base
            </span>
            <span className="text-slate-400">Coste: {formatCurrency(totalCost)}</span>
          </div>
        </div>

        {/* KPI 2: Gross Margin & Real Margin with Holding Cost */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Margen Real a Día de Hoy</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 tracking-tight">
            +{formatCurrency(realMarginToday)}
          </div>
          <div className="flex items-center justify-between mt-2 text-[11px]">
            <span className="text-amber-400 font-semibold">
              Campa: -{formatCurrency(totalHoldingLoss)}
            </span>
            <span className="text-slate-400">Bruto: {formatCurrency(potentialMargin)}</span>
          </div>
        </div>

        {/* KPI 3: Stock Status breakdown */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Estado del Stock</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {availableCount} <span className="text-xs font-normal text-slate-400">disponibles</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
            <span className="text-blue-400 font-medium">{reservedCount} reservados</span>
            <span>•</span>
            <span className="text-amber-400 font-medium">{inWorkshopCount} en taller</span>
            <span>•</span>
            <span className="text-purple-400 font-medium">{soldCount} vendidos</span>
          </div>
        </div>

        {/* KPI 4: Active Leads & Visits */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Embudo Comercial Activo</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <KanbanSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {mockLeads.length} <span className="text-xs font-normal text-slate-400">oportunidades</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px]">
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {mockAppointments.length} citas agendadas
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart: Sales vs Margin Evolution */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">
                Rendimiento de Ventas y Margen Comercial
              </h2>
              <p className="text-xs text-slate-400">
                Evolución de facturación y beneficio bruto mensual (REBU)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span className="text-slate-300">Ventas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span className="text-slate-300">Margen Neto</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyPerformance} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorMargen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `${val / 1000}k€`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                  formatter={(value: any) => [`${formatNumber(Number(value))} €`]}
                />
                <Area
                  type="monotone"
                  dataKey="ventas"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVentas)"
                />
                <Area
                  type="monotone"
                  dataKey="margen"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorMargen)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Inventory by Engine / Badge */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white mb-1">Composición del Inventario</h2>
            <p className="text-xs text-slate-400">Distribución por motorización y etiqueta ambiental</p>
          </div>

          <div className="h-44 w-full my-auto flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockFuelDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stockFuelDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 border-t border-slate-800 pt-3">
            {stockFuelDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-200">{item.value} coches</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Columns: Urgent Tasks / Stagnant Stock + Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Smart Automotive Alerts */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-bold text-white">Alertas de Stock & Rotación</h2>
            </div>
            <Link
              href="/vehicles"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
            >
              Ver inventario completo <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {vehicles
              .filter((v) => v.days_in_stock > 30)
              .map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        {v.brand} {v.model} ({v.plate})
                      </p>
                      <p className="text-[11px] text-amber-300">
                        {v.days_in_stock} días en stock • Sugerencia: Reposicionar en Wallapop o Coches.net
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/vehicles/${v.id}`}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-200 text-xs font-medium hover:bg-amber-500/30 transition-colors"
                  >
                    Ficha
                  </Link>
                </div>
              ))}

            {/* Quick stock status list */}
            {vehicles.slice(0, 3).map((v) => {
              const badge = getVehicleStatusBadge(v.status);
              return (
                <div
                  key={v.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 relative flex-shrink-0">
                      <img
                        src={v.images[0] || "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80"}
                        alt={v.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        {v.brand} {v.model}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {v.plate} • {formatNumber(v.mileage)} km
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-white">
                      {formatCurrency(v.selling_price)}
                    </div>
                    <span
                      className={`inline-block text-[10px] px-2 py-0.5 rounded-full border font-medium mt-0.5 ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Appointments & Commercial Calendar */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white">Agenda & Pruebas Dinámicas</h2>
            </div>
            <Link
              href="/calendar"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
            >
              Ver calendario <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {mockAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-start justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 mt-0.5">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">{apt.title}</p>
                    <p className="text-[11px] text-slate-400">
                      Cliente: <span className="text-slate-200">{apt.customer_name}</span> ({apt.customer_phone})
                    </p>
                    {apt.vehicle_title && (
                      <p className="text-[10px] text-blue-400 mt-1 font-mono">
                        Vehículo: {apt.vehicle_plate} — {apt.vehicle_title}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-semibold text-slate-300 block">
                    {new Date(apt.start_time).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium">Programada</span>
                </div>
              </div>
            ))}

            {/* Quick commercial lead teaser */}
            <div className="p-3 rounded-xl bg-blue-900/15 border border-blue-800/30 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">4 Leads Calientes en Pipeline</p>
                <p className="text-[11px] text-blue-300">
                  1 prueba completada pendiente de financiación con Santander.
                </p>
              </div>
              <Link
                href="/crm"
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors"
              >
                Abrir CRM
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
