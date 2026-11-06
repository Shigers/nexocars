"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Clock, Plus, Car, User, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { mockAppointments } from "@/lib/mock-data";

export default function CalendarPage() {
  const [appointments] = useState(mockAppointments);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Agenda & Pruebas Dinámicas</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Planificación de visitas comerciales, pruebas en carretera, firmas y entregas de vehículos
          </p>
        </div>
        <button
          onClick={() => alert("Nueva cita / prueba agendada")}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Agendar Cita</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View Left (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-blue-400" />
              <span>Noviembre 2026 — Semana Actual</span>
            </h3>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-blue-500/30 transition-all flex items-start justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-600/15 text-blue-400 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{apt.title}</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Cliente: <span className="text-white font-medium">{apt.customer_name}</span> ({apt.customer_phone})
                    </p>
                    {apt.vehicle_title && (
                      <p className="text-[11px] text-blue-400 font-mono mt-1">
                        Vehículo: {apt.vehicle_plate} — {apt.vehicle_title}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-200 block">
                    {new Date(apt.start_time).toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    {new Date(apt.start_time).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Side Summary */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Próximas Pruebas Dinámicas</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Recuerda tener preparado el contrato de prueba y verificar el permiso de conducir del cliente antes de entregar las llaves.
          </p>
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
            ✓ 2 vehículos lavados y con combustible suficiente para prueba.
          </div>
        </div>
      </div>
    </div>
  );
}
