"use client";

import { useState, useEffect } from "react";
import { X, Printer, FileDown, RotateCcw } from "lucide-react";
import { DocumentType, DocumentData } from "@/lib/document-generator";

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
  const documentType: DocumentType = explicitType || initialData?.type || "contrato";
  const title: string = explicitTitle || (
    documentType === "factura" ? "Factura Oficial de Venta (Régimen REBU)" :
    documentType === "reserva" ? "Documento de Reserva y Señal (Arras)" :
    documentType === "entrega" ? "Acta de Entrega y Recepción de Vehículo" :
    documentType === "garantia" ? "Certificado de Garantía Mecánica 12 Meses" :
    documentType === "mandato_dgt" ? "Mandato Oficial de Representación DGT" :
    documentType === "notificacion_dgt" ? "Notificación de Venta y Transmisión DGT" :
    "Contrato Compraventa Oficial VO (REBU)"
  );

  // Estado 100% aislado y exclusivo para este documento
  const [cName, setCName] = useState(initialData?.clientName || "");
  const [cDni, setCDni] = useState(initialData?.clientDni || "");
  const [cAddress, setCAddress] = useState(initialData?.clientAddress || "");
  const [cPhone, setCPhone] = useState(initialData?.clientPhone || "");

  const [vBrand, setVBrand] = useState(initialData?.brand || "");
  const [vModel, setVModel] = useState(initialData?.model || "");
  const [vPlate, setVPlate] = useState(initialData?.plate || "");
  const [vVin, setVVin] = useState(initialData?.vin || "");
  const [vKm, setVKm] = useState(initialData?.mileage ? String(initialData.mileage) : "");
  const [vYear, setVYear] = useState(initialData?.year ? String(initialData.year) : "");
  const [vColor, setVColor] = useState(initialData?.color || "");
  const [vFuel, setVFuel] = useState(initialData?.fuelType || "");

  const [vPrice, setVPrice] = useState(initialData?.sellingPrice ? String(initialData.sellingPrice) : "");
  const [vDeposit, setVDeposit] = useState(initialData?.depositAmount ? String(initialData.depositAmount) : "");
  const [vPayment, setVPayment] = useState(initialData?.paymentMethod || "Transferencia Bancaria");
  const [docDate, setDocDate] = useState(initialData?.date || "");
  const [docHour, setDocHour] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState(initialData?.invoiceNumber || "");

  // Sincronizar si cambia initialData al abrir
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setCName(initialData.clientName || "");
        setCDni(initialData.clientDni || "");
        setCAddress(initialData.clientAddress || "");
        setCPhone(initialData.clientPhone || "");
        setVBrand(initialData.brand || "");
        setVModel(initialData.model || "");
        setVPlate(initialData.plate || "");
        setVVin(initialData.vin || "");
        setVKm(initialData.mileage ? String(initialData.mileage) : "");
        setVYear(initialData.year ? String(initialData.year) : "");
        setVColor(initialData.color || "");
        setVFuel(initialData.fuelType || "");
        setVPrice(initialData.sellingPrice ? String(initialData.sellingPrice) : "");
        setVDeposit(initialData.depositAmount ? String(initialData.depositAmount) : "");
        setVPayment(initialData.paymentMethod || "Transferencia Bancaria");
        setDocDate(initialData.date || "");
        setInvoiceNumber(initialData.invoiceNumber || "");
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleClear = () => {
    setCName("");
    setCDni("");
    setCAddress("");
    setCPhone("");
    setVBrand("");
    setVModel("");
    setVPlate("");
    setVVin("");
    setVKm("");
    setVYear("");
    setVColor("");
    setVFuel("");
    setVPrice("");
    setVDeposit("");
    setVPayment("");
    setDocDate("");
    setDocHour("");
    setInvoiceNumber("");
  };

  // Helper para generar el contenido HTML imprimible exacto
  const getRenderableHtml = () => {
    const el = document.getElementById("autonomous-document-sheet");
    if (!el) return "";
    return el.innerHTML;
  };

  // Imprimir directo en PDF nativo
  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=900,height=1100");
    if (!printWindow) {
      alert("Por favor permite las ventanas emergentes en tu navegador para imprimir.");
      return;
    }

    const content = getRenderableHtml();

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="utf-8">
          <title>${title} — Orlando Cars</title>
          <style>
            @page { size: A4 portrait; margin: 12mm 15mm; }
            * { box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; 
              color: #0f172a; 
              margin: 0; 
              padding: 20px; 
              font-size: 12.5px; 
              line-height: 1.5; 
              background: #fff; 
            }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 16px; }
            .logo-text { font-size: 22px; font-weight: 900; letter-spacing: -0.5px; color: #0f172a; }
            .logo-text span { color: #0284c7; }
            .doc-title { font-size: 15px; font-weight: 800; text-transform: uppercase; color: #0f172a; margin-top: 3px; }
            .company-info { font-size: 10.5px; color: #475569; text-align: right; line-height: 1.35; }
            .section { margin-bottom: 14px; }
            .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0284c7; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px; margin-bottom: 8px; }
            .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 12px; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; }
            .info-label { color: #64748b; font-weight: 500; }
            .info-value { color: #0f172a; font-weight: 700; text-align: right; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px; }
            th { background: #f1f5f9; color: #334155; font-weight: 700; text-align: left; padding: 8px 10px; border-bottom: 1px solid #cbd5e1; font-size: 11px; text-transform: uppercase; }
            td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; color: #1e293b; }
            .total-box { margin-top: 14px; display: flex; justify-content: flex-end; }
            .total-card { width: 280px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 12px; }
            .rebu-notice { margin-top: 12px; padding: 8px 10px; background: #eff6ff; border-left: 3px solid #2563eb; font-size: 10px; color: #1e40af; line-height: 1.4; border-radius: 4px; }
            .clause-p { font-size: 11px; color: #334155; text-align: justify; margin-bottom: 8px; line-height: 1.45; }
            .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 35px; page-break-inside: avoid; }
            .signature-box { border-top: 1px solid #0f172a; padding-top: 6px; text-align: center; font-size: 10.5px; color: #475569; }
            .signature-box strong { display: block; font-size: 11px; color: #0f172a; margin-bottom: 2px; }
            .stamp-placeholder { height: 45px; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-style: italic; font-size: 10px; }
            .footer { margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 6px; font-size: 9px; color: #94a3b8; text-align: center; }
            
            /* En la impresión quitamos bordes de inputs para que quede limpio */
            input, textarea { border: none !important; background: transparent !important; font-family: inherit !important; font-size: inherit !important; font-weight: bold !important; color: #000 !important; padding: 0 !important; outline: none !important; }
            input::placeholder { color: #64748b !important; }
          </style>
        </head>
        <body>
          ${content}
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Descargar Word (.doc)
  const handleDownloadWord = () => {
    const content = getRenderableHtml();
    const wordHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 10.5pt; color: #111; line-height: 1.4; }
            .header { border-bottom: 2pt solid #0f172a; padding-bottom: 8pt; margin-bottom: 12pt; }
            .logo-text { font-size: 18pt; font-weight: bold; color: #0f172a; }
            .logo-text span { color: #0284c7; }
            .doc-title { font-size: 13pt; font-weight: bold; text-transform: uppercase; margin-top: 4pt; }
            .company-info { font-size: 9pt; color: #555; text-align: right; }
            .section-title { font-size: 10pt; font-weight: bold; text-transform: uppercase; color: #0284c7; border-bottom: 1pt solid #ccc; padding-bottom: 3pt; margin: 10pt 0 6pt 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 8pt; }
            th { background: #f2f2f2; border: 1pt solid #ccc; padding: 6pt; font-size: 9pt; }
            td { border: 1pt solid #ddd; padding: 6pt; font-size: 9pt; }
            .signatures { margin-top: 30pt; width: 100%; }
            .signature-box { border-top: 1pt solid #000; padding-top: 5pt; text-align: center; font-size: 9pt; width: 45%; display: inline-block; }
            input { border: none; font-weight: bold; }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `;

    const blob = new Blob([wordHtml], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${documentType.toUpperCase()}_ORLANDO_CARS.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[96vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Barra de control superior */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-slate-800 bg-slate-950/80">
          <div>
            <h2 className="text-sm font-bold text-white">
              {title}
            </h2>
            <p className="text-[11px] text-slate-400">
              Puedes hacer clic directamente en las líneas para rellenarlo, o dejarlo en blanco para imprimir y firmar a mano.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all active:scale-95"
              title="Borrar todo y dejar completamente en blanco"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Dejar en Blanco</span>
            </button>

            <button
              onClick={handleDownloadWord}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all active:scale-95"
              title="Descargar archivo en Word (.doc)"
            >
              <FileDown className="w-3.5 h-3.5 text-blue-400" />
              <span>Word (.doc)</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all active:scale-95"
              title="Imprimir o guardar en PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Folio A4 Interactivo Directamente Rellenable */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-8 bg-slate-950/60 flex justify-center">
          <div 
            id="autonomous-document-sheet"
            className="w-full max-w-[760px] bg-white text-slate-900 p-6 sm:p-12 rounded-xl shadow-2xl text-xs space-y-4"
          >
            {/* Header Orlando Cars */}
            <div className="header flex justify-between items-start border-b-2 border-slate-900 pb-3 mb-4">
              <div>
                <div className="logo-text text-xl font-black text-slate-900">
                  ORLANDO <span className="text-sky-600">CARS</span>
                </div>
                <div className="doc-title text-sm font-extrabold uppercase text-slate-900 mt-1">
                  {title}
                </div>
                {documentType === "factura" && (
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-600">Nº Factura:</span>
                    <input 
                      type="text" 
                      placeholder="FAC-2026-________"
                      value={invoiceNumber} 
                      onChange={(e) => setInvoiceNumber(e.target.value)} 
                      className="border-b border-dashed border-slate-400 font-bold text-blue-600 outline-none w-36 px-1"
                    />
                  </div>
                )}
              </div>
              <div className="company-info text-right text-[11px] text-slate-600 leading-tight">
                <strong>ORLANDO CARS S.L.</strong><br />
                NIF / CIF: B-88492019<br />
                Vía Complutense 128, 28805 Alcalá de Henares (Madrid)<br />
                Tel: +34 918 203 944 / +34 624 56 36 95<br />
                Email: administracion@orlandocars.es
              </div>
            </div>

            {/* DOCUMENTO 1: CONTRATO COMPRAVENTA VO */}
            {documentType === "contrato" && (
              <div className="space-y-4">
                <div className="section">
                  <div className="section-title text-[11px] font-bold uppercase text-sky-600 border-b border-slate-300 pb-1 mb-2">
                    REUNIDOS
                  </div>
                  <p className="clause-p text-justify text-slate-700 leading-relaxed mb-2">
                    <strong>DE UNA PARTE (PARTE VENDEDORA):</strong> La entidad mercantil <strong>ORLANDO CARS S.L.</strong>, provista de NIF nº <strong>B-88492019</strong>, con domicilio comercial y exposición en Vía Complutense 128, 28805 Alcalá de Henares (Madrid).
                  </p>
                  <p className="clause-p text-justify text-slate-700 leading-relaxed mb-2">
                    <strong>DE OTRA PARTE (PARTE COMPRADORA):</strong> D./Dña. {" "}
                    <input 
                      type="text" 
                      placeholder="________________________________________________" 
                      value={cName} 
                      onChange={(e) => setCName(e.target.value)} 
                      className="border-b border-dashed border-slate-400 font-bold text-slate-900 outline-none w-64 px-1"
                    />, mayor de edad, provisto de DNI/NIE nº {" "}
                    <input 
                      type="text" 
                      placeholder="____________________" 
                      value={cDni} 
                      onChange={(e) => setCDni(e.target.value)} 
                      className="border-b border-dashed border-slate-400 font-bold text-slate-900 outline-none w-32 px-1 font-mono"
                    />, con domicilio en {" "}
                    <input 
                      type="text" 
                      placeholder="________________________________________________" 
                      value={cAddress} 
                      onChange={(e) => setCAddress(e.target.value)} 
                      className="border-b border-dashed border-slate-400 font-bold text-slate-900 outline-none w-64 px-1"
                    /> y teléfono {" "}
                    <input 
                      type="text" 
                      placeholder="____________________" 
                      value={cPhone} 
                      onChange={(e) => setCPhone(e.target.value)} 
                      className="border-b border-dashed border-slate-400 font-bold text-slate-900 outline-none w-32 px-1"
                    />.
                  </p>
                </div>

                <div className="section">
                  <div className="section-title text-[11px] font-bold uppercase text-sky-600 border-b border-slate-300 pb-1 mb-2">
                    IDENTIFICACIÓN DEL VEHÍCULO OBJETO DE VENTA
                  </div>
                  <div className="info-box bg-slate-50 border border-slate-200 rounded-lg p-3 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500">Marca y Modelo:</span>{" "}
                      <input 
                        type="text" 
                        placeholder="________________________" 
                        value={vBrand ? `${vBrand} ${vModel}` : ""} 
                        onChange={(e) => setVBrand(e.target.value)} 
                        className="border-b border-dashed border-slate-400 font-bold text-slate-900 outline-none w-44 px-1"
                      />
                    </div>
                    <div>
                      <span className="text-slate-500">Matrícula:</span>{" "}
                      <input 
                        type="text" 
                        placeholder="____________________" 
                        value={vPlate} 
                        onChange={(e) => setVPlate(e.target.value)} 
                        className="border-b border-dashed border-slate-400 font-bold text-slate-900 outline-none w-36 px-1 font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-slate-500">Nº Bastidor (VIN):</span>{" "}
                      <input 
                        type="text" 
                        placeholder="________________________" 
                        value={vVin} 
                        onChange={(e) => setVVin(e.target.value)} 
                        className="border-b border-dashed border-slate-400 font-bold text-slate-900 outline-none w-44 px-1 font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <span className="text-slate-500">Kilometraje Actual:</span>{" "}
                      <input 
                        type="text" 
                        placeholder="__________ km" 
                        value={vKm} 
                        onChange={(e) => setVKm(e.target.value)} 
                        className="border-b border-dashed border-slate-400 font-bold text-slate-900 outline-none w-28 px-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="section">
                  <div className="section-title text-[11px] font-bold uppercase text-sky-600 border-b border-slate-300 pb-1 mb-2">
                    ESTIPULACIONES Y CLÁUSULAS
                  </div>
                  <p className="clause-p text-justify text-slate-700 leading-relaxed mb-2">
                    <strong>PRIMERA. - PRECIO Y PAGO:</strong> El precio total pactado de la compraventa es de {" "}
                    <input 
                      type="text" 
                      placeholder="____________________ €" 
                      value={vPrice} 
                      onChange={(e) => setVPrice(e.target.value)} 
                      className="border-b border-dashed border-slate-400 font-bold text-blue-600 outline-none w-32 px-1"
                    /> (IVA incluido bajo Régimen Especial REBU), abonado mediante {" "}
                    <input 
                      type="text" 
                      placeholder="transferencia bancaria / contado" 
                      value={vPayment} 
                      onChange={(e) => setVPayment(e.target.value)} 
                      className="border-b border-dashed border-slate-400 font-bold text-slate-900 outline-none w-48 px-1"
                    />.
                  </p>
                  <p className="clause-p text-justify text-slate-700 leading-relaxed mb-2">
                    <strong>SEGUNDA. - CARGAS:</strong> La parte vendedora declara bajo su responsabilidad que el vehículo está libre de cualquier carga, embargo, gravamen o reserva de dominio.
                  </p>
                  <p className="clause-p text-justify text-slate-700 leading-relaxed mb-2">
                    <strong>TERCERA. - GARANTÍA LEGAL 12 MESES:</strong> Conforme al RDL 1/2007 de Protección de Consumidores y Usuarios, se otorga una garantía legal obligatoria de 12 meses sobre los órganos mecánicos principales de motor y transmisión.
                  </p>
                  <p className="clause-p text-justify text-slate-700 leading-relaxed mb-2">
                    <strong>CUARTA. - TRÁFICO:</strong> El vendedor tramita el cambio de titularidad en la Jefatura Provincial de Tráfico mediante Gestoría Colegiada, entregando al comprador el justificante provisional DGT.
                  </p>
                </div>
              </div>
            )}

            {/* DOCUMENTO 2: RESERVA Y ARRAS */}
            {documentType === "reserva" && (
              <div className="space-y-4">
                <div className="info-box bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 text-xs">
                  <div className="text-[11px] font-bold text-sky-600 uppercase border-b border-slate-200 pb-1">
                    DATOS DEL INTERESADO / COMPRADOR
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500">Nombre del Cliente:</span>{" "}
                      <input 
                        type="text" 
                        placeholder="____________________________________" 
                        value={cName} 
                        onChange={(e) => setCName(e.target.value)} 
                        className="border-b border-dashed border-slate-400 font-bold text-slate-900 outline-none w-48 px-1"
                      />
                    </div>
                    <div>
                      <span className="text-slate-500">DNI / NIE:</span>{" "}
                      <input 
                        type="text" 
                        placeholder="____________________" 
                        value={cDni} 
                        onChange={(e) => setCDni(e.target.value)} 
                        className="border-b border-dashed border-slate-400 font-bold text-slate-900 outline-none w-36 px-1 font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-slate-500">Teléfono Móvil:</span>{" "}
                      <input 
                        type="text" 
                        placeholder="____________________" 
                        value={cPhone} 
                        onChange={(e) => setCPhone(e.target.value)} 
                        className="border-b border-dashed border-slate-400 font-bold text-slate-900 outline-none w-36 px-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="info-box bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 text-xs">
                  <div className="text-[11px] font-bold text-sky-600 uppercase border-b border-slate-200 pb-1">
                    VEHÍCULO RESERVADO
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500">Marca y Modelo:</span>{" "}
                      <input 
                        type="text" 
                        placeholder="________________________" 
                        value={vBrand ? `${vBrand} ${vModel}` : ""} 
                        onChange={(e) => setVBrand(e.target.value)} 
                        className="border-b border-dashed border-slate-400 font-bold text-slate-900 outline-none w-44 px-1"
                      />
                    </div>
                    <div>
                      <span className="text-slate-500">Matrícula:</span>{" "}
                      <input 
                        type="text" 
                        placeholder="____________________" 
                        value={vPlate} 
                        onChange={(e) => setVPlate(e.target.value)} 
                        className="border-b border-dashed border-slate-400 font-bold text-slate-900 outline-none w-36 px-1 font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-slate-500">Nº Bastidor (VIN):</span>{" "}
                      <input 
                        type="text" 
                        placeholder="________________________" 
                        value={vVin} 
                        onChange={(e) => setVVin(e.target.value)} 
                        className="border-b border-dashed border-slate-400 font-bold text-slate-900 outline-none w-44 px-1 font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <span className="text-slate-500">Precio Total Acordado:</span>{" "}
                      <input 
                        type="text" 
                        placeholder="____________________ €" 
                        value={vPrice} 
                        onChange={(e) => setVPrice(e.target.value)} 
                        className="border-b border-dashed border-slate-400 font-bold text-blue-600 outline-none w-32 px-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="section">
                  <div className="section-title text-[11px] font-bold uppercase text-sky-600 border-b border-slate-300 pb-1 mb-2">
                    CONDICIONES DE LA RESERVA (ARRAS PENITENCIALES - ART. 1454 CÓDIGO CIVIL)
                  </div>
                  <p className="clause-p text-justify text-slate-700 leading-relaxed mb-2">
                    1. El comprador entrega en concepto de <strong>SEÑAL Y RESERVA</strong> la cantidad de {" "}
                    <input 
                      type="text" 
                      placeholder="____________________ €" 
                      value={vDeposit} 
                      onChange={(e) => setVDeposit(e.target.value)} 
                      className="border-b border-dashed border-slate-400 font-bold text-emerald-600 outline-none w-32 px-1"
                    />, comprometiéndose Orlando Cars S.L. a retirar el vehículo de la venta y mantener la reserva por un plazo de <strong>15 días naturales</strong>.
                  </p>
                  <p className="clause-p text-justify text-slate-700 leading-relaxed mb-2">
                    2. La cantidad restante para completar el precio convenido será liquidada por el comprador en el acto de entrega física y firma del contrato definitivo.
                  </p>
                  <p className="clause-p text-justify text-slate-700 leading-relaxed mb-2">
                    3. Si el comprador desistiere de la compraventa perderá la señal entregada; si desistiere el vendedor devolverá duplicada dicha cantidad conforme al artículo 1454 del Código Civil español.
                  </p>
                </div>
              </div>
            )}

            {/* DOCUMENTO 3: FACTURA OFICIAL REBU */}
            {documentType === "factura" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="info-box bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1">
                    <div className="text-[11px] font-bold text-sky-600 uppercase border-b border-slate-200 pb-1">DATOS DEL COMPRADOR</div>
                    <div><span className="text-slate-500">Cliente:</span> <input type="text" placeholder="________________________" value={cName} onChange={(e) => setCName(e.target.value)} className="border-b border-dashed border-slate-400 font-bold outline-none w-44 px-1" /></div>
                    <div><span className="text-slate-500">DNI/CIF:</span> <input type="text" placeholder="____________________" value={cDni} onChange={(e) => setCDni(e.target.value)} className="border-b border-dashed border-slate-400 font-bold outline-none w-32 px-1 font-mono" /></div>
                    <div><span className="text-slate-500">Dirección:</span> <input type="text" placeholder="________________________" value={cAddress} onChange={(e) => setCAddress(e.target.value)} className="border-b border-dashed border-slate-400 font-bold outline-none w-44 px-1" /></div>
                  </div>
                  <div className="info-box bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1">
                    <div className="text-[11px] font-bold text-sky-600 uppercase border-b border-slate-200 pb-1">DATOS FISCALES</div>
                    <div><span className="text-slate-500">Fecha Emisión:</span> <input type="text" placeholder="Fecha hoy" value={docDate} onChange={(e) => setDocDate(e.target.value)} className="border-b border-dashed border-slate-400 font-bold outline-none w-32 px-1" /></div>
                    <div><span className="text-slate-500">Régimen:</span> <strong className="text-blue-600">REBU (Arts. 135-139 LIVA)</strong></div>
                    <div><span className="text-slate-500">Forma Pago:</span> <input type="text" placeholder="Transferencia" value={vPayment} onChange={(e) => setVPayment(e.target.value)} className="border-b border-dashed border-slate-400 font-bold outline-none w-32 px-1" /></div>
                  </div>
                </div>

                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="p-2 border border-slate-200">Concepto / Vehículo</th>
                      <th className="p-2 border border-slate-200">Matrícula</th>
                      <th className="p-2 border border-slate-200">Nº Bastidor</th>
                      <th className="p-2 border border-slate-200 text-right">Importe Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border border-slate-200">
                        <input type="text" placeholder="Marca y Modelo..." value={vBrand ? `${vBrand} ${vModel}` : ""} onChange={(e) => setVBrand(e.target.value)} className="font-bold outline-none w-full" />
                      </td>
                      <td className="p-2 border border-slate-200 font-mono font-bold">
                        <input type="text" placeholder="0000-XXX" value={vPlate} onChange={(e) => setVPlate(e.target.value)} className="font-bold outline-none w-24" />
                      </td>
                      <td className="p-2 border border-slate-200 font-mono text-[11px]">
                        <input type="text" placeholder="VIN..." value={vVin} onChange={(e) => setVVin(e.target.value)} className="font-bold outline-none w-36" />
                      </td>
                      <td className="p-2 border border-slate-200 text-right font-bold text-blue-600">
                        <input type="text" placeholder="0,00 €" value={vPrice} onChange={(e) => setVPrice(e.target.value)} className="font-bold text-right outline-none w-28" />
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="rebu-notice bg-blue-50 border-l-4 border-blue-600 p-2.5 text-[10.5px] text-blue-900 rounded">
                  <strong>MENCIÓN LEGAL OBLIGATORIA REBU:</strong> Operación sujeta al Régimen Especial de Bienes Usados (Artículos 135 a 139 de la Ley 37/1992 del IVA). IVA incluido en el precio. Conforme al Art. 138 de la Ley, la cuota no se desglosa en la factura emitida al cliente.
                </div>
              </div>
            )}

            {/* DOCUMENTO 4: ACTA DE ENTREGA */}
            {documentType === "entrega" && (
              <div className="space-y-4">
                <div className="info-box bg-slate-50 border border-slate-200 rounded-lg p-3 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Receptor (Cliente):</span>{" "}
                    <input type="text" placeholder="________________________" value={cName} onChange={(e) => setCName(e.target.value)} className="border-b border-dashed border-slate-400 font-bold outline-none w-44 px-1" />
                  </div>
                  <div>
                    <span className="text-slate-500">DNI/NIE:</span>{" "}
                    <input type="text" placeholder="____________________" value={cDni} onChange={(e) => setCDni(e.target.value)} className="border-b border-dashed border-slate-400 font-bold outline-none w-32 px-1 font-mono" />
                  </div>
                  <div>
                    <span className="text-slate-500">Vehículo:</span>{" "}
                    <input type="text" placeholder="________________________" value={vBrand ? `${vBrand} ${vModel}` : ""} onChange={(e) => setVBrand(e.target.value)} className="border-b border-dashed border-slate-400 font-bold outline-none w-44 px-1" />
                  </div>
                  <div>
                    <span className="text-slate-500">Matrícula:</span>{" "}
                    <input type="text" placeholder="____________________" value={vPlate} onChange={(e) => setVPlate(e.target.value)} className="border-b border-dashed border-slate-400 font-bold outline-none w-32 px-1 font-mono" />
                  </div>
                  <div>
                    <span className="text-slate-500">Km exactos en cuadro:</span>{" "}
                    <input type="text" placeholder="__________ km" value={vKm} onChange={(e) => setVKm(e.target.value)} className="border-b border-dashed border-slate-400 font-bold outline-none w-28 px-1" />
                  </div>
                  <div>
                    <span className="text-slate-500">Hora de Entrega:</span>{" "}
                    <input type="text" placeholder="_____ : _____ h" value={docHour} onChange={(e) => setDocHour(e.target.value)} className="border-b border-dashed border-slate-400 font-bold outline-none w-28 px-1" />
                  </div>
                </div>

                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="p-2 border border-slate-200">Elemento Inspeccionado</th>
                      <th className="p-2 border border-slate-200">Estado Verificado</th>
                      <th className="p-2 border border-slate-200 text-center">Conformidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="p-2 border border-slate-200">Juegos de Llaves Originales</td><td className="p-2 border border-slate-200">2 Llaves con mando a distancia</td><td className="p-2 border border-slate-200 text-center text-emerald-600 font-bold">[ X ] CONFORME</td></tr>
                    <tr><td className="p-2 border border-slate-200">Ficha Técnica e ITV</td><td className="p-2 border border-slate-200">Documento original en vigor</td><td className="p-2 border border-slate-200 text-center text-emerald-600 font-bold">[ X ] CONFORME</td></tr>
                    <tr><td className="p-2 border border-slate-200">Neumáticos y Ruedas</td><td className="p-2 border border-slate-200">Profundidad &gt; 3.5 mm legal</td><td className="p-2 border border-slate-200 text-center text-emerald-600 font-bold">[ X ] CONFORME</td></tr>
                    <tr><td className="p-2 border border-slate-200">Carrocería e Interiores</td><td className="p-2 border border-slate-200">Reacondicionado integral</td><td className="p-2 border border-slate-200 text-center text-emerald-600 font-bold">[ X ] CONFORME</td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* DOCUMENTOS 5, 6 y 7 (Garantía, Mandato DGT, Notificación DGT) */}
            {(documentType === "garantia" || documentType === "mandato_dgt" || documentType === "notificacion_dgt") && (
              <div className="space-y-4">
                <div className="info-box bg-slate-50 border border-slate-200 rounded-lg p-3 grid grid-cols-2 gap-3 text-xs">
                  <div><span className="text-slate-500">Titular / Mandante:</span> <input type="text" placeholder="________________________" value={cName} onChange={(e) => setCName(e.target.value)} className="border-b border-dashed border-slate-400 font-bold outline-none w-44 px-1" /></div>
                  <div><span className="text-slate-500">DNI / CIF:</span> <input type="text" placeholder="____________________" value={cDni} onChange={(e) => setCDni(e.target.value)} className="border-b border-dashed border-slate-400 font-bold outline-none w-32 px-1 font-mono" /></div>
                  <div><span className="text-slate-500">Vehículo:</span> <input type="text" placeholder="________________________" value={vBrand ? `${vBrand} ${vModel}` : ""} onChange={(e) => setVBrand(e.target.value)} className="border-b border-dashed border-slate-400 font-bold outline-none w-44 px-1" /></div>
                  <div><span className="text-slate-500">Matrícula:</span> <input type="text" placeholder="____________________" value={vPlate} onChange={(e) => setVPlate(e.target.value)} className="border-b border-dashed border-slate-400 font-bold outline-none w-32 px-1 font-mono" /></div>
                  <div><span className="text-slate-500">Nº Bastidor (VIN):</span> <input type="text" placeholder="________________________" value={vVin} onChange={(e) => setVVin(e.target.value)} className="border-b border-dashed border-slate-400 font-bold outline-none w-44 px-1 font-mono text-[11px]" /></div>
                </div>

                <div className="section text-justify text-slate-700 leading-relaxed text-xs">
                  {documentType === "garantia" && (
                    <p className="clause-p">
                      El presente certificado otorga <strong>12 meses de garantía mecánica</strong> amparando bloque de motor, culata, caja de cambios (manual/DSG), turbocompresor e inyección conforme a la Ley de Consumidores (RDL 1/2007).
                    </p>
                  )}
                  {documentType === "mandato_dgt" && (
                    <p className="clause-p">
                      El mandante apodera expresamente a <strong>Orlando Cars S.L.</strong> y a sus Gestores Administrativos Colegiados para tramitar telemáticamente el <strong>cambio de titularidad del vehículo</strong> ante la Jefatura Central de Tráfico (DGT).
                    </p>
                  )}
                  {documentType === "notificacion_dgt" && (
                    <p className="clause-p">
                      Por medio del presente, se notifica formalmente la transmisión del vehículo a la DGT para la exención de toda responsabilidad sancionadora o tributaria a partir de la entrega.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Firmas Oficiales */}
            <div className="signatures grid grid-cols-2 gap-8 pt-8 mt-6">
              <div className="signature-box border-t border-slate-900 pt-2 text-center text-[11px] text-slate-600">
                <strong className="block text-slate-900 font-bold mb-1">POR ORLANDO CARS S.L.</strong>
                <div className="stamp-placeholder h-12 flex items-center justify-center text-slate-400 italic text-[10px]">
                  Firma y Sello Oficial
                </div>
              </div>
              <div className="signature-box border-t border-slate-900 pt-2 text-center text-[11px] text-slate-600">
                <strong className="block text-slate-900 font-bold mb-1">EL CLIENTE / ADQUIRENTE</strong>
                <div className="stamp-placeholder h-12 flex items-center justify-center text-slate-400 italic text-[10px]">
                  Firma de Conformidad
                </div>
              </div>
            </div>

            <div className="footer text-center text-[9.5px] text-slate-400 pt-3 border-t border-slate-200">
              Documento expedido en Alcalá de Henares (Madrid) para Orlando Cars S.L.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
