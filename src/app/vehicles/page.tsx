"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Car,
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  Download,
  Share2,
  Eye,
  Fuel,
  Gauge,
  Calendar,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { mockVehicles } from "@/lib/mock-data";
import { VehicleStatus, FuelType } from "@/types";
import {
  formatCurrency,
  formatNumber,
  getVehicleStatusBadge,
  getFuelLabel,
  calculateREBUMargin,
} from "@/lib/utils";

export default function VehiclesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [fuelFilter, setFuelFilter] = useState<string>("all");

  const filteredVehicles = mockVehicles.filter((v) => {
    const matchesSearch =
      v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.vin.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    const matchesFuel = fuelFilter === "all" || v.fuel_type === fuelFilter;

    return matchesSearch && matchesStatus && matchesFuel;
  });

  const totalValue = filteredVehicles.reduce((acc, v) => acc + v.selling_price, 0);
  const totalCost = filteredVehicles.reduce((acc, v) => acc + v.total_cost, 0);
  const totalMargin = totalValue - totalCost;

  return (
    <div className="space-y-6">
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">
              Gestión de Stock e Inventario
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-semibold border border-blue-500/30">
              {filteredVehicles.length} vehículos
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Control integral de flota, tasaciones, costes de reacondicionamiento y márgenes REBU
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Export button */}
          <button
            onClick={() => alert("Exportando catálogo a CSV / Excel...")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium hover:border-slate-700 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportar</span>
          </button>

          {/* Grid / Table Switch */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Vista Cuadrícula"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "table"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Vista Tabla Detallada"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Add Vehicle Button */}
          <Link
            href="/vehicles/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Vehículo</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Strip for Current Filtered Stock */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">Unidades Filtradas</span>
          <span className="text-sm font-bold text-white">{filteredVehicles.length} coches</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Valor de Venta (PVP)</span>
          <span className="text-sm font-bold text-white">{formatCurrency(totalValue)}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Coste Total Adquisición + Taller</span>
          <span className="text-sm font-bold text-slate-300">{formatCurrency(totalCost)}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Margen Bruto Proyectado</span>
          <span className="text-sm font-bold text-emerald-400">
            {formatCurrency(totalMargin)} ({totalValue > 0 ? ((totalMargin / totalValue) * 100).toFixed(1) : 0}%)
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por marca, modelo, matrícula o número de bastidor (VIN)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        {/* Status Select */}
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Todos los estados</option>
            <option value="disponible">Disponibles</option>
            <option value="en_preparacion">En Taller / Preparación</option>
            <option value="reservado">Reservados</option>
            <option value="vendido">Vendidos</option>
          </select>

          {/* Fuel Select */}
          <select
            value={fuelFilter}
            onChange={(e) => setFuelFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Todo combustible</option>
            <option value="diesel">Diésel</option>
            <option value="gasolina">Gasolina</option>
            <option value="hibrido">Híbrido / ECO</option>
            <option value="electrico">Eléctrico</option>
          </select>
        </div>
      </div>

      {/* Vehicles View: Grid or Table */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVehicles.map((vehicle) => {
            const statusBadge = getVehicleStatusBadge(vehicle.status);
            const marginData = calculateREBUMargin(vehicle.selling_price, vehicle.total_cost);

            return (
              <div
                key={vehicle.id}
                className="group rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 overflow-hidden shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Vehicle Image Cover with Badges */}
                  <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                    <img
                      src={vehicle.images[0]}
                      alt={vehicle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md bg-white text-slate-950 font-mono text-[11px] font-black tracking-wider border border-slate-300 shadow-md">
                        {vehicle.plate}
                      </span>
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold backdrop-blur-md ${statusBadge.className}`}
                      >
                        {statusBadge.label}
                      </span>
                    </div>

                    {/* Environmental Badge & Days in Stock */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/90 font-bold text-[10px] shadow">
                        DGT: {vehicle.environmental_badge}
                      </span>
                      <span className="text-[11px] text-slate-300 font-medium bg-slate-950/70 px-2 py-0.5 rounded backdrop-blur-sm">
                        {vehicle.days_in_stock} días en stock
                      </span>
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
                        <span className="font-medium text-blue-400">{vehicle.brand}</span>
                        <span>{vehicle.location}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                        {vehicle.model} {vehicle.version}
                      </h3>
                    </div>

                    {/* Specs Pills */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/80 text-[11px] text-slate-300">
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

                    {/* Financial & Margin Overview */}
                    <div className="flex items-end justify-between pt-1">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Precio Venta (Contado)</span>
                        <div className="text-lg font-black text-white">
                          {formatCurrency(vehicle.selling_price)}
                        </div>
                        {vehicle.financed_price && (
                          <span className="text-[10px] text-blue-400 font-semibold block">
                            Financiado: {formatCurrency(vehicle.financed_price)}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Margen REBU</span>
                        <span className="text-xs font-bold text-emerald-400 block">
                          +{formatCurrency(marginData.grossProfit)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Coste: {formatCurrency(vehicle.total_cost)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        alert(
                          `Enlace directo de WhatsApp generado para compartir el ${vehicle.brand} ${vehicle.model} (${vehicle.plate})`
                        )
                      }
                      className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                      title="Compartir por WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-slate-500 font-mono">
                      VIN: {vehicle.vin.slice(0, 8)}...
                    </span>
                  </div>

                  <Link
                    href={`/vehicles/${vehicle.id}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                  >
                    <span>Ficha 360°</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Detailed Table View */
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Vehículo / Versión</th>
                  <th className="py-3 px-3">Matrícula</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-3">Año / Km</th>
                  <th className="py-3 px-3">Combustible</th>
                  <th className="py-3 px-3">Coste Total</th>
                  <th className="py-3 px-3">PVP Venta</th>
                  <th className="py-3 px-3">Margen Bruto</th>
                  <th className="py-3 px-3">Días Stock</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {filteredVehicles.map((vehicle) => {
                  const statusBadge = getVehicleStatusBadge(vehicle.status);
                  const marginData = calculateREBUMargin(vehicle.selling_price, vehicle.total_cost);

                  return (
                    <tr key={vehicle.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={vehicle.images[0]}
                            alt={vehicle.title}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          />
                          <div>
                            <p className="font-bold text-white">
                              {vehicle.brand} {vehicle.model}
                            </p>
                            <p className="text-[11px] text-slate-400 line-clamp-1">
                              {vehicle.version}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-100">
                        {vehicle.plate}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusBadge.className}`}
                        >
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {vehicle.year} • {formatNumber(vehicle.mileage)} km
                      </td>
                      <td className="py-3 px-3">
                        <span className="capitalize">{getFuelLabel(vehicle.fuel_type)}</span>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-300">
                        {formatCurrency(vehicle.total_cost)}
                      </td>
                      <td className="py-3 px-3 font-bold text-white">
                        {formatCurrency(vehicle.selling_price)}
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-400">
                        +{formatCurrency(marginData.grossProfit)}
                      </td>
                      <td className="py-3 px-3 text-slate-400">{vehicle.days_in_stock} d</td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/vehicles/${vehicle.id}`}
                          className="px-2.5 py-1 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors text-xs font-semibold"
                        >
                          Ver Ficha
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
