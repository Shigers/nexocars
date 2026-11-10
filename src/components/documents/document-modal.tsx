"use client";

import { useState } from "react";
import { X, Printer, Download, FileText, CheckCircle2 } from "lucide-react";
import { DocumentData, generateDocumentHtml, openPrintDocument } from "@/lib/document-generator";

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: DocumentData;
}

export function DocumentModal({ isOpen, onClose, initialData }: DocumentModalProps) {
  if (!isOpen) return null;

  const htmlContent = generateDocumentHtml(initialData);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white capitalize">
                Visor Oficial: {initialData.type === "factura" ? "Factura de Venta" : initialData.type === "contrato" ? "Contrato de Compraventa" : initialData.type === "reserva" ? "Documento de Reserva" : "Acta de Entrega"}
              </h3>
              <p className="text-[11px] text-slate-400">
                {initialData.brand} {initialData.model} • Matrícula: {initialData.plate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openPrintDocument(initialData)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Guardar en PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Paper Container Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950/40 flex justify-center">
          <div className="w-full max-w-[760px] bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-xl text-xs space-y-4">
            <style jsx global>{`
              .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; }
              .logo-text { font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #0f172a; }
              .logo-text span { color: #0284c7; }
              .doc-title { font-size: 16px; font-weight: 800; text-transform: uppercase; color: #0f172a; margin-top: 4px; }
              .company-info { font-size: 11px; color: #475569; text-align: right; line-height: 1.4; }
              .section { margin-bottom: 16px; }
              .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0284c7; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 8px; }
              .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
              .info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; }
              .info-row { display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; }
              .info-label { color: #64748b; font-weight: 500; }
              .info-value { color: #0f172a; font-weight: 700; text-align: right; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
              th { background: #f1f5f9; color: #334155; font-weight: 700; text-align: left; padding: 8px 10px; border-bottom: 1px solid #cbd5e1; font-size: 11px; text-transform: uppercase; }
              td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; color: #1e293b; }
              .total-box { margin-top: 15px; display: flex; justify-content: flex-end; }
              .total-card { width: 280px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; }
              .rebu-notice { margin-top: 15px; padding: 10px 12px; background: #eff6ff; border-left: 3px solid #2563eb; font-size: 10.5px; color: #1e40af; line-height: 1.4; border-radius: 4px; }
              .clause-p { font-size: 11px; color: #334155; text-align: justify; margin-bottom: 8px; line-height: 1.45; }
              .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px; }
              .signature-box { border-top: 1px solid #0f172a; padding-top: 8px; text-align: center; font-size: 11px; color: #475569; }
              .signature-box strong { display: block; font-size: 12px; color: #0f172a; margin-bottom: 2px; }
              .stamp-placeholder { height: 50px; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-style: italic; font-size: 11px; }
              .footer { margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 8px; font-size: 9.5px; color: #94a3b8; text-align: center; }
            `}</style>
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>
        </div>
      </div>
    </div>
  );
}
