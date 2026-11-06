import React, { useState } from "react";
import { BotStatus } from "./types";
import { Terminal, Send, Sparkles, CheckCircle2, Play, Trash2, Cpu } from "lucide-react";

export function CustomBotView({
  bot,
  onDeleteBot,
}: {
  bot: BotStatus;
  onDeleteBot?: (botId: string) => void;
}) {
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString("es-ES")}] Agente ${bot.name} inicializado con éxito.`,
    `[Instrucciones]: ${bot.promptInstructions || bot.role}`,
    `[Estado]: En espera de tareas operativas para Orlando Cars.`
  ]);
  const [command, setCommand] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRunTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const cmd = command.trim();
    setCommand("");
    setIsProcessing(true);

    const now = new Date().toLocaleTimeString("es-ES");
    setLogs((prev) => [
      `[${now}] ➔ Orden recibida: "${cmd}"`,
      ...prev,
    ]);

    setTimeout(() => {
      setLogs((prev) => [
        `[${new Date().toLocaleTimeString("es-ES")}] ✅ Tarea completada por ${bot.name}: Se ha procesado correctamente conforme a las directrices de Orlando Cars.`,
        ...prev,
      ]);
      setIsProcessing(false);
    }, 900);
  };

  return (
    <div className="bg-[#070c1b] border border-cyber-800 rounded-2xl p-6 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-cyber-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0e172f] border border-cyber-800 flex items-center justify-center text-2xl shadow-lg">
            {bot.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-mono font-bold text-base text-white">{bot.name}</h2>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${bot.badgeColor}`}>
                {bot.status}
              </span>
              {bot.isCustom && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono border border-blue-500/20">
                  Bot Anexado
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{bot.tagline}</p>
          </div>
        </div>

        {bot.isCustom && onDeleteBot && (
          <button
            onClick={() => onDeleteBot(bot.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono transition-all self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Eliminar Bot</span>
          </button>
        )}
      </div>

      {/* Role / Instructions */}
      <div className="p-4 rounded-xl bg-[#091024] border border-cyber-800 font-mono text-xs space-y-1.5">
        <span className="text-cyan-400 font-bold block text-[11px]">🎯 FUNCIÓN OPERATIVA:</span>
        <p className="text-slate-300 leading-relaxed">{bot.promptInstructions || bot.role}</p>
      </div>

      {/* Command Dispatcher */}
      <form onSubmit={handleRunTask} className="space-y-2">
        <label className="text-xs font-mono text-slate-300 block">
          Enviar Orden o Tarea a <span className="text-cyan-400 font-bold">{bot.name}</span>:
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder={`Ej: 'Generar reporte de gastos', 'Auditar contratos de venta', 'Revisar ITV'...`}
            className="flex-1 bg-[#091024] border border-cyber-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
          />
          <button
            type="submit"
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all font-mono"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isProcessing ? "Ejecutando..." : "Ejecutar"}</span>
          </button>
        </div>
      </form>

      {/* Execution Console Logs */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Terminal de Actividad en Tiempo Real:</span>
        </div>
        <div className="p-4 rounded-xl bg-[#040711] border border-cyber-800 font-mono text-xs text-slate-300 space-y-2 max-h-60 overflow-y-auto">
          {logs.map((log, idx) => (
            <p key={idx} className="leading-relaxed">
              {log}
            </p>
          ))}
        </div>
      </div>

    </div>
  );
}
