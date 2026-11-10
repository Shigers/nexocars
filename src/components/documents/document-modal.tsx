"use client";

import { useState, useEffect } from "react";
import { X, Printer, Download, FileText, FileDown, RotateCcw, Sparkles } from "lucide-react";
import { 
  DocumentData, 
  DocumentType,
  generateDocumentHtml, 
  openPrintDocument, 
  downloadDocumentWord, 
  downloadDocumentHtml 
} from "@/lib/document-generator";

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType?: DocumentType;
  title?: string;
  initialData?: DocumentData;
}

export function DocumentModal({ 
  isOpen, 
  onClose, 
  documentType: explicitType, 
  title: explicitTitle, 
  initialData 
}: DocumentModalProps) {
  const docType: DocumentType = explicitType || initialData?.type || "contrato";
  const docTitle: string = explicitTitle || (initialData?.type === "factura" ? "Factura Oficial de Venta" : initialData?.type === "reserva" ? "Documento de Reserva y Arras" : "Contrato Compraventa Oficial VO");

  // Estado local para los campos rellenables de ESTE documento concreto
  const [isBlankMode, setIsBlankMode] = useState(initialData ? !!initialData.isBlank : true);
  
  // Campos del cliente
  const [clientName, setClientName] = useState(initialData?.clientName || "");
  const [clientDni, setClientDni] = useState(initialData?.clientDni || "");
  const [clientAddress, setClientAddress] = useState(initialData?.clientAddress || "");
  const [clientPhone, setClientPhone] = useState(initialData?.clientPhone || "");
  
  // Campos del vehículo
  const [brand, setBrand] = useState(initialData?.brand || "");
  const [model, setModel] = useState(initialData?.model || "");
  const [plate, setPlate] = useState(initialData?.plate || "");
  const [vin, setVin] = useState(initialData?.vin || "");
  const [mileage, setMileage] = useState(initialData?.mileage ? String(initialData.mileage) : "");
  const [year, setYear] = useState(initialData?.year ? String(initialData.year) : "");
  
  // Importes
  const [price, setPrice] = useState(initialData?.sellingPrice ? String(initialData.sellingPrice) : "");
  const [deposit, setDeposit] = useState(initialData?.depositAmount ? String(initialData.depositAmount) : "500");
  const [paymentMethod, setPaymentMethod] = useState(initialData?.paymentMethod || "Transferencia Bancaria");

  // Sincronizar cuando cambia initialData o se abre
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setIsBlankMode(!!initialData.isBlank);
        setClientName(initialData.clientName || "");
        setClientDni(initialData.clientDni || "");
        setClientAddress(initialData.clientAddress || "");
        setClientPhone(initialData.clientPhone || "");
        setBrand(initialData.brand || "");
        setModel(initialData.model || "");
        setPlate(initialData.plate || "");
        setVin(initialData.vin || "");
        setMileage(initialData.mileage ? String(initialData.mileage) : "");
        setYear(initialData.year ? String(initialData.year) : "");
        setPrice(initialData.sellingPrice ? String(initialData.sellingPrice) : "");
        setDeposit(initialData.depositAmount ? String(initialData.depositAmount) : "500");
        setPaymentMethod(initialData.paymentMethod || "Transferencia Bancaria");
      } else {
        setIsBlankMode(true);
        setClientName("");
        setClientDni("");
        setClientAddress("");
        setClientPhone("");
        setBrand("");
        setModel("");
        setPlate("");
        setVin("");
        setMileage("");
        setYear("");
        setPrice("");
        setDeposit("500");
      }
    }
  }, [isOpen, explicitType, initialData]);

  if (!isOpen) return null;

  const currentDocData: DocumentData = {
    type: docType,
    isBlank: isBlankMode,
    clientName: clientName.trim(),
    clientDni: clientDni.trim(),
    clientAddress: clientAddress.trim(),
    clientPhone: clientPhone.trim(),
    brand: brand.trim(),
    model: model.trim(),
    plate: plate.trim().toUpperCase(),
    vin: vin.trim().toUpperCase(),
    mileage: mileage ? Number(mileage) : undefined,
    year: year ? Number(year) : undefined,
    sellingPrice: price ? Number(price) : undefined,
    depositAmount: deposit ? Number(deposit) : 500,
    paymentMethod,
    taxScheme: "REBU",
  };

  const htmlContent = generateDocumentHtml(currentDocData);

  const handleClearAll = () => {
    setClientName("");
    setClientDni("");
    setClientAddress("");
    setClientPhone("");
    setBrand("");
    setModel("");
    setPlate("");
    setVin("");
    setMileage("");
    setYear("");
    setPrice("");
    setDeposit("500");
    setIsBlankMode(true);
  };

  const handleInputChange = () => {
    if (isBlankMode) {
      setIsBlankMode(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[96vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Cabecera del Documento Autónomo */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-white truncate">
                {docTitle}
              </h2>
              <p className="text-[11px] text-slate-400 truncate">
                {isBlankMode ? "Modo: Plantilla Oficial en Blanco (con líneas de firma)" : "Modo: Rellenado con datos en vivo"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Botón Vaciar / Dejar en Blanco */}
            <button
              onClick={handleClearAll}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isBlankMode 
                  ? "bg-blue-600/20 text-blue-400 border-blue-500/40" 
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
              }`}
              title="Borrar datos y dejar la plantilla 100% en blanco"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Dejar en Blanco</span>
            </button>

            {/* Descargar Word (.doc) */}
            <button
              onClick={() => downloadDocumentWord(currentDocData)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all hover:scale-[1.02] active:scale-95"
              title="Descargar archivo editable para Microsoft Word"
            >
              <FileDown className="w-3.5 h-3.5 text-blue-400" />
              <span>Word (.doc)</span>
            </button>

            {/* Imprimir / Guardar PDF */}
            <button
              onClick={() => openPrintDocument(currentDocData)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-95"
              title="Imprimir o guardar en PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>

            {/* Cerrar */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cuerpo Principal: Panel de Edición + Previsualización en Tiempo Real */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-0">
          
          {/* PANEL IZQUIERDO: Formulario Rellenable Rápido de ESTE documento */}
          <div className="lg:col-span-5 p-4 sm:p-5 overflow-y-auto border-r border-slate-800/80 bg-slate-900/60 space-y-4 text-xs">
            
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <h3 className="font-bold text-white uppercase tracking-wider text-[11px] mb-1 flex items-center gap-1.5">
                <span>Rellenar Campos de Este Documento</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Escribe los datos que quieras. Los campos que dejes vacíos saldrán con línea punteada en blanco para rellenar a mano.
              </p>
            </div>

            {/* SECCIÓN 1: Datos del Comprador / Cliente */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-bold uppercase text-blue-400 tracking-wider">
                1. Datos del Cliente / Comprador
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Nombre Completo:</label>
                <input
                  type="text"
                  placeholder="Ej. Raúl Benítez Gómez (o dejar en blanco)"
                  value={clientName}
                  onChange={(e) => { setClientName(e.target.value); handleInputChange(); }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">DNI / NIE / CIF:</label>
                  <input
                    type="text"
                    placeholder="Ej. 53892104M"
                    value={clientDni}
                    onChange={(e) => { setClientDni(e.target.value); handleInputChange(); }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-600 font-mono text-[11px] focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Teléfono:</label>
                  <input
                    type="text"
                    placeholder="Ej. +34 655 432 109"
                    value={clientPhone}
                    onChange={(e) => { setClientPhone(e.target.value); handleInputChange(); }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-600 text-[11px] focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              {(docType === "contrato" || docType === "factura" || docType === "mandato_dgt") && (
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Dirección / Domicilio:</label>
                  <input
                    type="text"
                    placeholder="Ej. Calle Mayor 42, 28013 Madrid"
                    value={clientAddress}
                    onChange={(e) => { setClientAddress(e.target.value); handleInputChange(); }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            {/* SECCIÓN 2: Datos del Vehículo */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800">
              <div className="text-[11px] font-bold uppercase text-purple-400 tracking-wider">
                2. Datos del Vehículo
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Marca:</label>
                  <input
                    type="text"
                    placeholder="Ej. Volkswagen, Audi..."
                    value={brand}
                    onChange={(e) => { setBrand(e.target.value); handleInputChange(); }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Modelo / Versión:</label>
                  <input
                    type="text"
                    placeholder="Ej. Golf 8 1.5 eTSI"
                    value={model}
                    onChange={(e) => { setModel(e.target.value); handleInputChange(); }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Matrícula:</label>
                  <input
                    type="text"
                    placeholder="Ej. 5672-LTT"
                    value={plate}
                    onChange={(e) => { setPlate(e.target.value); handleInputChange(); }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-600 font-mono font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Kilómetros:</label>
                  <input
                    type="number"
                    placeholder="Ej. 45000"
                    value={mileage}
                    onChange={(e) => { setMileage(e.target.value); handleInputChange(); }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-600 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Nº Bastidor (VIN):</label>
                <input
                  type="text"
                  placeholder="Ej. WVWZZZCDZMW104928"
                  value={vin}
                  onChange={(e) => { setVin(e.target.value); handleInputChange(); }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-600 font-mono text-[11px] focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* SECCIÓN 3: Precios e Importes */}
            {(docType === "contrato" || docType === "factura" || docType === "reserva") && (
              <div className="space-y-2.5 pt-2 border-t border-slate-800">
                <div className="text-[11px] font-bold uppercase text-emerald-400 tracking-wider">
                  3. Precios y Condiciones
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Precio Total (€):</label>
                    <input
                      type="number"
                      placeholder="Ej. 25900"
                      value={price}
                      onChange={(e) => { setPrice(e.target.value); handleInputChange(); }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-600 font-mono font-bold text-emerald-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  {docType === "reserva" && (
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Señal / Arras (€):</label>
                      <input
                        type="number"
                        placeholder="Ej. 500"
                        value={deposit}
                        onChange={(e) => { setDeposit(e.target.value); handleInputChange(); }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-600 font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}
                  {docType !== "reserva" && (
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Forma de Pago:</label>
                      <input
                        type="text"
                        placeholder="Ej. Transferencia / Financiación"
                        value={paymentMethod}
                        onChange={(e) => { setPaymentMethod(e.target.value); handleInputChange(); }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* PANEL DERECHO: Previsualización Exacta en Folio A4 Oficial */}
          <div className="lg:col-span-7 p-4 sm:p-6 overflow-y-auto bg-slate-950/70 flex justify-center">
            <div className="w-full max-w-[700px] bg-white text-slate-900 p-6 sm:p-10 rounded-xl shadow-2xl text-xs space-y-4">
              <style jsx global>{`
                .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 18px; }
                .logo-text { font-size: 20px; font-weight: 900; letter-spacing: -0.5px; color: #0f172a; }
                .logo-text span { color: #0284c7; }
                .doc-title { font-size: 14px; font-weight: 800; text-transform: uppercase; color: #0f172a; margin-top: 3px; }
                .company-info { font-size: 10px; color: #475569; text-align: right; line-height: 1.35; }
                .section { margin-bottom: 14px; }
                .section-title { font-size: 10.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0284c7; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px; margin-bottom: 6px; }
                .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                .info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px; }
                .info-row { display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 11px; }
                .info-label { color: #64748b; font-weight: 500; }
                .info-value { color: #0f172a; font-weight: 700; text-align: right; }
                table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 11px; }
                th { background: #f1f5f9; color: #334155; font-weight: 700; text-align: left; padding: 6px 8px; border-bottom: 1px solid #cbd5e1; font-size: 10px; text-transform: uppercase; }
                td { padding: 6px 8px; border-bottom: 1px solid #e2e8f0; color: #1e293b; }
                .total-box { margin-top: 12px; display: flex; justify-content: flex-end; }
                .total-card { width: 260px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; }
                .rebu-notice { margin-top: 12px; padding: 8px 10px; background: #eff6ff; border-left: 3px solid #2563eb; font-size: 10px; color: #1e40af; line-height: 1.35; border-radius: 4px; }
                .clause-p { font-size: 10.5px; color: #334155; text-align: justify; margin-bottom: 6px; line-height: 1.4; }
                .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 30px; }
                .signature-box { border-top: 1px solid #0f172a; padding-top: 6px; text-align: center; font-size: 10.5px; color: #475569; }
                .signature-box strong { display: block; font-size: 11px; color: #0f172a; margin-bottom: 2px; }
                .stamp-placeholder { height: 40px; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-style: italic; font-size: 10px; }
                .footer { margin-top: 18px; border-top: 1px solid #e2e8f0; padding-top: 6px; font-size: 9px; color: #94a3b8; text-align: center; }
              `}</style>
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
