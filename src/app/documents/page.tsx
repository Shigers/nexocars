"use client";

import { useState, useEffect } from "react";
import { FileText, Download, Printer, Plus, ShieldCheck, CheckCircle, Eye, Car } from "lucide-react";
import { DocumentModal } from "@/components/documents/document-modal";
import { DocumentData, openPrintDocument } from "@/lib/document-generator";
import { getStoredVehicles } from "@/lib/storage";
import { Vehicle } from "@/types";

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

  const getDocDataForType = (type: "contrato" | "reserva" | "entrega" | "mandato_dgt"): DocumentData => {
    return {
      type,
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

  const handlePreview = (type: "contrato" | "reserva" | "entrega" | "mandato_dgt") => {
    const data = getDocDataForType(type);
    setSelectedDocData(data);
    setModalOpen(true);
  };

  const handleDirectPrint = (type: "contrato" | "reserva" | "entrega" | "mandato_dgt") => {
    const data = getDocDataForType(type);
    openPrintDocument(data);
  };

  const templates = [
    {
      id: "tmpl-01",
      type: "contrato" as const,
      name: "Contrato Compraventa Oficial VO (REBU)",
      description: "Contrato legal adaptado a la legislación española con cláusulas de garantía de 12 meses, ausencia de cargas y registro DGT.",
      category: "Legal & Ventas",
    },
    {
      id: "tmpl-02",
      type: "reserva" as const,
      name: "Documento de Reserva y Señal (Arras)",
      description: "Justificante de entrega a cuenta (500 € / 1.000 €) y compromiso de retirada de stock según Art. 1454 del Código Civil.",
      category: "Comercial",
    },
    {
      id: "tmpl-03",
      type: "entrega" as const,
      name: "Acta de Entrega y Recepción de Vehículo",
      description: "Checklist de estado de carrocería, neumáticos, 2 llaves, manuales, ITV y firma de conformidad del cliente.",
      category: "Operaciones",
    },
    {
      id: "tmpl-04",
      type: "mandato_dgt" as const,
      name: "Mandato de Venta y Gestión DGT",
      description: "Autorización oficial de representación para gestoría y cambio telemático de titularidad en Tráfico.",
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
            Generación instantánea de contratos oficiales, reservas y expedientes en PDF listos para imprimir o firmar
          </p>
        </div>

        {/* Vehicle Selector */}
        {vehicles.length > 0 && (
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs">
            <Car className="w-4 h-4 text-blue-400 ml-1.5" />
            <span className="text-slate-400 font-medium">Asociar a vehículo:</span>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((tmpl) => (
          <div
            key={tmpl.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-md"
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
              <span className="text-[11px] text-slate-500">Formato A4 Vectorial</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePreview(tmpl.type)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                  title="Abrir vista previa del documento"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver Documento</span>
                </button>
                <button
                  onClick={() => handleDirectPrint(tmpl.type)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-md shadow-blue-600/20"
                  title="Descargar o imprimir directamente como PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>PDF / Imprimir</span>
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
