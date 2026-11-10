"use client";

import { useState } from "react";
import { FileSpreadsheet, Plus, Download, Printer, Eye, CheckCircle2, Search, FileText } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DocumentModal } from "@/components/documents/document-modal";
import { DocumentData, openPrintDocument } from "@/lib/document-generator";

interface InvoiceItem {
  id: string;
  number: string;
  date: string;
  client: string;
  cif: string;
  clientAddress: string;
  clientPhone: string;
  vehicle: string;
  brand: string;
  model: string;
  plate: string;
  vin: string;
  mileage: number;
  year: number;
  scheme: "REBU" | "GENERAL";
  taxBase: number;
  taxAmount: number;
  total: number;
  status: "cobrada" | "pendiente";
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([
    {
      id: "inv-01",
      number: "FAC-2026-089",
      date: "2026-10-25",
      client: "Raúl Benítez Gómez",
      cif: "53892104M",
      clientAddress: "Calle Mayor 42, 28013 Madrid",
      clientPhone: "+34 655 432 109",
      vehicle: "Volkswagen Golf 8 (5672-LTT)",
      brand: "Volkswagen",
      model: "Golf 8 1.5 eTSI R-Line",
      plate: "5672-LTT",
      vin: "WVWZZZCDZMW104928",
      mileage: 45000,
      year: 2022,
      scheme: "REBU",
      taxBase: 3553.72,
      taxAmount: 746.28,
      total: 25900.0,
      status: "cobrada",
    },
    {
      id: "inv-02",
      number: "FAC-2026-088",
      date: "2026-10-14",
      client: "Elena Serrano Cruz",
      cif: "48201934P",
      clientAddress: "Av. de Europa 12, 28224 Pozuelo de Alarcón",
      clientPhone: "+34 677 889 001",
      vehicle: "Seat León FR (8120-LKR)",
      brand: "Seat",
      model: "León FR 2.0 TDI 150CV DSG",
      plate: "8120-LKR",
      vin: "VSSZZZKLZNR049281",
      mileage: 58000,
      year: 2021,
      scheme: "REBU",
      taxBase: 2892.56,
      taxAmount: 607.44,
      total: 21900.0,
      status: "cobrada",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDocData, setSelectedDocData] = useState<DocumentData | null>(null);

  const handleOpenInvoice = (inv: InvoiceItem) => {
    const docData: DocumentData = {
      type: "factura",
      invoiceNumber: inv.number,
      date: formatDate(inv.date),
      clientName: inv.client,
      clientDni: inv.cif,
      clientAddress: inv.clientAddress,
      clientPhone: inv.clientPhone,
      brand: inv.brand,
      model: inv.model,
      plate: inv.plate,
      vin: inv.vin,
      mileage: inv.mileage,
      year: inv.year,
      sellingPrice: inv.total,
      taxScheme: inv.scheme,
      taxBase: inv.taxBase,
      taxAmount: inv.taxAmount,
      paymentMethod: "Transferencia Bancaria",
    };
    setSelectedDocData(docData);
    setModalOpen(true);
  };

  const handleDownloadPdf = (inv: InvoiceItem) => {
    const docData: DocumentData = {
      type: "factura",
      invoiceNumber: inv.number,
      date: formatDate(inv.date),
      clientName: inv.client,
      clientDni: inv.cif,
      clientAddress: inv.clientAddress,
      clientPhone: inv.clientPhone,
      brand: inv.brand,
      model: inv.model,
      plate: inv.plate,
      vin: inv.vin,
      mileage: inv.mileage,
      year: inv.year,
      sellingPrice: inv.total,
      taxScheme: inv.scheme,
      taxBase: inv.taxBase,
      taxAmount: inv.taxAmount,
      paymentMethod: "Transferencia Bancaria",
    };
    openPrintDocument(docData);
  };

  const handleEmitNewInvoice = () => {
    const newInv: DocumentData = {
      type: "factura",
      invoiceNumber: `FAC-2026-0${invoices.length + 90}`,
      clientName: "Cliente Particular Demo",
      clientDni: "47291834K",
      clientAddress: "Calle Alcalá 120, Madrid",
      clientPhone: "+34 624 56 36 95",
      brand: "Audi",
      model: "Q5 2.0 TDI S-Line Quattro",
      plate: "9482-LPM",
      vin: "WAUZZZFY1N2094821",
      mileage: 62000,
      year: 2022,
      sellingPrice: 34900,
      taxScheme: "REBU",
      paymentMethod: "Transferencia Inmediata / Financiación",
    };
    setSelectedDocData(newInv);
    setModalOpen(true);
  };

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
          onClick={handleEmitNewInvoice}
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
              <th className="py-3 px-3">Base REBU</th>
              <th className="py-3 px-3">IVA (21%)</th>
              <th className="py-3 px-3 text-right">Total Factura</th>
              <th className="py-3 px-4 text-center">Acciones</th>
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
                <td className="py-3 px-3 text-right font-black text-white text-sm">
                  {formatCurrency(inv.total)}
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => handleOpenInvoice(inv)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      title="Ver Factura en Pantalla"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDownloadPdf(inv)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors text-[11px] font-semibold"
                      title="Descargar / Imprimir Factura PDF"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>PDF</span>
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
