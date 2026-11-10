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
  CalendarCheck,
  Edit3,
  Layers
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
  
  // Modo de operación: "blank" (en blanco por defecto) o "custom" (rellenado)
  const [documentMode, setDocumentMode] = useState<"blank" | "custom">("blank");
  
  // Datos personalizados para rellenar en el momento
  const [customClientName, setCustomClientName] = useState("");
  const [customClientDni, setCustomClientDni] = useState("");
  const [customClientPhone, setCustomClientPhone] = useState("");
  const [customBrand, setCustomBrand] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [customPlate, setCustomPlate] = useState("");
  const [customVin, setCustomVin] = useState("");
  const [customKm, setCustomKm] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const [customDeposit, setCustomDeposit] = useState("500");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDocData, setSelectedDocData] = useState<DocumentData | null>(null);

  useEffect(() => {
    setVehicles(getStoredVehicles());
  }, []);

  const getDocDataForType = (type: DocumentType, forceBlank = false): DocumentData => {
    const isBlank = forceBlank || documentMode === "blank";

    if (isBlank) {
      return {
        type,
        isBlank: true,
      };
    }

    return {
      type,
      isBlank: false,
      invoiceNumber: `FAC-2026-${customPlate ? customPlate.replace("-", "") : "089"}`,
      clientName: customClientName || "Nombre del Cliente",
      clientDni: customClientDni || "DNI / NIE",
      clientPhone: customClientPhone || "+34 600 000 000",
      brand: customBrand || "Marca",
      model: customModel || "Modelo",
      plate: customPlate || "0000-XXX",
      vin: customVin || "VIN...",
      mileage: Number(customKm) || 0,
      year: 2022,
      sellingPrice: Number(customPrice) || 0,
      depositAmount: Number(customDeposit) || 500,
      taxScheme: "REBU",
      paymentMethod: "Transferencia Bancaria",
    };
  };

  const handlePreview = (type: DocumentType, isBlank = false) => {
    const data = getDocDataForType(type, isBlank);
    setSelectedDocData(data);
    setModalOpen(true);
  };

  const handleDirectPrint = (type: DocumentType, isBlank = false) => {
    const data = getDocDataForType(type, isBlank);
    openPrintDocument(data);
  };

  const handleDownloadWord = (type: DocumentType, isBlank = false) => {
    const data = getDocDataForType(type, isBlank);
    downloadDocumentWord(data);
  };

  const templates: TemplateItem[] = [
    {
      id: "tmpl-01",
      type: "contrato",
      name: "Contrato Compraventa Oficial VO (REBU)",
      description: "Contrato legal adaptado a la legislación española con cláusulas de garantía de 12 meses, ausencia de cargas, kilometraje certificado y registro DGT.",
      category: "Legal & Ventas",
      badge: "Plantilla en Blanco",
      badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    },
    {
      id: "tmpl-02",
      type: "factura",
      name: "Factura Oficial de Venta (Régimen REBU)",
      description: "Factura oficial con membrete de Orlando Cars S.L. y mención obligatoria de exención de desglose (Arts. 135 a 139 Ley del IVA).",
      category: "Fiscalidad",
      badge: "AEAT / Hacienda",
      badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    },
    {
      id: "tmpl-03",
      type: "reserva",
      name: "Documento de Reserva y Señal (Arras)",
      description: "Justificante de depósito a cuenta (señal), bloqueo de vehículo y cláusula de arras penitenciales según Art. 1454 del Código Civil.",
      category: "Comercial",
      badge: "Arras Penitenciales",
      badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    },
    {
      id: "tmpl-04",
      type: "entrega",
      name: "Acta de Entrega y Recepción de Vehículo",
      description: "Checklist pericial de estado de carrocería, neumáticos (>3.5mm), 2 mandos/llaves, ITV y conformidad horaria eximiendo de multas.",
      category: "Legal & Ventas",
      badge: "Exención Multas",
      badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    },
    {
      id: "tmpl-05",
      type: "garantia",
      name: "Certificado de Garantía Mecánica 12 Meses",
      description: "Póliza con desglose completo de coberturas mecánicas: bloque motor, culata, caja de cambios, turbocompresor, inyección y frenos.",
      category: "Taller & Garantía",
      badge: "1 Año Cobertura",
      badgeColor: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    },
    {
      id: "tmpl-06",
      type: "mandato_dgt",
      name: "Mandato Oficial de Representación DGT",
      description: "Autorización para Gestoría Administrativa Colegiada para el cambio telemático de titularidad y transferencia ante Tráfico.",
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
      {/* Header and Mode Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Documentación & Plantillas Digitales</span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30">
              Orlando Cars Oficial
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Modelos oficiales listos en blanco para imprimir y firmar en mano, o para rellenar en el momento de la venta.
          </p>
        </div>

        {/* Tab Toggle: En Blanco vs Rellenar en el momento */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setDocumentMode("blank")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              documentMode === "blank"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Plantillas en Blanco (Oficial)</span>
          </button>
          <button
            onClick={() => setDocumentMode("custom")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              documentMode === "custom"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Rellenar Datos en el Momento</span>
          </button>
        </div>
      </div>

      {/* Formulario Rápido si el modo es "custom" */}
      {documentMode === "custom" && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-blue-500/30 shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-blue-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Introduce los Datos Reales de la Operación en Orlando Cars
              </h2>
            </div>
            <span className="text-[10px] text-slate-400">
              Se aplicarán instantáneamente a los 7 documentos de abajo
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Nombre Completo del Cliente:</label>
              <input
                type="text"
                placeholder="Ej. Juan Pérez García"
                value={customClientName}
                onChange={(e) => setCustomClientName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">DNI / NIE / CIF:</label>
              <input
                type="text"
                placeholder="Ej. 53892104M"
                value={customClientDni}
                onChange={(e) => setCustomClientDni(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Teléfono:</label>
              <input
                type="text"
                placeholder="Ej. +34 600 123 456"
                value={customClientPhone}
                onChange={(e) => setCustomClientPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Marca del Vehículo:</label>
              <input
                type="text"
                placeholder="Ej. Audi, Mercedes, BMW..."
                value={customBrand}
                onChange={(e) => setCustomBrand(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Modelo / Versión:</label>
              <input
                type="text"
                placeholder="Ej. A4 2.0 TDI S-Line"
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Matrícula:</label>
              <input
                type="text"
                placeholder="Ej. 1234-LBC"
                value={customPlate}
                onChange={(e) => setCustomPlate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-blue-500 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Nº Bastidor (VIN):</label>
              <input
                type="text"
                placeholder="Ej. WAUZZZ..."
                value={customVin}
                onChange={(e) => setCustomVin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-blue-500 font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Kilómetros:</label>
              <input
                type="number"
                placeholder="Ej. 65000"
                value={customKm}
                onChange={(e) => setCustomKm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Precio Final Pactado (€):</label>
              <input
                type="number"
                placeholder="Ej. 24900"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-blue-500 font-mono font-bold text-emerald-400"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Señal / Reserva (€):</label>
              <input
                type="number"
                placeholder="Ej. 500"
                value={customDeposit}
                onChange={(e) => setCustomDeposit(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>
        </div>
      )}

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
                  {documentMode === "blank" ? "Plantilla Oficial en Blanco" : "Rellenada con Datos"}
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
                title={documentMode === "blank" ? "Ver plantilla oficial en blanco con líneas para rellenar a mano" : "Ver documento con los datos introducidos"}
              >
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                <span>{documentMode === "blank" ? "Ver en Blanco" : "Ver Documento"}</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleDownloadWord(tmpl.type)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
                  title="Descargar archivo editable para Microsoft Word (.doc)"
                >
                  <FileDown className="w-3.5 h-3.5 text-blue-400" />
                  <span>Word</span>
                </button>
                <button
                  onClick={() => handleDirectPrint(tmpl.type)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-md shadow-blue-600/20 active:scale-95"
                  title="Imprimir directamente o guardar en PDF"
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
