"use client";

import { useState } from "react";
import { FileSpreadsheet, Plus, Download, CheckCircle2, Search } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function InvoicesPage() {
  const [invoices] = useState([
    {
      id: "inv-01",
      number: "FAC-2026-089",
      date: "2026-10-25",
      client: "Raúl Benítez Gómez",
      cif: "53892104M",
      vehicle: "Volkswagen Golf 8 (5672-LTT)",
      scheme: "REBU",
      taxBase: 3553.72,
      taxAmount: 746.28,
      total: 25900.00,
      status: "cobrada",
    },
    {
      id: "inv-02",
      number: "FAC-2026-088",
      date: "2026-10-14",
      client: "Elena Serrano Cruz",
      cif: "48201934P",
      vehicle: "Seat León FR (8120-LKR)",
      scheme: "REBU",
      taxBase: 2892.56,
      taxAmount: 607.44,
      total: 21900.00,
      status: "cobrada",
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Facturación & Régimen REBU
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Libro registro oficial de facturas emitidas bajo el Régimen Especial de Bienes Usados y General
          </p>
        </div>

        <button
          onClick={() => alert("Emisión de nueva factura...")}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Emitir Factura</span>
        </button>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Nº Factura</th>
              <th className="py-3 px-3">Fecha</th>
              <th className="py-3 px-3">Cliente / DNI</th>
              <th className="py-3 px-4">Vehículo Asociado</th>
              <th className="py-3 px-3">Régimen</th>
              <th className="py-3 px-3">Base Imponible REBU</th>
              <th className="py-3 px-3">IVA (21%)</th>
              <th className="py-3 px-4 text-right">Total Factura</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-white">{inv.number}</td>
                <td className="py-3 px-3 text-slate-400">{formatDate(inv.date)}</td>
                <td className="py-3 px-3">
                  <span className="font-semibold text-white block">{inv.client}</span>
                  <span className="font-mono text-[10px] text-slate-400">{inv.cif}</span>
                </td>
                <td className="py-3 px-4 text-slate-300">{inv.vehicle}</td>
                <td className="py-3 px-3">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 font-bold">
                    {inv.scheme}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono text-slate-300">{formatCurrency(inv.taxBase)}</td>
                <td className="py-3 px-3 font-mono text-amber-300">{formatCurrency(inv.taxAmount)}</td>
                <td className="py-3 px-4 text-right font-black text-white text-sm">
                  {formatCurrency(inv.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
