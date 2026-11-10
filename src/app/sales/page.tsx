"use client";

import { useState } from "react";
import { BadgeDollarSign, CheckCircle2, FileText, ArrowUpRight, Plus, Download, Printer, Eye } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DocumentModal } from "@/components/documents/document-modal";
import { DocumentData, openPrintDocument } from "@/lib/document-generator";

export default function SalesPage() {
  const [sales] = useState([
    {
      id: "sale-01",
      vehicle: "Volkswagen Golf 8 1.5 eTSI R-Line",
      brand: "Volkswagen",
      model: "Golf 8 1.5 eTSI R-Line",
      plate: "5672-LTT",
      vin: "WVWZZZCDZMW104928",
      customer: "Raúl Benítez Gómez",
      dni: "53892104M",
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
      brand: "Seat",
      model: "León FR 2.0 TDI 150CV DSG",
      plate: "8120-LKR",
      vin: "VSSZZZKLZNR049281",
      customer: "Elena Serrano Cruz",
      dni: "48201934P",
      phone: "+34 677 889 001",
      date: "2026-10-14",
      agreedPrice: 21900,
      totalCost: 18400,
      grossMargin: 3500,
      paymentMethod: "Transferencia Bancaria",
      status: "completada",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDocData, setSelectedDocData] = useState<DocumentData | null>(null);

  const getSaleDocData = (s: typeof sales[0], type: "contrato" | "factura"): DocumentData => {
    return {
      type,
      invoiceNumber: `FAC-2026-${s.id === "sale-01" ? "089" : "088"}`,
      date: formatDate(s.date),
      clientName: s.customer,
      clientDni: s.dni,
      clientPhone: s.phone,
      brand: s.brand,
      model: s.model,
      plate: s.plate,
      vin: s.vin,
      mileage: s.id === "sale-01" ? 45000 : 58000,
      year: s.id === "sale-01" ? 2022 : 2021,
      sellingPrice: s.agreedPrice,
      taxScheme: "REBU",
      paymentMethod: s.paymentMethod,
    };
  };

  const handleOpenDoc = (s: typeof sales[0], type: "contrato" | "factura") => {
    setSelectedDocData(getSaleDocData(s, type));
    setModalOpen(true);
  };

  const handlePrintDoc = (s: typeof sales[0], type: "contrato" | "factura") => {
    openPrintDocument(getSaleDocData(s, type));
  };

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
          onClick={() => {
            setSelectedDocData(getSaleDocData(sales[0], "contrato"));
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Generar Nuevo Contrato</span>
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
              <th className="py-3 px-4 text-center">Expediente Oficial</th>
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
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => handleOpenDoc(s, "contrato")}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors font-medium text-[11px]"
                      title="Abrir Contrato Compraventa Oficial"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Contrato</span>
                    </button>
                    <button
                      onClick={() => handlePrintDoc(s, "factura")}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors font-medium text-[11px]"
                      title="Descargar / Imprimir Factura REBU en PDF"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Factura PDF</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDocData && (
        <DocumentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          initialData={selectedDocData}
        />
      )}
    </div>
  );
}
