import React, { useState, useEffect } from "react";
import { ShieldCheck, Wifi, Cpu, Terminal, RefreshCw, Radio } from "lucide-react";

export function HeaderOps({ onRefreshAll }: { onRefreshAll: () => void }) {
  const [time, setTime] = useState("");
  const [ping, setPing] = useState(24);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const jitter = setInterval(() => {
      setPing(Math.floor(20 + Math.random() * 8));
    }, 4000);
    return () => clearInterval(jitter);
  }, []);

  return (
    <header className="border-b border-cyber-800 bg-[#060a17]/90 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 select-none">
      
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#070c1b] rounded-[10px] flex items-center justify-center">
              <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#070c1b]" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono font-extrabold text-base tracking-wider text-white">
              ORLANDO<span className="text-cyan-400">.OPS</span>
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono font-bold">
              MULTI-BOT v2.4
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            Centro de Mando Personal de Shigeru • Paterna (Valencia)
          </p>
        </div>
      </div>

      {/* Real-time Telemetry Bar */}
      <div className="flex items-center flex-wrap gap-2 md:gap-3 text-xs">
        
        {/* LAN Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#091024] border border-cyber-800 text-slate-300">
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono">LAN Paterna:</span>
          <span className="font-mono font-bold text-emerald-400">{ping}ms</span>
        </div>

        {/* Engine Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#091024] border border-cyber-800 text-slate-300">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono">Bots Activos:</span>
          <span className="font-mono font-bold text-cyan-400">4/4 ONLINE</span>
        </div>

        {/* Live Clock */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#091024] border border-cyber-800 font-mono font-semibold text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-white">{time || "23:25:00"}</span>
        </div>

        {/* Sync Button */}
        <button
          onClick={onRefreshAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold font-mono transition-all active:scale-95"
          title="Sincronizar telemetría de todos los bots"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sincronizar</span>
        </button>

      </div>

    </header>
  );
}
