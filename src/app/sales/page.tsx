"use client";

import { useState } from "react";
import { BadgeDollarSign, CheckCircle2, FileText, ArrowUpRight, Plus, Download } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function SalesPage() {
  const [sales] = useState([
    {
      id: "sale-01",
      vehicle: "Volkswagen Golf 8 1.5 eTSI R-Line",
      plate: "5672-LTT",
      customer: "Raúl Benítez Gómez",
      phone: "+34 655 432 109",
      date: "2026-10-25",
      agreedPrice: 25900,
      totalCost: 21600,
      grossMargin: 4300,
      paymentMethod: "Financiación Santander",
      status: "completada",
    },
    {
      id: "sale-02",
      vehicle: "Seat León FR 2.0 TDI 150CV DSG",
      plate: "8120-LKR",
      customer: "Elena Serrano Cruz",
      phone: "+34 677 889 001",
      date: "2026-10-14",
      agreedPrice: 21900,
      totalCost: 18400,
      grossMargin: 3500,
      paymentMethod: "Transferencia Bancaria",
      status: "completada",
    },
  ]);

  const totalSales = sales.reduce((acc, s) => acc + s.agreedPrice, 0);
  const totalMargin = sales.reduce((acc, s) => acc + s.grossMargin, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">Ventas & Expedientes Cerrados</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30">
              Margen Realizado: +{formatCurrency(totalMargin)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Registro transaccional inmutable: congelación de costes, contratos oficiales y facturación REBU
          </p>
        </div>

        <button
          onClick={() => alert("Registrar nueva operación de venta...")}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Registrar Venta</span>
        </button>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Vehículo Vendido</th>
              <th className="py-3 px-3">Comprador</th>
              <th className="py-3 px-3">Fecha Venta</th>
              <th className="py-3 px-3">Método de Pago</th>
              <th className="py-3 px-3">Coste Congelado</th>
              <th className="py-3 px-3">Precio Final</th>
              <th className="py-3 px-3">Margen Bruto REBU</th>
              <th className="py-3 px-4 text-right">Expediente</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {sales.map((s) => (
              <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4">
                  <span className="font-bold text-white block">{s.vehicle}</span>
                  <span className="font-mono text-[11px] text-blue-400">{s.plate}</span>
                </td>
                <td className="py-3 px-3">
                  <span className="font-medium text-slate-200 block">{s.customer}</span>
                  <span className="text-[10px] text-slate-400">{s.phone}</span>
                </td>
                <td className="py-3 px-3 text-slate-300">{formatDate(s.date)}</td>
                <td className="py-3 px-3">
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {s.paymentMethod}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono text-slate-400">{formatCurrency(s.totalCost)}</td>
                <td className="py-3 px-3 font-bold text-white">{formatCurrency(s.agreedPrice)}</td>
                <td className="py-3 px-3 font-black text-emerald-400">
                  +{formatCurrency(s.grossMargin)}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => alert(`Descargando contrato de venta para ${s.plate}`)}
                    className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors"
                    title="Descargar Contrato Compraventa"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
