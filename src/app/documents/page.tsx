"use client";

import { useState } from "react";
import { FileText, Download, Printer, Plus, ShieldCheck, CheckCircle } from "lucide-react";
import { mockVehicles } from "@/lib/mock-data";

export default function DocumentsPage() {
  const templates = [
    {
      id: "tmpl-01",
      name: "Contrato Compraventa Oficial VO (REBU)",
      description: "Contrato legal adaptado a la legislación española con cláusulas de garantía de 12 meses.",
      category: "Legal & Ventas",
    },
    {
      id: "tmpl-02",
      name: "Documento de Reserva y Señal",
      description: "Justificante de entrega a cuenta y compromiso de reserva de vehículo en campa.",
      category: "Comercial",
    },
    {
      id: "tmpl-03",
      name: "Acta de Entrega y Recepción de Vehículo",
      description: "Checklist de estado de carrocería, llaves, manuales y firma de conformidad del cliente.",
      category: "Operaciones",
    },
    {
      id: "tmpl-04",
      name: "Mandato de Venta y Gestión DGT",
      description: "Autorización de representación para cambio de titularidad en la Jefatura de Tráfico.",
      category: "Gestoría",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Documentación & Plantillas Digitales
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Generación instantánea de contratos oficiales, reservas y expedientes en PDF listos para firma
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((tmpl) => (
          <div
            key={tmpl.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 font-semibold border border-blue-500/30">
                  {tmpl.category}
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-white">{tmpl.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{tmpl.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Formato PDF Dinámico</span>
              <button
                onClick={() => alert(`Generando ${tmpl.name} para impresión...`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Generar PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
