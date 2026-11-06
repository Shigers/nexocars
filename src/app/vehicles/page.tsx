"use client";

import { useState, useEffect } from "react";
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
  UploadCloud,
  FileSpreadsheet,
  X,
  Trash2,
} from "lucide-react";
import { VehicleStatus, FuelType, Vehicle } from "@/types";
import {
  formatCurrency,
  formatNumber,
  getVehicleStatusBadge,
  getFuelLabel,
  calculateREBUMargin,
  calculateRealCurrentMargin,
} from "@/lib/utils";
import { getStoredVehicles, bulkImportVehicles, deleteVehicle } from "@/lib/storage";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [fuelFilter, setFuelFilter] = useState<string>("all");
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [bulkTextInput, setBulkTextInput] = useState("");

  // Load from persistent storage on mount and subscribe to updates
  useEffect(() => {
    setVehicles(getStoredVehicles());

    const handleStorageUpdate = () => {
      setVehicles(getStoredVehicles());
    };

    window.addEventListener("nexo_storage_updated", handleStorageUpdate);
    return () => window.removeEventListener("nexo_storage_updated", handleStorageUpdate);
  }, []);

  const filteredVehicles = vehicles.filter((v) => {
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
  const totalHoldingLoss = filteredVehicles.reduce((acc, v) => acc + (v.days_in_stock * 14), 0);
  const totalRealMargin = totalMargin - totalHoldingLoss;

  const handleExportCSV = () => {
    const headers = "ID,Marca,Modelo,Versión,Matrícula,Bastidor,Año,Kilometraje,Combustible,CosteTotal,PVP,MargenBruto,Estado,Ubicación\n";
    const rows = filteredVehicles.map(v => 
      `"${v.id}","${v.brand}","${v.model}","${v.version}","${v.plate}","${v.vin}",${v.year},${v.mileage},"${v.fuel_type}",${v.total_cost},${v.selling_price},${v.selling_price - v.total_cost},"${v.status}","${v.location}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Stock_Orlando_Cars_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkImport = () => {
    if (!bulkTextInput.trim()) return;

    // Simple parser: lines with: Marca, Modelo, Matrícula, Año, Km, PVP, Coste
    const lines = bulkTextInput.trim().split("\n");
    const newItems: Vehicle[] = [];

    lines.forEach((line, i) => {
      const parts = line.split(",").map(p => p.trim());
      if (parts.length >= 5) {
        const [brand, model, plate, year, mileage, pvp, cost] = parts;
        newItems.push({
          id: `veh-bulk-${Date.now()}-${i}`,
          company_id: "comp-orlando",
          brand: brand || "Desconocido",
          model: model || "Modelo",
          version: "Stock Orlando Cars",
          plate: plate || `TEMP-${Math.floor(1000 + Math.random() * 9000)}`,
          vin: `VIN${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          year: Number(year) || 2022,
          mileage: Number(mileage) || 50000,
          fuel_type: "diesel",
          transmission: "automatico",
          power_hp: 150,
          color: "Blanco",
          doors: 5,
          seats: 5,
          environmental_badge: "C",
          body_type: "berlina",
          purchase_price: Number(cost) || 18000,
          preparation_costs: 500,
          additional_costs: 300,
          total_cost: (Number(cost) || 18000) + 800,
          selling_price: Number(pvp) || 22900,
          tax_scheme: "REBU",
          status: "disponible",
          location: "Exposición Orlando Cars",
          purchase_date: new Date().toISOString().split("T")[0],
          title: `${brand} ${model} Importado`,
          description: "Vehículo incorporado en carga masiva de stock.",
          images: ["https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80"],
          equipment_list: ["Garantía Mecánica 12 Meses"],
          is_featured: false,
          published_on_web: true,
          days_in_stock: 1,
          created_at: new Date().toISOString(),
        });
      }
    });

    if (newItems.length > 0) {
      bulkImportVehicles(newItems);
      setBulkTextInput("");
      setImportModalOpen(false);
      alert(`¡${newItems.length} vehículos importados y guardados con éxito en la base de datos!`);
    } else {
      alert("Por favor introduce al menos una línea con formato: Marca, Modelo, Matrícula, Año, Km, PVP, Coste");
    }
  };

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
              {filteredVehicles.length} vehículos activos
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Persistencia en tiempo real • Control de flota de Orlando Cars y Loewe Cars
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Bulk Import Button */}
          <button
            onClick={() => setImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 text-xs font-semibold transition-all"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Subir Stock Orlando</span>
          </button>

          {/* Export button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium hover:border-slate-700 transition-all"
            title="Descargar archivo CSV de la flota"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportar CSV</span>
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">Unidades en Pantalla</span>
          <span className="text-sm font-bold text-white">{filteredVehicles.length} coches</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Valor de Venta (PVP)</span>
          <span className="text-sm font-bold text-white">{formatCurrency(totalValue)}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Coste Adquisición + Taller</span>
          <span className="text-sm font-bold text-slate-300">{formatCurrency(totalCost)}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Coste Campa (14€/día)</span>
          <span className="text-sm font-bold text-amber-400">-{formatCurrency(totalHoldingLoss)}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Margen Real a Día de Hoy</span>
          <span className="text-sm font-bold text-emerald-400">
            +{formatCurrency(totalRealMargin)}
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
            const marginReal = calculateRealCurrentMargin(vehicle.selling_price, vehicle.total_cost, vehicle.days_in_stock);

            return (
              <div
                key={vehicle.id}
                className="group rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 overflow-hidden shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Vehicle Image Cover with Badges */}
                  <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                    <img
                      src={vehicle.images[0] || "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80"}
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
                        <span className="text-[10px] text-slate-400 block">Margen Real Hoy</span>
                        <span className="text-xs font-black text-emerald-400 block">
                          +{formatCurrency(marginReal.realMarginToday)}
                        </span>
                        <span className="text-[10px] text-amber-400 font-mono block">
                          Campa: -{formatCurrency(marginReal.holdingLoss)}
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
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar ${vehicle.brand} ${vehicle.model} (${vehicle.plate}) de la base de datos?`)) {
                          deleteVehicle(vehicle.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Eliminar de Stock"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
                  const marginReal = calculateRealCurrentMargin(vehicle.selling_price, vehicle.total_cost, vehicle.days_in_stock);

                  return (
                    <tr key={vehicle.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={vehicle.images[0] || "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80"}
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
                        +{formatCurrency(marginReal.realMarginToday)}
                        <span className="block text-[9px] text-amber-400 font-mono">
                          -{formatCurrency(marginReal.holdingLoss)}
                        </span>
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

      {/* Bulk Upload Stock Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Carga Masiva de Stock — Orlando Cars</h3>
              </div>
              <button
                onClick={() => setImportModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Pega aquí el listado de vehículos procedentes de tu archivo Excel o CRM anterior. Una fila por vehículo con formato separado por comas:
              <br />
              <code className="text-purple-300 font-mono text-[11px] block mt-1.5 p-2 bg-slate-950 rounded-lg">
                Marca, Modelo, Matrícula, Año, Kilómetros, PVP Venta, Coste Compra
              </code>
            </p>

            <textarea
              rows={6}
              value={bulkTextInput}
              onChange={(e) => setBulkTextInput(e.target.value)}
              placeholder="Mercedes-Benz, Clase C 220d, 4921-MBZ, 2022, 60000, 31900, 26000&#10;BMW, X3 xDrive20d, 1204-LMC, 2021, 75000, 35900, 29500&#10;Audi, A4 Avant S-Line, 8820-KXZ, 2020, 89000, 24500, 19800"
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">
                Se guardará inmediatamente en memoria y base de datos local.
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleBulkImport}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30"
                >
                  Importar Flota
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
