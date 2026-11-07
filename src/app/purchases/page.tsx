"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Plus,
  Calculator,
  Car,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { maxPurchasePrice, vatOnSale, TaxRegime } from "@/lib/finance";

export default function PurchasesPage() {
  // Estado de la Calculadora de Tasación Inversa en Vivo
  const [calcSalePrice, setCalcSalePrice] = useState<number>(22900);
  const [calcExpenses, setCalcExpenses] = useState<number>(850);
  const [calcDesiredMargin, setCalcDesiredMargin] = useState<number>(2500);
  const [calcRegime, setCalcRegime] = useState<TaxRegime>("REBU");

  const computedMaxPurchase = maxPurchasePrice(
    calcRegime,
    calcSalePrice,
    calcExpenses,
    calcDesiredMargin
  );

  const estimatedVat = vatOnSale(
    calcRegime,
    calcSalePrice,
    computedMaxPurchase
  );

  const [appraisals, setAppraisals] = useState([
    {
      id: "tas-01",
      brand: "BMW",
      model: "M2 Competition",
      year: 2020,
      km: 41000,
      customer: "Alejandro Gómez Rovira",
      phone: "+34 689 334 122",
      requestedPrice: 53000,
      estimatedSale: 56900,
      estimatedWorkshop: 1200,
      targetMargin: 4500,
      maxPurchase: 50000,
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
      estimatedSale: 25500,
      estimatedWorkshop: 650,
      targetMargin: 2500,
      maxPurchase: 21688,
      status: "oferta_enviada",
      date: "2026-11-05",
    },
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Compras & Tasaciones</span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-semibold border border-blue-500/30">
              Motor REBU Activo
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Valoración técnica de vehículos usados, cálculo de oferta máxima y control de margen de compra
          </p>
        </div>
      </div>

      {/* CALCULADORA DE TASACIÓN INVERSA REBU EN VIVO */}
      <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 border border-blue-500/30 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Tasador Inverso REBU
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  Normativa Art. 135 LIVA
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Calcula exactamente el precio tope a pagar al particular para asegurar tu beneficio neto tras gastos e impuestos.
              </p>
            </div>
          </div>

          {/* Selector de Régimen Fiscal */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto text-xs">
            <button
              onClick={() => setCalcRegime("REBU")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                calcRegime === "REBU"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              REBU (Venta VO)
            </button>
            <button
              onClick={() => setCalcRegime("GENERAL_IVA")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                calcRegime === "GENERAL_IVA"
                  ? "bg-purple-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Régimen General (21%)
            </button>
          </div>
        </div>

        {/* Inputs y Resultados */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Input 1: PVP Venta Estimado */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <label className="text-[11px] font-medium text-slate-400 block">
              1. PVP Venta Estimado
            </label>
            <div className="relative">
              <input
                type="number"
                step="100"
                value={calcSalePrice}
                onChange={(e) => setCalcSalePrice(Number(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">€</span>
            </div>
            <span className="text-[10px] text-slate-500 block">Precio de mercado en coches.net</span>
          </div>

          {/* Input 2: Gastos Taller/Puesta a Punto */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <label className="text-[11px] font-medium text-slate-400 block">
              2. Previsión Taller / Gastos
            </label>
            <div className="relative">
              <input
                type="number"
                step="50"
                value={calcExpenses}
                onChange={(e) => setCalcExpenses(Number(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-sm font-bold text-amber-300 focus:outline-none focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">€</span>
            </div>
            <span className="text-[10px] text-slate-500 block">Pintura, revisión, ITV, garantía</span>
          </div>

          {/* Input 3: Margen Neto Deseado */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <label className="text-[11px] font-medium text-slate-400 block">
              3. Margen Limpio Deseado
            </label>
            <div className="relative">
              <input
                type="number"
                step="100"
                value={calcDesiredMargin}
                onChange={(e) => setCalcDesiredMargin(Number(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-sm font-bold text-emerald-400 focus:outline-none focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">€</span>
            </div>
            <span className="text-[10px] text-slate-500 block">Beneficio neto para Orlando Cars</span>
          </div>

          {/* Resultado: Oferta Tope al Particular */}
          <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/40 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-blue-300 block uppercase tracking-wider">
              Oferta Máxima de Compra
            </span>
            <div className="text-2xl font-black text-white tracking-tight my-1">
              {formatCurrency(computedMaxPurchase)}
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-blue-500/20 font-mono">
              <span>IVA {calcRegime}: {formatCurrency(estimatedVat)}</span>
              <span className="text-emerald-400 font-bold">Margen: {formatCurrency(calcDesiredMargin)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Historial de Tasaciones Activas */}
      <div>
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <span>Expedientes de Tasación en Trámite</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
            {appraisals.length}
          </span>
        </h2>

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
                Particular: <span className="font-semibold text-white">{app.customer}</span> ({app.phone}) • {app.km.toLocaleString()} km
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
                  <span className="text-slate-400 block text-[10px]">Oferta Tope REBU</span>
                  <span className="font-extrabold text-emerald-400">
                    {formatCurrency(app.maxPurchase)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span className="text-slate-400">Margen neto objetivo: +{formatCurrency(app.targetMargin)}</span>
                <button
                  onClick={() => alert(`Aceptando compra de ${app.brand} ${app.model} y transfiriendo a Stock en Preparación`)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-all font-semibold"
                >
                  Cerrar Compra
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
