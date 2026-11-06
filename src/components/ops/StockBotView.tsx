import React, { useState } from "react";
import { 
  Car, 
  Share2, 
  CheckCircle2, 
  Upload, 
  Sparkles, 
  FileSpreadsheet, 
  AlertCircle,
  Copy,
  Check,
  Globe
} from "lucide-react";
import { PendingIngestion } from "./types";

export function StockBotView({ 
  ingestions: initialList 
}: { 
  ingestions: PendingIngestion[];
}) {
  const [list, setList] = useState(initialList);
  const [plate, setPlate] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("2021");
  const [fuel, setFuel] = useState("Diésel (C)");
  const [generatedCopy, setGeneratedCopy] = useState("");
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleIngest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate || !brand || !model) return;

    setIsProcessing(true);
    setTimeout(() => {
      const newItem: PendingIngestion = {
        id: `ing-${Date.now()}`,
        plate: plate.toUpperCase(),
        brand,
        model,
        year: parseInt(year) || 2021,
        fuel,
        photosCount: 14,
        status: "ready",
        portals: ["Web Orlando", "Coches.net", "Wallapop", "Autocasión"]
      };

      setList(prev => [newItem, ...prev]);
      setPlate("");
      setBrand("");
      setModel("");
      setIsProcessing(false);

      // Also generate optimized portal copy
      setGeneratedCopy(`🚗 ${brand.toUpperCase()} ${model.toUpperCase()} (${year})
📍 Disponible en Orlando Cars (Paterna, Valencia)

💎 EQUIPAMIENTO DESTACADO:
• Motorización ${fuel} de máxima fiabilidad y mínimo consumo.
• Pantalla multimedia con navegador y conectividad smartphone.
• Sensores de aparcamiento y control de crucero.
• Historial de mantenimiento certificado en taller propio.

🛡️ CONDICIONES EXCLUSIVAS:
✅ 1 Año de Garantía Premium incluido en el precio.
✅ Revisión integral de 150 puntos en nuestras instalaciones.
✅ Financiación al 100% sin entrada en menos de 24 horas.

📲 Contacto directo WhatsApp: +34 658 803 533
🏢 Pol. Ind. Fuente del Jarro, Carrer de la Ciutat de Llíria 61, Paterna.`);
    }, 600);
  };

  const handleSyndicateAll = (id: string) => {
    setList(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: "syndicated" } : item
      )
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Col 1: Fast Intake Form & OCR Assistant */}
      <div className="bg-[#070c1b] border border-cyber-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-cyber-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-lg shadow-md">
            🚗
          </div>
          <div>
            <h3 className="font-mono font-bold text-sm text-white">Stock-Ingestor Bot</h3>
            <p className="text-[11px] text-slate-400">Entrada rápida y estructuración de datos para portales</p>
          </div>
        </div>

        <form onSubmit={handleIngest} className="space-y-3 font-mono text-xs">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Matrícula del Vehículo</label>
            <input
              type="text"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              placeholder="Ej: 4821-LXZ"
              className="w-full bg-[#091024] border border-cyber-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 uppercase font-bold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Marca</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ej: Seat"
                className="w-full bg-[#091024] border border-cyber-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                required
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Modelo / Motor</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Ej: León 2.0 TDI"
                className="w-full bg-[#091024] border border-cyber-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Año</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-[#091024] border border-cyber-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Combustible & Etiqueta</label>
              <select
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
                className="w-full bg-[#091024] border border-cyber-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Diésel (C)">Diésel (C)</option>
                <option value="Gasolina (C)">Gasolina (C)</option>
                <option value="Híbrido MHEV (ECO)">Híbrido MHEV (ECO)</option>
                <option value="PHEV Enchufable (0)">PHEV Enchufable (0)</option>
                <option value="100% Eléctrico (0)">100% Eléctrico (0)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all font-mono mt-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isProcessing ? "Procesando Ingesta..." : "Ingestar & Generar Ficha Portal"}</span>
          </button>
        </form>

        {/* Generated Copy Preview Box */}
        {generatedCopy && (
          <div className="p-3.5 rounded-xl bg-[#091024] border border-cyan-500/30 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold text-cyan-400">Texto Optimizado para Portales</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedCopy);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center gap-1 text-[10px] text-cyan-300 hover:text-white"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copiado" : "Copiar"}</span>
              </button>
            </div>
            <textarea
              readOnly
              value={generatedCopy}
              rows={6}
              className="w-full bg-[#050813] border border-cyber-800 rounded-lg p-2 text-[11px] text-slate-300 font-mono leading-relaxed resize-none focus:outline-none"
            />
          </div>
        )}

      </div>

      {/* Col 2 & 3: Syndication Matrix & Queue */}
      <div className="lg:col-span-2 bg-[#070c1b] border border-cyber-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
        <div className="space-y-4">
          
          <div className="flex items-center justify-between pb-3 border-b border-cyber-800">
            <div>
              <h3 className="font-mono font-bold text-sm text-white">Cola de Difusión Multi-Plataforma</h3>
              <p className="text-[11px] text-slate-400">Publicación sincronizada hacia web y portales de clasificados</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                Feed XML: Activo
              </span>
            </div>
          </div>

          {/* Table of Ingestions */}
          <div className="space-y-3">
            {list.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#091024] border border-cyber-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-white">{item.brand} {item.model}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-cyan-400 font-bold border border-slate-700">
                      {item.plate}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">({item.year})</span>
                  </div>

                  <div className="flex items-center flex-wrap gap-1.5 pt-1">
                    {item.portals.map((p, idx) => (
                      <span key={idx} className="text-[9px] px-2 py-0.5 rounded-full bg-[#0c152e] border border-cyber-800 text-slate-300 font-mono">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                      item.status === "syndicated"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : item.status === "ready"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}>
                      {item.status === "syndicated" ? "✓ Publicado en Portales" : item.status === "ready" ? "Listo para Difusión" : "Faltan Fotos Campa"}
                    </span>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">{item.photosCount} fotos validadas</p>
                  </div>

                  {item.status !== "syndicated" && (
                    <button
                      onClick={() => handleSyndicateAll(item.id)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs font-mono transition-all shadow-md active:scale-95 flex-shrink-0"
                    >
                      Publicar Ya 🚀
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer Feeds Info */}
        <div className="mt-6 p-3 rounded-xl bg-[#0c152e] border border-cyber-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Endpoint XML Stock Sincronizado:</span>
            <span className="text-cyan-400">/api/feeds/stock.xml</span>
          </div>
          <span className="text-slate-400">Actualizado cada 15 min</span>
        </div>

      </div>

    </div>
  );
}
