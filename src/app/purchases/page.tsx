"use client";

import { useState } from "react";
import { ShoppingBag, Plus, Calculator, Car, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function PurchasesPage() {
  const [appraisals] = useState([
    {
      id: "tas-01",
      brand: "BMW",
      model: "M2 Competition",
      year: 2020,
      km: 41000,
      customer: "Alejandro Gómez Rovira",
      phone: "+34 689 334 122",
      requestedPrice: 53000,
      appraisedValue: 47000,
      estimatedWorkshop: 1200,
      targetMargin: 5500,
      maxPurchasePrice: 47500,
      status: "negociacion",
      date: "2026-11-06",
    },
    {
      id: "tas-02",
      brand: "Volkswagen",
      model: "T-Roc R-Line 1.5 TSI",
      year: 2022,
      km: 32000,
      customer: "Particular - Marta Sola",
      phone: "+34 612 884 102",
      requestedPrice: 24000,
      appraisedValue: 21500,
      estimatedWorkshop: 600,
      targetMargin: 3000,
      maxPurchasePrice: 22000,
      status: "oferta_enviada",
      date: "2026-11-05",
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Compras & Tasaciones</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Valoración técnica de vehículos usados, cálculo de oferta máxima y control de margen de compra
          </p>
        </div>
        <button
          onClick={() => alert("Formulario de nueva tasación abierto")}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nueva Tasación</span>
        </button>
      </div>

      {/* Grid of Active Appraisals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appraisals.map((app) => (
          <div
            key={app.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">
                  {app.brand} {app.model} ({app.year})
                </h3>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
                {app.status.replace("_", " ")}
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Vendedor: <span className="font-semibold text-white">{app.customer}</span> ({app.phone})
            </p>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-center">
              <div>
                <span className="text-slate-400 block text-[10px]">Pide Vendedor</span>
                <span className="font-bold text-white">{formatCurrency(app.requestedPrice)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Taller Previsto</span>
                <span className="font-semibold text-amber-300">{formatCurrency(app.estimatedWorkshop)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Oferta Máxima</span>
                <span className="font-extrabold text-emerald-400">
                  {formatCurrency(app.maxPurchasePrice)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400">Margen objetivo: +{formatCurrency(app.targetMargin)}</span>
              <button
                onClick={() => alert(`Aceptando compra de ${app.brand} ${app.model}`)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-all font-semibold"
              >
                Cerrar Compra
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
