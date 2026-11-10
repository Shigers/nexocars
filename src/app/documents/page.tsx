"use client";

import { useState } from "react";
import { 
  FileText, 
  Printer, 
  Eye, 
  FileDown, 
  ShieldCheck, 
  Receipt,
  FileCheck2,
  CalendarCheck,
  CheckCircle,
  FileSignature
} from "lucide-react";
import { DocumentModal } from "@/components/documents/document-modal";
import { 
  DocumentType,
  openPrintDocument, 
  downloadDocumentWord 
} from "@/lib/document-generator";

interface TemplateItem {
  id: string;
  type: DocumentType;
  name: string;
  description: string;
  category: "Legal & Ventas" | "Fiscalidad" | "Comercial" | "Taller & Garantía" | "Gestoría DGT";
  badge: string;
  badgeColor: string;
  icon: any;
}

export default function DocumentsPage() {
  const [activeModalType, setActiveModalType] = useState<DocumentType | null>(null);
  const [activeModalTitle, setActiveModalTitle] = useState<string>("");

  const templates: TemplateItem[] = [
    {
      id: "tmpl-01",
      type: "contrato",
      name: "Contrato Compraventa Oficial VO (REBU)",
      description: "Contrato legal adaptado a la legislación española con cláusulas de garantía de 12 meses, ausencia de cargas, kilometraje certificado y registro DGT.",
      category: "Legal & Ventas",
      badge: "Oficial VO",
      badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      icon: FileSignature,
    },
    {
      id: "tmpl-02",
      type: "factura",
      name: "Factura Oficial de Venta (Régimen REBU)",
      description: "Factura oficial con membrete de Orlando Cars S.L. y mención legal obligatoria de exención de desglose (Arts. 135 a 139 Ley del IVA).",
      category: "Fiscalidad",
      badge: "AEAT / Hacienda",
      badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      icon: Receipt,
    },
    {
      id: "tmpl-03",
      type: "reserva",
      name: "Documento de Reserva y Señal (Arras)",
      description: "Justificante de depósito a cuenta (señal), bloqueo de vehículo y cláusula de arras penitenciales según Art. 1454 del Código Civil.",
      category: "Comercial",
      badge: "Arras Penitenciales",
      badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      icon: CheckCircle,
    },
    {
      id: "tmpl-04",
      type: "entrega",
      name: "Acta de Entrega y Recepción de Vehículo",
      description: "Checklist pericial de estado de carrocería, neumáticos (>3.5mm), 2 mandos/llaves, ITV y conformidad horaria eximiendo de multas.",
      category: "Legal & Ventas",
      badge: "Exención Multas",
      badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
      icon: FileCheck2,
    },
    {
      id: "tmpl-05",
      type: "garantia",
      name: "Certificado de Garantía Mecánica 12 Meses",
      description: "Póliza con desglose completo de coberturas mecánicas: bloque motor, culata, caja de cambios, turbocompresor, inyección y frenos.",
      category: "Taller & Garantía",
      badge: "1 Año Cobertura",
      badgeColor: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
      icon: ShieldCheck,
    },
    {
      id: "tmpl-06",
      type: "mandato_dgt",
      name: "Mandato Oficial de Representación DGT",
      description: "Autorización para Gestoría Administrativa Colegiada para el cambio telemático de titularidad y transferencia ante Tráfico.",
      category: "Gestoría DGT",
      badge: "Gestoría Colegiada",
      badgeColor: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
      icon: FileText,
    },
    {
      id: "tmpl-07",
      type: "notificacion_dgt",
      name: "Notificación de Venta de Vehículo a la DGT",
      description: "Comunicación formal del transmitente a Tráfico para desligar responsabilidades civiles, tributarias y penales tras la venta.",
      category: "Gestoría DGT",
      badge: "Seguridad Vendedor",
      badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
      icon: CalendarCheck,
    },
  ];

  const handleOpenDocument = (tmpl: TemplateItem) => {
    setActiveModalType(tmpl.type);
    setActiveModalTitle(tmpl.name);
  };

  const handleQuickDownloadBlankWord = (type: DocumentType) => {
    downloadDocumentWord({ type, isBlank: true });
  };

  const handleQuickPrintBlankPdf = (type: DocumentType) => {
    openPrintDocument({ type, isBlank: true });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Documentación & Plantillas Digitales</span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-semibold border border-blue-500/30">
              Orlando Cars
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cada documento es 100% autónomo. Abre solo el que necesites para rellenarlo en el momento o descárgalo en blanco directamente.
          </p>
        </div>
      </div>

      {/* Grid of Autonomous Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((tmpl) => {
          const Icon = tmpl.icon;
          return (
            <div
              key={tmpl.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-all shadow-md group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border ${tmpl.badgeColor}`}>
                    {tmpl.badge}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">{tmpl.category}</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-blue-400 flex-shrink-0 group-hover:border-blue-500/30 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                    {tmpl.name}
                  </h3>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed min-h-[44px]">
                  {tmpl.description}
                </p>
              </div>

              {/* Botones de acción autónomos para ESTE documento */}
              <div className="pt-3.5 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenDocument(tmpl)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 active:scale-95"
                  title="Abrir editor autónomo de este documento (en blanco o rellenar)"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Abrir Documento</span>
                </button>

                <div className="flex items-center gap-1.5 justify-end">
                  <button
                    onClick={() => handleQuickDownloadBlankWord(tmpl.type)}
                    className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
                    title="Descargar plantilla en blanco para Word (.doc)"
                  >
                    <FileDown className="w-3.5 h-3.5 text-blue-400" />
                    <span>Word</span>
                  </button>
                  <button
                    onClick={() => handleQuickPrintBlankPdf(tmpl.type)}
                    className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
                    title="Imprimir o guardar en PDF directamente en blanco"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-400" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Autónomo: Abre únicamente el documento que el usuario seleccionó */}
      {activeModalType && (
        <DocumentModal
          isOpen={!!activeModalType}
          onClose={() => setActiveModalType(null)}
          documentType={activeModalType}
          title={activeModalTitle}
        />
      )}
    </div>
  );
}
