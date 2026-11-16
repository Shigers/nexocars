"use client";

import { useState, useRef } from "react";
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle,
  AlertTriangle,
  Car,
  FileText,
  Building2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Vehicle } from "@/types";
import { parseVehiclesCSV, generateCSVTemplate, CSVParseResult } from "@/lib/csv-parser";
import { bulkImportVehicles } from "@/lib/storage";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (count: number) => void;
}

export function CSVImportModal({ isOpen, onClose, onSuccess }: CSVImportModalProps) {
  const [targetCompany, setTargetCompany] = useState<"comp-orlando" | "comp-loewe">("comp-orlando");
  const [activeTab, setActiveTab] = useState<"file" | "paste">("file");
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rawText, setRawText] = useState("");
  const [parseResult, setParseResult] = useState<CSVParseResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setRawText(content);
        const result = parseVehiclesCSV(content, targetCompany);
        setParseResult(result);
      }
    };
    reader.readAsText(file, "UTF-8");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleTextChange = (text: string) => {
    setRawText(text);
    if (text.trim().length > 10) {
      const result = parseVehiclesCSV(text, targetCompany);
      setParseResult(result);
    } else {
      setParseResult(null);
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = generateCSVTemplate();
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Plantilla_Stock_NexoCar.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmImport = () => {
    if (!parseResult || parseResult.vehicles.length === 0) return;

    setIsProcessing(true);
    // Apply selected target company if not overridden in CSV
    const finalVehicles = parseResult.vehicles.map((v) => ({
      ...v,
      company_id: v.company_id || targetCompany,
      location:
        (v.company_id || targetCompany) === "comp-loewe"
          ? "Showroom Exclusivo Loewe Cars"
          : "Exposición Paterna - Orlando Cars",
    }));

    bulkImportVehicles(finalVehicles);
    setIsProcessing(false);
    onSuccess(finalVehicles.length);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 space-y-5 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Migración & Carga Masiva de Vehículos</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                  CSV • WordPress • Excel
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Sube tu inventario procedente de WordPress (WP All Import / Motors), Excel o tu CRM anterior
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Company Destination & Template Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-300 font-medium">Asignar sede:</span>
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setTargetCompany("comp-orlando")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  targetCompany === "comp-orlando"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Orlando Cars
              </button>
              <button
                type="button"
                onClick={() => setTargetCompany("comp-loewe")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  targetCompany === "comp-loewe"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Loewe Cars
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold hover:border-slate-600 transition-all"
            title="Descargar plantilla CSV con el formato recomendado"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Descargar Plantilla CSV</span>
          </button>
        </div>

        {/* Tabs: Subir Archivo vs Pegar Texto */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("file")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "file"
                ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Arrastrar / Seleccionar Archivo (.CSV)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("paste")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "paste"
                ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Copiar y Pegar Texto de Excel
          </button>
        </div>

        {/* Tab 1: Drag & Drop File Zone */}
        {activeTab === "file" && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`rounded-3xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
              dragOver
                ? "border-purple-500 bg-purple-500/10"
                : "border-slate-800 hover:border-slate-700 bg-slate-950/60"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv,.txt,.tsv"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileProcess(e.target.files[0]);
                }
              }}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mx-auto flex items-center justify-center mb-3">
              <UploadCloud className="w-7 h-7" />
            </div>
            {fileName ? (
              <div className="space-y-1">
                <p className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>{fileName}</span>
                </p>
                <p className="text-xs text-slate-400">
                  Haz clic o arrastra otro archivo para reemplazarlo
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">
                  Arrastra tu archivo CSV aquí, o <span className="text-purple-400 underline">haz clic para examinar</span>
                </p>
                <p className="text-xs text-slate-500">
                  Admite archivos exportados de WordPress, Excel, Google Sheets, Coches.net (separados por comas o punto y coma)
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Paste Raw Text Zone */}
        {activeTab === "paste" && (
          <div className="space-y-2">
            <textarea
              rows={5}
              value={rawText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Pega aquí las filas de tu Excel o CSV con cabeceras:&#10;Marca;Modelo;Version;Matricula;Ano;Kilometros;PVP_Venta&#10;Mercedes-Benz;Clase A;200d AMG;4821-LXZ;2022;48500;29900&#10;Porsche;Macan;GTS 440CV;3302-MMT;2023;21500;89900"
              className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
            />
          </div>
        )}

        {/* Preview of Parsed Vehicles */}
        {parseResult && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">
                  Vista Previa: {parseResult.validRows} vehículos listos para importar
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30">
                  100% Detectados
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Se guardarán en:{" "}
                <strong className={targetCompany === "comp-loewe" ? "text-amber-400" : "text-blue-400"}>
                  {targetCompany === "comp-loewe" ? "Loewe Cars" : "Orlando Cars"}
                </strong>
              </span>
            </div>

            {/* Mini preview table */}
            <div className="max-h-52 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-[11px] text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 sticky top-0">
                  <tr>
                    <th className="py-2 px-3">Vehículo</th>
                    <th className="py-2 px-3">Matrícula</th>
                    <th className="py-2 px-3">Año / Km</th>
                    <th className="py-2 px-3">Combustible</th>
                    <th className="py-2 px-3">PVP Venta</th>
                    <th className="py-2 px-3">Coste</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {parseResult.vehicles.slice(0, 10).map((v, i) => (
                    <tr key={i} className="hover:bg-slate-900/40">
                      <td className="py-2 px-3 font-sans font-semibold text-white">
                        {v.brand} {v.model} <span className="text-slate-400 font-normal">{v.version}</span>
                      </td>
                      <td className="py-2 px-3 text-cyan-300">{v.plate}</td>
                      <td className="py-2 px-3">
                        {v.year} • {formatNumber(v.mileage)} km
                      </td>
                      <td className="py-2 px-3 capitalize">{v.fuel_type}</td>
                      <td className="py-2 px-3 font-bold text-emerald-400">
                        {formatCurrency(v.selling_price)}
                      </td>
                      <td className="py-2 px-3 text-slate-400">{formatCurrency(v.total_cost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parseResult.vehicles.length > 10 && (
                <div className="py-2 px-3 text-center text-xs text-slate-500 border-t border-slate-800 bg-slate-900/50">
                  ... y {parseResult.vehicles.length - 10} vehículos más en el archivo.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={!parseResult || parseResult.validRows === 0 || isProcessing}
            onClick={handleConfirmImport}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg ${
              !parseResult || parseResult.validRows === 0 || isProcessing
                ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-purple-600/25"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isProcessing
                ? "Importando..."
                : parseResult
                ? `Confirmar e Importar ${parseResult.validRows} Vehículos`
                : "Selecciona un archivo CSV"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
