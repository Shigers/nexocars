"use client";

import { useState } from "react";
import { Receipt, Plus, Search, Filter, Download } from "lucide-react";
import { mockExpenses } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState(mockExpenses);
  const totalAmount = expenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">Gastos & Costes Imputados</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30">
              Total: {formatCurrency(totalAmount)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Registro contable de facturas de taller, chapa y pintura, transporte, ITV y pólizas de garantía por bastidor
          </p>
        </div>

        <button
          onClick={() => alert("Modal para imputar nuevo gasto...")}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Añadir Gasto</span>
        </button>
      </div>

      {/* Expenses Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Vehículo / Bastidor</th>
              <th className="py-3 px-3">Categoría</th>
              <th className="py-3 px-4">Descripción del Trabajo</th>
              <th className="py-3 px-3">Proveedor / Taller</th>
              <th className="py-3 px-3">Nº Factura</th>
              <th className="py-3 px-3">Fecha</th>
              <th className="py-3 px-4 text-right">Importe</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {expenses.map((e) => (
              <tr key={e.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4">
                  <span className="font-mono font-bold text-white block">{e.vehicle_plate}</span>
                  <span className="text-[11px] text-slate-400">{e.vehicle_title}</span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 capitalize border border-slate-700">
                    {e.category.replace("_", " ")}
                  </span>
                </td>
                <td className="py-3 px-4 font-medium text-slate-300">{e.description}</td>
                <td className="py-3 px-3 text-slate-400">{e.provider_name}</td>
                <td className="py-3 px-3 font-mono text-slate-400">{e.invoice_number || "Pendiente"}</td>
                <td className="py-3 px-3 text-slate-400">{formatDate(e.invoice_date)}</td>
                <td className="py-3 px-4 text-right font-extrabold text-amber-300">
                  {formatCurrency(e.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
