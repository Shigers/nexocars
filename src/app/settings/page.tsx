"use client";

import { useState } from "react";
import { Settings, Building2, ShieldCheck, Database, Key, Server, Globe } from "lucide-react";

export default function SettingsPage() {
  const [dealershipName, setDealershipName] = useState("Orlando Cars S.L.");
  const [cif, setCif] = useState("B-88392104");
  const [rebuEnabled, setRebuEnabled] = useState(true);
  const [defaultTaxRate, setDefaultTaxRate] = useState(21);
  const [whatsappPhoneId, setWhatsappPhoneId] = useState("10928374659102");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white">Configuración del Sistema</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Ajustes de concesionario, régimen fiscal REBU, credenciales de Supabase y conectores de portales
        </p>
      </div>

      <div className="space-y-6">
        {/* Dealership Info */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-sm font-bold text-white">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span>Datos Fiscales y Sedes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Razón Social</label>
              <input
                type="text"
                value={dealershipName}
                onChange={(e) => setDealershipName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">CIF / NIF</label>
              <input
                type="text"
                value={cif}
                onChange={(e) => setCif(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Tax and REBU Settings */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-sm font-bold text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Régimen Fiscal (REBU & VeriFactu)</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <p className="text-xs font-bold text-white">Aplicar Régimen REBU por defecto</p>
              <p className="text-[11px] text-slate-400">
                Calcula el IVA únicamente sobre el beneficio comercial (PVP - Coste Total de Adquisición y Taller)
              </p>
            </div>
            <input
              type="checkbox"
              checked={rebuEnabled}
              onChange={(e) => setRebuEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700"
            />
          </div>
        </div>

        {/* Cloud & Supabase Multi-tenancy */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-sm font-bold text-white">
            <Database className="w-4 h-4 text-purple-400" />
            <span>Infraestructura Supabase & Despliegue</span>
          </div>

          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-2 text-purple-300 font-bold">
              <span>✓ Multi-tenancy con Row Level Security (RLS) habilitado en schema.sql</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Soporta Orlando Cars y Loewe Cars como marcas o divisiones independientes bajo la misma base de datos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
