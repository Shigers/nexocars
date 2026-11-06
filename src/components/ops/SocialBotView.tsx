import React, { useState } from "react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Instagram, 
  Video, 
  Share2, 
  Flame, 
  MessageCircle,
  Hash,
  Send
} from "lucide-react";
import { SocialDraft } from "./types";

export function SocialBotView({ drafts: initialDrafts }: { drafts: SocialDraft[] }) {
  const [drafts, setDrafts] = useState(initialDrafts);
  const [vehicle, setVehicle] = useState("Peugeot Expert Larga BlueHDi 120CV (2020)");
  const [division, setDivision] = useState<"orlando" | "loewe">("orlando");
  const [platform, setPlatform] = useState<"instagram" | "tiktok" | "facebook">("instagram");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    let newDraft: SocialDraft;

    if (division === "loewe") {
      newDraft = {
        id: `soc-${Date.now()}`,
        vehicle,
        platform,
        type: "reel",
        hook: `¿Buscas distinción absoluta y entrega inmediata? Conoce esta joya que acaba de entrar en Loewe Cars ✨`,
        body: `TOMA 1: Acercamiento cinematográfico a la parrilla frontal y faros dinámicos.\nTOMA 2: Detalle de las llantas deportivas y pinzas de freno.\nTOMA 3: Apertura de puerta mostrando la tapicería de cuero y costuras artesanales.\nTOMA 4: Vista de pantalla central y volante multifunción.\n\n💎 Estado rigurosamente certificado.\n🛡️ Garantía Premium Loewe con cobertura nacional.\n📍 Disponible en nuestra división exclusiva de Paterna (Valencia).`,
        hashtags: ["#LoeweCars", "#LuxuryCarsValencia", "#CochesDeLujo", "#Exclusividad", "#Paterna", "#SupercarsValencia"],
        cta: `Concierte su cita privada con nuestro asesor VIP al +34 658 803 533 o visite nuestro showroom en Carrer de la Ciutat de Llíria 61.`,
        status: "approved",
        division: "loewe"
      };
    } else {
      newDraft = {
        id: `soc-${Date.now()}`,
        vehicle,
        platform,
        type: "reel",
        hook: `¡Oportunidad de la semana en Orlando Cars! Furgoneta/Coche impecable y listo para trabajar o viajar 🚀`,
        body: `🔥 ¿Por qué esta unidad es una auténtica ganga?\n• Historial de revisiones sellado y certificado.\n• Muy bajo consumo y gran capacidad de carga/pasajeros.\n• Revisión exhaustiva de 150 puntos en nuestro taller propio.\n• Financiación desde 190€ al mes sin entrada.\n\n¡No durará muchos días en la campa!`,
        hashtags: ["#OrlandoCars", "#ValenciaFurgonetas", "#CochesOcasión", "#Paterna", "#CocheBarato", "#VehículosComerciales"],
        cta: `Escríbenos directamente por WhatsApp al 658 803 533 para reservar prueba o calcular tu cuota al instante.`,
        status: "approved",
        division: "orlando"
      };
    }

    setDrafts(prev => [newDraft, ...prev]);
  };

  const copyToClipboard = (d: SocialDraft) => {
    const fullText = `🎬 GUION / COPY PARA ${d.platform.toUpperCase()} (${d.type.toUpperCase()})

🎯 GANCHO / HOOK (0 a 3 seg):
${d.hook}

📝 DESCRIPCIÓN / ESCENAS:
${d.body}

📲 LLAMADA A LA ACCIÓN (CTA):
${d.cta}

🏷️ HASHTAGS:
${d.hashtags.join(" ")}`;

    navigator.clipboard.writeText(fullText);
    setCopiedId(d.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Col 1: Social Content Generator Control */}
      <div className="bg-[#070c1b] border border-cyber-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-cyber-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-600 flex items-center justify-center text-lg shadow-md">
            📱
          </div>
          <div>
            <h3 className="font-mono font-bold text-sm text-white">Social-Copilot Bot</h3>
            <p className="text-[11px] text-slate-400">Generador de Reels, Guiones y Copys para Redes</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-3 font-mono text-xs">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Vehículo Objetivo</label>
            <input
              type="text"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              className="w-full bg-[#091024] border border-cyber-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-pink-500 font-bold"
              required
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">División Comercial & Tono</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDivision("orlando")}
                className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                  division === "orlando"
                    ? "bg-blue-600/20 border-blue-500 text-blue-300"
                    : "bg-[#091024] border-cyber-800 text-slate-400"
                }`}
              >
                Orlando Cars (Ocasión)
              </button>
              <button
                type="button"
                onClick={() => setDivision("loewe")}
                className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                  division === "loewe"
                    ? "bg-amber-600/20 border-amber-500 text-amber-300"
                    : "bg-[#091024] border-cyber-800 text-slate-400"
                }`}
              >
                Loewe Cars (Lujo)
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Plataforma</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPlatform("instagram")}
                className={`py-2 rounded-xl border text-center font-bold transition-all ${
                  platform === "instagram"
                    ? "bg-pink-600/20 border-pink-500 text-pink-300"
                    : "bg-[#091024] border-cyber-800 text-slate-400"
                }`}
              >
                Instagram
              </button>
              <button
                type="button"
                onClick={() => setPlatform("tiktok")}
                className={`py-2 rounded-xl border text-center font-bold transition-all ${
                  platform === "tiktok"
                    ? "bg-cyan-600/20 border-cyan-500 text-cyan-300"
                    : "bg-[#091024] border-cyber-800 text-slate-400"
                }`}
              >
                TikTok
              </button>
              <button
                type="button"
                onClick={() => setPlatform("facebook")}
                className={`py-2 rounded-xl border text-center font-bold transition-all ${
                  platform === "facebook"
                    ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                    : "bg-[#091024] border-cyber-800 text-slate-400"
                }`}
              >
                Facebook
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:opacity-90 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-pink-500/20 transition-all font-mono mt-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generar Guion & Copy Viral</span>
          </button>
        </form>

        <div className="p-3.5 rounded-xl bg-[#091024] border border-cyber-800 text-slate-400 text-xs font-mono space-y-1.5">
          <p className="text-white font-bold flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Estrategia de Conversión:</span>
          </p>
          <p className="text-[11px] leading-relaxed">
            Cada guion incluye llamada imperativa al WhatsApp de Orlando Cars con número directo para cerrar pruebas dinámicas en menos de 10 minutos.
          </p>
        </div>

      </div>

      {/* Col 2 & 3: Feed of Generated Reels & Posts */}
      <div className="lg:col-span-2 space-y-4">
        
        <div className="p-4 bg-[#070c1b] border border-cyber-800 rounded-2xl flex items-center justify-between">
          <div>
            <h3 className="font-mono font-bold text-sm text-white">Guiones & Copys Listos para Publicar</h3>
            <p className="text-[11px] text-slate-400">Copia y pega directamente en Instagram Reels, TikTok o Facebook</p>
          </div>
          <span className="text-xs font-mono text-pink-400 font-bold bg-pink-500/10 px-2.5 py-1 rounded-full border border-pink-500/30">
            {drafts.length} Generados
          </span>
        </div>

        <div className="space-y-4">
          {drafts.map((d) => (
            <div
              key={d.id}
              className="p-5 rounded-2xl bg-[#070c1b] border border-cyber-800 hover:border-pink-500/40 transition-all space-y-3"
            >
              {/* Header Card */}
              <div className="flex items-center justify-between pb-2 border-b border-cyber-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-white">{d.vehicle}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                    d.division === "loewe"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  }`}>
                    {d.division}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">({d.platform})</span>
                </div>

                <button
                  onClick={() => copyToClipboard(d)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 text-xs font-mono font-semibold transition-all"
                >
                  {copiedId === d.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === d.id ? "¡Copiado!" : "Copiar Todo"}</span>
                </button>
              </div>

              {/* Hook Box */}
              <div className="p-3 rounded-xl bg-[#091024] border border-cyber-800">
                <span className="text-[10px] font-mono text-amber-400 font-bold block mb-1">
                  🎯 GANCHO DE PRIMEROS 3 SEGUNDOS:
                </span>
                <p className="text-xs text-white font-medium italic">"{d.hook}"</p>
              </div>

              {/* Body */}
              <div className="text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-wrap bg-[#050813] p-3 rounded-xl border border-cyber-800 font-mono">
                {d.body}
              </div>

              {/* CTA & Hashtags */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-cyber-800 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="text-[11px] truncate max-w-sm">{d.cta}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 flex-wrap">
                  {d.hashtags.slice(0, 4).map((h, idx) => (
                    <span key={idx} className="hover:text-pink-400 transition-colors">{h}</span>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
