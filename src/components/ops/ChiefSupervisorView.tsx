import React, { useState } from "react";
import { 
  Bot, 
  Send, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  Copy, 
  Check, 
  Terminal,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { BotStatus } from "./types";

export function ChiefSupervisorView({ 
  bots,
  onDelegateAction 
}: { 
  bots: BotStatus[];
  onDelegateAction: (botId: string, command: string) => void;
}) {
  const [messages, setMessages] = useState<Array<{ sender: "user" | "chief"; text: string; time: string }>>([
    {
      sender: "chief",
      text: "👋 ¡Saludos, Shigeru! Soy Nexo-Chief, tu supervisor operativo. Los 4 agentes están sincronizados. Tienes 3 vehículos con fotos pendientes y la red de la campa está óptima a 22ms. ¿Qué orden deseas coordinar hoy?",
      time: "23:25"
    }
  ]);
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    const now = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    
    setMessages(prev => [...prev, { sender: "user", text: userMsg, time: now }]);
    setInput("");

    // Simulate intelligent Supervisor orchestration
    setTimeout(() => {
      let reply = "";
      const lower = userMsg.toLowerCase();

      if (lower.includes("post") || lower.includes("reel") || lower.includes("redes") || lower.includes("instagram")) {
        reply = "📱 [Orden a Social-Copilot]: Generando guion de Reel y copy de Instagram para stock destacado con llamada a WhatsApp. Ya lo tienes en la pestaña 'Redes Sociales'.";
        onDelegateAction("social", userMsg);
      } else if (lower.includes("red") || lower.includes("wifi") || lower.includes("ping") || lower.includes("impresora")) {
        reply = "📡 [Orden a Net-Sentinel]: Ejecutando traza de red en la LAN de Paterna. El Router Fibra (192.168.1.1) responde en 2ms y la impresora de contratos está lista.";
        onDelegateAction("network", userMsg);
      } else if (lower.includes("stock") || lower.includes("coche") || lower.includes("subir") || lower.includes("portal")) {
        reply = "🚗 [Orden a Stock-Ingestor]: Verificando fichas técnicas y disparando sincronización de Feeds XML para Coches.net y Wallapop.";
        onDelegateAction("stock", userMsg);
      } else {
        reply = `🫡 Recibido Shigeru. He registrado tu instrucción: "${userMsg}". Coordinando con los agentes y auditando ejecución.`;
      }

      setMessages(prev => [...prev, { sender: "chief", text: reply, time: now }]);
    }, 700);
  };

  const copyShiftReport = () => {
    const report = `📋 *INFORME DE TURNO & GESTIÓN TÉCNICA - ORLANDO CARS*
📅 Fecha: ${new Date().toLocaleDateString("es-ES")}
👤 Responsable Técnico: Shigeru

✅ *1. STOCK & PLATAFORMAS:*
- Sincronización automática de Feeds XML completada en Coches.net, Wallapop y Autocasión.
- 3 vehículos auditados con revisión de ITV y fotos de campa.

✅ *2. REDES SOCIALES & MARKETING:*
- Generados 2 guiones de Reels para Instagram / TikTok (Seat León DSG y Audi Q5 Loewe).
- Enlaces de contacto directo por WhatsApp (+34 658 803 533) verificados.

✅ *3. INFRAESTRUCTURA & RED (PATERNA):*
- Router Fibra Movistar y red interna: Latencia 2ms (Óptimo).
- Impresora de contratos y punto Wi-Fi de campa exterior operativos al 100%.

⚡ *Estado Global:* Operativa 100% estable sin incidencias.`;

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left 2 Cols: Supervisor Interactive Terminal */}
      <div className="lg:col-span-2 flex flex-col bg-[#070c1b] border border-cyber-800 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Terminal Header */}
        <div className="p-4 bg-[#091024] border-b border-cyber-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-lg shadow-md">
              👔
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono font-bold text-sm text-white">NEXO-CHIEF • Consola de Mando</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold border border-purple-500/30">
                  JEFE SUPERVISOR
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Orquesta y delega tareas a los otros 3 bots en tiempo real</p>
            </div>
          </div>

          <button
            onClick={copyShiftReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-semibold transition-all"
            title="Copiar informe de turno formateado para enviar por WhatsApp al jefe de Orlando Cars"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "¡Informe Copiado!" : "Copiar Informe Turno"}</span>
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 md:p-6 space-y-4 min-h-[380px] max-h-[460px] overflow-y-auto font-sans text-xs">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                m.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl ${
                  m.sender === "user"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-lg shadow-blue-900/30"
                    : "bg-[#0c152e] border border-cyber-800 text-slate-200 rounded-tl-none font-mono"
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                <span className="block mt-1.5 text-[10px] opacity-60 text-right">
                  {m.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Prompt Input */}
        <form onSubmit={handleSend} className="p-3 bg-[#091024] border-t border-cyber-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ordena al Supervisor (ej: 'Revisa el ping del router', 'Prepara un post para el Seat León')..."
            className="flex-1 bg-[#050813] border border-cyber-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono transition-all"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all font-mono"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Enviar</span>
          </button>
        </form>

      </div>

      {/* Right 1 Col: Bot Squad Status Grid */}
      <div className="space-y-4">
        
        <div className="p-4 rounded-2xl bg-[#070c1b] border border-cyber-800">
          <h4 className="font-mono font-bold text-xs text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Escuadrón Multi-Bot Activo</span>
          </h4>

          <div className="space-y-2.5">
            {bots.map((b) => (
              <div
                key={b.id}
                className="p-3 rounded-xl bg-[#091024] border border-cyber-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl">{b.avatar}</span>
                  <div className="min-w-0">
                    <p className="font-mono font-bold text-xs text-white truncate">{b.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{b.role}</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${b.badgeColor}`}>
                    {b.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">{b.accuracyRate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Delegation Direct Action Buttons */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-[#070c1b] to-purple-950/40 border border-purple-900/40 space-y-2.5">
          <p className="text-xs font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Acciones Rápidas del Supervisor</span>
          </p>

          <button
            onClick={() => onDelegateAction("stock", "Sincronizar feeds XML de stock con Coches.net y Wallapop")}
            className="w-full text-left p-2.5 rounded-xl bg-[#091024] hover:bg-[#0e172f] border border-cyber-800 text-[11px] text-slate-300 flex items-center justify-between transition-colors font-mono"
          >
            <span>🔄 Forzar Sync Feeds XML Stock</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>

          <button
            onClick={() => onDelegateAction("social", "Generar Reel de Instagram para coche con mayor stock parado")}
            className="w-full text-left p-2.5 rounded-xl bg-[#091024] hover:bg-[#0e172f] border border-cyber-800 text-[11px] text-slate-300 flex items-center justify-between transition-colors font-mono"
          >
            <span>📱 Crear Reel de Coche Parado</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>

          <button
            onClick={() => onDelegateAction("network", "Escanear latencia del router y Wi-Fi de campa exterior")}
            className="w-full text-left p-2.5 rounded-xl bg-[#091024] hover:bg-[#0e172f] border border-cyber-800 text-[11px] text-slate-300 flex items-center justify-between transition-colors font-mono"
          >
            <span>📡 Test de Cobertura Wi-Fi Campa</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>

      </div>

    </div>
  );
}
