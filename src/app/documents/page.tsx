"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  Download, 
  Printer, 
  Plus, 
  ShieldCheck, 
  CheckCircle, 
  Eye, 
  Car, 
  FileDown, 
  Receipt,
  FileCheck2,
  CalendarCheck
} from "lucide-react";
import { DocumentModal } from "@/components/documents/document-modal";
import { 
  DocumentData, 
  DocumentType,
  openPrintDocument, 
  downloadDocumentWord, 
  downloadDocumentHtml 
} from "@/lib/document-generator";
import { getStoredVehicles } from "@/lib/storage";
import { Vehicle } from "@/types";

interface TemplateItem {
  id: string;
  type: DocumentType;
  name: string;
  description: string;
  category: "Legal & Ventas" | "Fiscalidad" | "Comercial" | "Taller & Garantía" | "Gestoría DGT";
  badge: string;
  badgeColor: string;
}

export default function DocumentsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDocData, setSelectedDocData] = useState<DocumentData | null>(null);

  useEffect(() => {
    const list = getStoredVehicles();
    setVehicles(list);
    if (list.length > 0) {
      setSelectedVehicleId(list[0].id);
    }
  }, []);

  const activeVeh = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  const getDocDataForType = (type: DocumentType): DocumentData => {
    return {
      type,
      invoiceNumber: `FAC-2026-${activeVeh ? activeVeh.plate.replace("-", "") : "089"}`,
      clientName: "Carlos Mendoza Silva",
      clientDni: "51982341P",
      clientAddress: "Av. Complutense 45, 28805 Alcalá de Henares (Madrid)",
      clientPhone: "+34 612 345 678",
      brand: activeVeh ? activeVeh.brand : "Volkswagen",
      model: activeVeh ? activeVeh.model : "Golf 8",
      version: activeVeh ? activeVeh.version : "R-Line DSG",
      plate: activeVeh ? activeVeh.plate : "5672-LTT",
      vin: activeVeh ? activeVeh.vin : "WVWZZZCDZMW104928",
      mileage: activeVeh ? activeVeh.mileage : 45000,
      year: activeVeh ? activeVeh.year : 2022,
      fuelType: activeVeh ? activeVeh.fuel_type : "Diésel",
      color: activeVeh ? activeVeh.color : "Gris Metalizado",
      sellingPrice: activeVeh ? activeVeh.selling_price : 25900,
      depositAmount: 500,
      taxScheme: "REBU",
      paymentMethod: "Transferencia Bancaria Inmediata",
    };
  };

  const handlePreview = (type: DocumentType) => {
    const data = getDocDataForType(type);
    setSelectedDocData(data);
    setModalOpen(true);
  };

  const handleDirectPrint = (type: DocumentType) => {
    const data = getDocDataForType(type);
    openPrintDocument(data);
  };

  const handleDownloadWord = (type: DocumentType) => {
    const data = getDocDataForType(type);
    downloadDocumentWord(data);
  };

  const templates: TemplateItem[] = [
    {
      id: "tmpl-01",
      type: "contrato",
      name: "Contrato Compraventa Oficial VO (REBU)",
      description: "Contrato legal adaptado a la legislación española con cláusulas de garantía de 12 meses, ausencia de cargas, kilometraje certificado y registro DGT.",
      category: "Legal & Ventas",
      badge: "Obligatorio VO",
      badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    },
    {
      id: "tmpl-02",
      type: "factura",
      name: "Factura Oficial de Venta (Régimen REBU)",
      description: "Factura ordinaria con membrete mercantil de Orlando Cars S.L. y mención legal preceptiva de exención de desglose (Arts. 135 a 139 Ley del IVA).",
      category: "Fiscalidad",
      badge: "Hacienda / AEAT",
      badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    },
    {
      id: "tmpl-03",
      type: "reserva",
      name: "Documento de Reserva y Señal (Arras)",
      description: "Justificante de entrega a cuenta (500 € / 1.000 €), bloqueo de stock durante 15 días y cláusula de arras penitenciales según Art. 1454 del Código Civil.",
      category: "Comercial",
      badge: "Arras Penitenciales",
      badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    },
    {
      id: "tmpl-04",
      type: "entrega",
      name: "Acta de Entrega y Recepción de Vehículo",
      description: "Checklist pericial de estado de carrocería, neumáticos, 2 mandos/llaves, manuales, ITV y firma de conformidad horaria eximiendo de multas.",
      category: "Legal & Ventas",
      badge: "Exención Multas",
      badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    },
    {
      id: "tmpl-05",
      type: "garantia",
      name: "Certificado de Garantía Mecánica 12 Meses",
      description: "Póliza con desglose completo de coberturas mecánicas: bloque de motor, culata, caja de cambios, turbocompresor, inyección y frenos.",
      category: "Taller & Garantía",
      badge: "1 Año Cobertura",
      badgeColor: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    },
    {
      id: "tmpl-06",
      type: "mandato_dgt",
      name: "Mandato Oficial de Representación DGT",
      description: "Autorización oficial para Gestoría Administrativa Colegiada para el cambio de titularidad y transferencia telemática ante la Jefatura de Tráfico.",
      category: "Gestoría DGT",
      badge: "Gestoría Colegiada",
      badgeColor: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    },
    {
      id: "tmpl-07",
      type: "notificacion_dgt",
      name: "Notificación de Venta de Vehículo a la DGT",
      description: "Comunicación formal del transmitente a Tráfico para desligar responsabilidades civiles, tributarias y penales tras la venta.",
      category: "Gestoría DGT",
      badge: "Seguridad Vendedor",
      badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header and Vehicle Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Documentación & Plantillas Digitales</span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-semibold border border-blue-500/30">
              Formatos España 2026
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Modelos oficiales adaptados a la legislación española: previsualiza en pantalla, descarga en Word (.doc) o genera en PDF para firma.
          </p>
        </div>

        {/* Vehicle Selector */}
        {vehicles.length > 0 && (
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs shadow-md">
            <Car className="w-4 h-4 text-blue-400 ml-1 flex-shrink-0" />
            <span className="text-slate-400 font-medium whitespace-nowrap">Vehículo para datos:</span>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-blue-500"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.plate} — {v.brand} {v.model} ({v.selling_price.toLocaleString("es-ES")} €)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((tmpl) => (
          <div
            key={tmpl.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-md group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border ${tmpl.badgeColor}`}>
                  {tmpl.badge}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">{tmpl.category}</span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                {tmpl.name}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed min-h-[48px]">
                {tmpl.description}
              </p>
            </div>

            <div className="pt-3.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => handlePreview(tmpl.type)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                title="Abrir vista previa del documento con los datos del coche"
              >
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                <span>Abrir / Ver</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleDownloadWord(tmpl.type)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
                  title="Descargar plantilla editable para Microsoft Word (.doc)"
                >
                  <FileDown className="w-3.5 h-3.5 text-blue-400" />
                  <span>Word</span>
                </button>
                <button
                  onClick={() => handleDirectPrint(tmpl.type)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-md shadow-blue-600/20 active:scale-95"
                  title="Descargar o imprimir directamente como PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
              </div>
            </div>
          </div>
        ))}
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
