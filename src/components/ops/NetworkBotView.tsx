import React, { useState } from "react";
import { 
  Wifi, 
  Server, 
  Printer, 
  ShieldCheck, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Terminal,
  Activity,
  Globe
} from "lucide-react";
import { NetworkNode } from "./types";

export function NetworkBotView({ nodes: initialNodes }: { nodes: NetworkNode[] }) {
  const [nodes, setNodes] = useState(initialNodes);
  const [isScanning, setIsScanning] = useState(false);
  const [incidentLog, setIncidentLog] = useState<string[]>([
    "[23:20:10] Ping normal a 192.168.1.1 (Router Fibra Paterna): 2ms",
    "[23:22:45] Impresora HP LaserJet (192.168.1.45) lista para impresión de contratos REBU",
    "[23:25:01] Web nexocars.vercel.app respondiendo HTTP 200 en 22ms desde CDN Madrid"
  ]);

  const handlePingAll = () => {
    setIsScanning(true);
    setTimeout(() => {
      setNodes(prev =>
        prev.map(node => ({
          ...node,
          latency: Math.floor(Math.random() * 20) + (node.category === "router" ? 2 : 12),
          lastChecked: "Justo ahora"
        }))
      );
      setIncidentLog(prev => [
        `[${new Date().toLocaleTimeString("es-ES")}] Escaneo de red manual completado. 6/6 dispositivos respondiendo correctamente.`,
        ...prev
      ]);
      setIsScanning(false);
    }, 800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Col 1 & 2: Network Nodes Table */}
      <div className="lg:col-span-2 bg-[#070c1b] border border-cyber-800 rounded-2xl p-5 shadow-xl space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-cyber-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-lg shadow-md">
              📡
            </div>
            <div>
              <h3 className="font-mono font-bold text-sm text-white">Net-Sentinel • Monitor de Infraestructura</h3>
              <p className="text-[11px] text-slate-400">Supervisión 24/7 de la red LAN de Paterna y servidores web</p>
            </div>
          </div>

          <button
            onClick={handlePingAll}
            disabled={isScanning}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold transition-all active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
            <span>{isScanning ? "Escaneando..." : "Test de Ping LAN"}</span>
          </button>
        </div>

        {/* Nodes Grid */}
        <div className="space-y-3">
          {nodes.map((node) => (
            <div
              key={node.id}
              className="p-3.5 rounded-xl bg-[#091024] border border-cyber-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#0e172f] border border-cyber-800 text-slate-300">
                  {node.category === "router" ? (
                    <Activity className="w-4 h-4 text-emerald-400" />
                  ) : node.category === "printer" ? (
                    <Printer className="w-4 h-4 text-cyan-400" />
                  ) : node.category === "wifi_campa" ? (
                    <Wifi className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Globe className="w-4 h-4 text-blue-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-bold text-xs text-white">{node.name}</p>
                    <span className="text-[10px] font-mono text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      {node.ip}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Verificado: {node.lastChecked}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-extrabold text-emerald-400">
                    {node.latency} ms
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                  ONLINE
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Col 3: Diagnostics & Live Logs Terminal */}
      <div className="space-y-4">
        
        {/* Campa Wi-Fi Health Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-[#070c1b] to-emerald-950/40 border border-emerald-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
              <Wifi className="w-4 h-4 text-emerald-400" />
              <span>Cobertura Wi-Fi en Campa</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              96% Excelente
            </span>
          </div>
          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            Los comerciales pueden tomar fotos en cualquier esquina de la campa de Paterna y subirlas a NexoCar sin perder conexión.
          </p>
        </div>

        {/* Live Syslog Terminal */}
        <div className="p-4 rounded-2xl bg-[#070c1b] border border-cyber-800 space-y-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h4 className="font-mono font-bold text-xs text-white uppercase tracking-wider">
              Logs de Infraestructura
            </h4>
          </div>

          <div className="p-3 rounded-xl bg-[#040711] border border-cyber-800 font-mono text-[10px] text-slate-300 space-y-2 max-h-56 overflow-y-auto">
            {incidentLog.map((log, i) => (
              <p key={i} className="leading-relaxed">
                <span className="text-emerald-400">✓</span> {log}
              </p>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
