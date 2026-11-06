"use client";

import { useState } from "react";
import Link from "next/link";
import {
  KanbanSquare,
  Plus,
  Search,
  Phone,
  Mail,
  Car,
  Clock,
  Sparkles,
  ChevronRight,
  User,
  Filter,
} from "lucide-react";
import { mockLeads } from "@/lib/mock-data";
import { LeadStage } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

const stages: { key: LeadStage; title: string; color: string }[] = [
  { key: "nuevo", title: "Nuevos Leads", color: "border-blue-500/50 bg-blue-500/10 text-blue-400" },
  { key: "contactado", title: "Contactados", color: "border-purple-500/50 bg-purple-500/10 text-purple-400" },
  { key: "visita_agendada", title: "Visita / Cita", color: "border-amber-500/50 bg-amber-500/10 text-amber-400" },
  { key: "prueba_realizada", title: "Prueba Dinámica", color: "border-cyan-500/50 bg-cyan-500/10 text-cyan-400" },
  { key: "financiacion", title: "Financiación / Oferta", color: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" },
];

export default function CRMPage() {
  const [leads, setLeads] = useState(mockLeads);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLeads = leads.filter(
    (l) =>
      l.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.vehicle_title && l.vehicle_title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">
              CRM Comercial & Pipeline de Ventas
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-semibold border border-blue-500/30">
              {filteredLeads.length} oportunidades activas
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Embudo de conversión de compradores, vinculación con stock y seguimiento de financiación
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => alert("Formulario para crear nuevo lead en desarrollo")}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Lead</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por cliente o vehículo de interés..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Kanban Board Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageLeads = filteredLeads.filter((l) => l.stage === stage.key);
          const stageTotalBudget = stageLeads.reduce((acc, l) => acc + (l.budget || 0), 0);

          return (
            <div
              key={stage.key}
              className="rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col max-h-[750px]"
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{stage.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${stage.color}`}>
                      {stageLeads.length}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {formatCurrency(stageTotalBudget)}
                  </span>
                </div>
              </div>

              {/* Cards list in column */}
              <div className="p-2.5 space-y-3 overflow-y-auto flex-1">
                {stageLeads.length === 0 ? (
                  <div className="p-4 text-center text-[11px] text-slate-400 border border-dashed border-slate-800/80 rounded-xl">
                    Sin leads en esta fase
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all shadow-md space-y-2 group"
                    >
                      {/* Customer Name & Priority */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                          {lead.customer_name}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                            lead.priority === "urgente"
                              ? "bg-red-500/20 text-red-400"
                              : lead.priority === "alta"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {lead.priority}
                        </span>
                      </div>

                      {/* Lead Title & Vehicle */}
                      <p className="text-[11px] text-slate-300 font-medium line-clamp-2">
                        {lead.title}
                      </p>

                      {lead.vehicle_title && (
                        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-[10px] space-y-0.5">
                          <div className="flex items-center justify-between text-blue-400 font-mono font-bold">
                            <span>{lead.vehicle_plate}</span>
                            <span>{lead.budget ? formatCurrency(lead.budget) : ""}</span>
                          </div>
                          <p className="text-slate-300 line-clamp-1">{lead.vehicle_title}</p>
                        </div>
                      )}

                      {/* Contact & Actions */}
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${lead.customer_phone}`}
                            className="p-1 rounded hover:text-white transition-colors"
                            title="Llamar al cliente"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <span className="font-mono text-[10px]">{lead.customer_phone}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 capitalize">{lead.source}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
