"use client";

import { BarChart3, TrendingUp, DollarSign, Calendar, Clock, Car } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white">Estadísticas & Rentabilidad</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Métricas financieras clave, días medios de rotación de stock y rentabilidad por marca
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Rotación Media de Stock</span>
          <p className="text-2xl font-black text-white mt-1">26 días</p>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
            -4 días vs. media nacional
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Margen Medio por Unidad</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">4.350 €</p>
          <span className="text-[11px] text-slate-400 mt-1 block">15.8% sobre PVP</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Penetración Financiación</span>
          <p className="text-2xl font-black text-blue-400 mt-1">68%</p>
          <span className="text-[11px] text-blue-300 mt-1 block">Santander / Cetelem</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Tasa de Conversión Visita a Venta</span>
          <p className="text-2xl font-black text-purple-400 mt-1">32.4%</p>
          <span className="text-[11px] text-emerald-400 mt-1 block">+5.2% este mes</span>
        </div>
      </div>

      {/* Brands Profitability Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Rentabilidad por Marca en Orlando Cars & Loewe
        </h3>
        <div className="space-y-3 text-xs">
          {[
            { brand: "Porsche", units: 1, margin: 12900, days: 8, pct: 14.3 },
            { brand: "Audi", units: 1, margin: 6250, days: 12, pct: 13.6 },
            { brand: "Cupra", units: 1, margin: 5050, days: 5, pct: 14.5 },
            { brand: "BMW", units: 1, margin: 4750, days: 45, pct: 14.6 },
            { brand: "Mercedes-Benz", units: 1, margin: 4150, days: 24, pct: 13.8 },
            { brand: "Volkswagen", units: 1, margin: 4300, days: 48, pct: 16.6 },
          ].map((item) => (
            <div
              key={item.brand}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-white text-sm">{item.brand}</span>
                <span className="text-[11px] text-slate-400 block">{item.units} vehículo(s) • {item.days} días en campa</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-emerald-400 block">
                  +{formatCurrency(item.margin)}
                </span>
                <span className="text-[10px] text-slate-400">{item.pct}% margen sobre PVP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
