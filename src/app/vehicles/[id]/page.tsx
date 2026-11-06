"use client";

import { use, useState } from "react";
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
} from "lucide-react";
import { mockVehicles, mockExpenses, mockPortals, mockLeads } from "@/lib/mock-data";
import {
  formatCurrency,
  formatNumber,
  formatDate,
  getVehicleStatusBadge,
  getFuelLabel,
  calculateREBUMargin,
} from "@/lib/utils";

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const vehicle = mockVehicles.find((v) => v.id === resolvedParams.id) || mockVehicles[0];

  const [activeTab, setActiveTab] = useState<
    "general" | "fotos" | "gastos" | "publicaciones" | "leads" | "docs" | "historial"
  >("general");

  const [selectedPhoto, setSelectedPhoto] = useState(vehicle.images[0]);
  const vehicleExpenses = mockExpenses.filter((e) => e.vehicle_id === vehicle.id);
  const matchedLeads = mockLeads.filter((l) => l.vehicle_id === vehicle.id);
  const statusBadge = getVehicleStatusBadge(vehicle.status);
  const marginData = calculateREBUMargin(vehicle.selling_price, vehicle.total_cost);

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

      {/* Hero Strip: Key Specs & Financial Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">Precio Venta (Contado)</span>
          <span className="text-lg font-black text-white">{formatCurrency(vehicle.selling_price)}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Coste Total</span>
          <span className="text-lg font-bold text-slate-300">{formatCurrency(vehicle.total_cost)}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Margen Bruto REBU</span>
          <span className="text-lg font-black text-emerald-400">
            +{formatCurrency(marginData.grossProfit)}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Kilometraje</span>
          <span className="text-sm font-bold text-white">{formatNumber(vehicle.mileage)} km</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Combustible / DGT</span>
          <span className="text-sm font-bold text-white">
            {getFuelLabel(vehicle.fuel_type)} • {vehicle.environmental_badge}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Tiempo en Stock</span>
          <span className="text-sm font-bold text-amber-300">{vehicle.days_in_stock} días</span>
        </div>
      </div>

      {/* Tabs Navigation (Section 6) */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto text-xs font-medium pb-px">
        {[
          { key: "general", label: "Información General", icon: Car },
          { key: "fotos", label: `Fotografías (${vehicle.images.length})`, icon: Share2 },
          { key: "gastos", label: `Gastos & Margen (${vehicleExpenses.length})`, icon: Receipt },
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
            {/* Description */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white">Descripción Comercial</h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {vehicle.description}
              </p>
            </div>

            {/* Equipment */}
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

          {/* Right technical column */}
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

      {/* TAB CONTENT: Photographs */}
      {activeTab === "fotos" && (
        <div className="space-y-6">
          <div className="relative aspect-[16/9] max-h-[460px] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
            <img src={selectedPhoto} alt={vehicle.title} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-xs font-semibold">
              Foto Principal de Portada
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {vehicle.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPhoto(img)}
                className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all ${
                  selectedPhoto === img ? "border-blue-500 scale-105" : "border-slate-800 opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Foto ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Expenses & Margins */}
      {activeTab === "gastos" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Coste de Compra Original</span>
              <p className="text-xl font-bold text-white mt-1">{formatCurrency(vehicle.purchase_price)}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Gastos Imputados de Taller</span>
              <p className="text-xl font-bold text-amber-300 mt-1">
                {formatCurrency(vehicle.preparation_costs + vehicle.additional_costs)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-xs text-emerald-300">Margen Neto (REBU)</span>
              <p className="text-xl font-black text-emerald-400 mt-1">
                +{formatCurrency(marginData.netProfit)}
              </p>
            </div>
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
