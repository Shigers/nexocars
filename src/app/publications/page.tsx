"use client";

import { useState } from "react";
import { Share2, RefreshCw, CheckCircle2, AlertCircle, ExternalLink, Globe } from "lucide-react";
import { mockPortals, mockVehicles } from "@/lib/mock-data";

export default function PublicationsPage() {
  const [syncing, setSyncing] = useState(false);

  const handleSyncAll = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      alert("¡Todos los portales sincronizados con éxito mediante conector n8n!");
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Distribuidor Multi-Portal Automotriz
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Sincronización centralizada con Coches.net, AutoScout24, Wallapop, Milanuncios y Web de Orlando / Loewe Cars
          </p>
        </div>

        <button
          onClick={handleSyncAll}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
          <span>{syncing ? "Sincronizando..." : "Sincronizar Todos los Portales"}</span>
        </button>
      </div>

      {/* Portals Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {mockPortals.map((p) => (
          <div
            key={p.portal}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">{p.logo}</span>
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  p.status === "publicado"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}
              >
                {p.status}
              </span>
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">{p.name}</h3>
              <p className="text-[10px] text-slate-400">{p.last_synced}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Vehicles Publication Matrix */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Matriz de Publicación por Vehículo
          </h3>
          <span className="text-[11px] text-slate-400">
            {mockVehicles.length} vehículos en catálogo
          </span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Vehículo</th>
              <th className="py-3 px-3">Coches.net</th>
              <th className="py-3 px-3">AutoScout24</th>
              <th className="py-3 px-3">Wallapop</th>
              <th className="py-3 px-3">Milanuncios</th>
              <th className="py-3 px-3">Web Propia</th>
              <th className="py-3 px-4 text-right">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {mockVehicles.map((v) => (
              <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-blue-400">{v.plate}</span>
                    <span className="text-white font-medium">{v.brand} {v.model}</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </td>
                <td className="py-3 px-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </td>
                <td className="py-3 px-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </td>
                <td className="py-3 px-3">
                  <span className="text-[10px] text-amber-400 font-medium">En cola</span>
                </td>
                <td className="py-3 px-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-medium">
                    Activo (4 portales)
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
