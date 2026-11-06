"use client";

import { useState, useEffect } from "react";
import {
  Bot,
  Sparkles,
  Send,
  Car,
  TrendingUp,
  Megaphone,
  Wrench,
  ShieldAlert,
  Play,
  RotateCw,
  Terminal,
  Activity,
  Zap,
  Layers,
  ChevronRight,
  Radio,
} from "lucide-react";
import { getStoredVehicles } from "@/lib/storage";

interface AgentStatus {
  id: string;
  name: string;
  callsign: string;
  role: string;
  status: "active" | "standby" | "executing";
  currentTask: string;
  progress: number;
  icon: any;
  color: string;
  glowColor: string;
  badge: string;
}

export default function AIAssistantPage() {
  const [viewMode, setViewMode] = useState<"war_room" | "chat">("war_room");
  const [selectedAgent, setSelectedAgent] = useState<string>("ventas");
  const [isCommanding, setIsCommanding] = useState(false);
  const [activeTelemetry, setActiveTelemetry] = useState<string>("Nexo Core v3.8 en línea. Monitoreando flota de Orlando Cars y Loewe Cars.");

  const [agents, setAgents] = useState<AgentStatus[]>([
    {
      id: "ventas",
      name: "Agente Ventas & Leads",
      callsign: "SALES-01",
      role: "Atención comercial, cálculo de cuotas y conversión de leads de Coches.net y WhatsApp",
      status: "active",
      currentTask: "Analizando solicitud de financiación Santander para Clase A (4821-LXZ)",
      progress: 88,
      icon: Car,
      color: "from-blue-600 to-cyan-500",
      glowColor: "rgba(59, 130, 246, 0.4)",
      badge: "4 Leads Activos",
    },
    {
      id: "compras",
      name: "Agente Tasación & Compras",
      callsign: "VALUATION-02",
      role: "Valoración de mercado VO, precios de subasta y cálculo de oferta máxima con margen asegurado",
      status: "executing",
      currentTask: "Calculando tasación máxima para BMW M2 Competition (Pide 53k€ -> Techo 47.5k€)",
      progress: 65,
      icon: TrendingUp,
      color: "from-emerald-600 to-teal-400",
      glowColor: "rgba(16, 185, 129, 0.4)",
      badge: "Margen Objetivo +4k€",
    },
    {
      id: "marketing",
      name: "Agente Portales & Redacción",
      callsign: "DISTRIB-03",
      role: "Generación de copys para Wallapop / Coches.net y detección de coches con rotación estancada (>30 días)",
      status: "active",
      currentTask: "Redactando titular de alto impacto para Porsche Macan GTS (Showroom Loewe Cars)",
      progress: 94,
      icon: Megaphone,
      color: "from-purple-600 to-pink-500",
      glowColor: "rgba(168, 85, 247, 0.4)",
      badge: "5 Portales Sincronizados",
    },
    {
      id: "taller",
      name: "Agente Taller & Margen REBU",
      callsign: "RECON-04",
      role: "Auditoría de costes de preparación, chapa/pintura, ITV y control de beneficio neto fiscal",
      status: "standby",
      currentTask: "Supervisando factura de chapa y pintura (420 €) vinculada al bastidor Mercedes",
      progress: 100,
      icon: Wrench,
      color: "from-amber-600 to-orange-400",
      glowColor: "rgba(245, 158, 11, 0.4)",
      badge: "REBU 100% Auditado",
    },
  ]);

  const [tacticalLog, setTacticalLog] = useState<string[]>([
    "[NEXO COMMANDER] Inicializando Sala de Control Táctica para Orlando Cars & Loewe Cars...",
    "[NEXO] Comprobación de integridad de flota: 6 vehículos cargados en base de datos reactiva.",
    "[SALES-01] Lead prioritario detectado: Carlos Mendoza solicita prueba de conducción.",
    "[VALUATION-02] Alerta de compra: Margen proyectado superior al 14.5% en subasta.",
    "[DISTRIB-03] Copilot listo para publicación en Wallapop, AutoScout24 y Coches.net.",
  ]);

  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "nexo",
      text: "Comandante Nexo en línea. Lidero la cuadrilla de 4 agentes especializados para Orlando Cars y Loewe Cars. ¿Qué acción ordenamos al equipo?",
    },
  ]);

  const handleDispatchCommand = (agentId: string) => {
    setIsCommanding(true);
    const targetAgent = agents.find((a) => a.id === agentId);
    const agentName = targetAgent ? targetAgent.name : "Equipo Completo";

    setTacticalLog((prev) => [
      `[ORDEN DE NEXO] -> Despachando misión prioritaria a: ${agentName}...`,
      ...prev,
    ]);

    setTimeout(() => {
      setIsCommanding(false);
      setTacticalLog((prev) => [
        `[${targetAgent?.callsign || "AGENTE"}] Misión ejecutada con éxito. Datos actualizados en el sistema de Orlando Cars.`,
        ...prev,
      ]);
    }, 1000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatHistory((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");

    setTimeout(() => {
      let response = "";
      if (userMsg.toLowerCase().includes("stock") || userMsg.toLowerCase().includes("coches")) {
        response = "NEXO REPORTE: El stock actual cuenta con unidades de alto margen como el Audi Q5 S-Line (ECO) y el Porsche Macan GTS. Ambos tienen margen superior al 13.5% REBU.";
      } else if (userMsg.toLowerCase().includes("orlando") || userMsg.toLowerCase().includes("loewe")) {
        response = "NEXO ESTRATEGIA: Para Orlando Cars mantenemos vehículos de alta rotación (compactos y familiares diésel/híbridos). En Loewe Cars posicionamos los modelos premium con Porsche Approved y acabado S-Line.";
      } else {
        response = `NEXO COMANDO: Instrucción recibida: "${userMsg}". Coordinando con el Agente de ${selectedAgent.toUpperCase()} para ejecutar los cálculos y actualizar el ERP.`;
      }
      setChatHistory((prev) => [...prev, { sender: "nexo", text: response }]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Sala de Mando Táctica — Nexo & Cuadrilla de Agentes
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </h1>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
              ORQUESTADOR ACTIVO
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Nexo como Jefe de Equipo coordinando agentes autónomos para Orlando Cars y Loewe Cars
          </p>
        </div>

        {/* View Switcher: 3D War Room vs. Interactive Chat */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 self-start md:self-auto text-xs">
          <button
            onClick={() => setViewMode("war_room")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              viewMode === "war_room"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Sala de Mando 3D</span>
          </button>
          <button
            onClick={() => setViewMode("chat")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              viewMode === "chat"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Chat con Nexo</span>
          </button>
        </div>
      </div>

      {viewMode === "war_room" ? (
        <div className="space-y-6">
          {/* 3D Holographic / Tactical Command Deck */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#060a12] via-[#091122] to-[#040811] border border-blue-900/40 p-6 shadow-2xl overflow-hidden min-h-[480px] flex flex-col justify-between">
            {/* Cybernetic Background Grid & Radar Pulse */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Top Deck Telemetry Bar */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                </span>
                <span className="font-mono text-cyan-400 font-bold">NEXO-CORE // COMMAND-DECK</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">Orlando Cars S.L. & Loewe Cars</span>
              </div>

              <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
                <span>AGENTES: <strong className="text-white">4 VIVOS</strong></span>
                <span>LATENCIA: <strong className="text-emerald-400">12ms</strong></span>
                <span>SINCRONIZACIÓN: <strong className="text-blue-400">CONTINUA</strong></span>
              </div>
            </div>

            {/* Central NEXO Holographic Commander Hub */}
            <div className="relative z-10 my-6 flex flex-col items-center justify-center text-center">
              {/* Glowing Nexo Core Avatar */}
              <div className="relative group cursor-pointer mb-3" onClick={() => handleDispatchCommand("all")}>
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition duration-500 animate-pulse"></div>
                <div className="relative h-24 w-24 rounded-full bg-slate-950 border-2 border-cyan-400 flex flex-col items-center justify-center shadow-2xl">
                  <Bot className="w-8 h-8 text-cyan-400 animate-bounce" />
                  <span className="text-[10px] font-black tracking-widest text-white mt-1">NEXO</span>
                  <span className="text-[8px] font-bold text-cyan-300">COMMANDER</span>
                </div>
              </div>

              <h2 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                Nexo — Jefe de Equipo Automotriz
              </h2>
              <p className="text-xs text-slate-400 max-w-lg mt-1">
                Comandando la operativa de tasación, publicación multi-portal, conversión de clientes y auditoría de costes para Orlando Cars.
              </p>

              {/* Master Dispatch CTA */}
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => handleDispatchCommand(selectedAgent)}
                  disabled={isCommanding}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  <Zap className="w-4 h-4 text-cyan-200" />
                  <span>{isCommanding ? "Despachando Órdenes..." : "Comandar Misión a la Cuadrilla"}</span>
                </button>
              </div>
            </div>

            {/* 3D Isometric Agent Cards Array around Nexo */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
              {agents.map((agent) => {
                const Icon = agent.icon;
                const isSelected = selectedAgent === agent.id;

                return (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent.id)}
                    className={`cursor-pointer rounded-2xl p-4 transition-all duration-300 relative overflow-hidden backdrop-blur-md flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? "bg-slate-900/90 border-2 border-cyan-400 shadow-xl shadow-cyan-500/20 scale-[1.02]"
                        : "bg-slate-950/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                    }`}
                  >
                    {/* Top Row: Icon + Status */}
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${agent.color} text-white shadow-md`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                        {agent.callsign}
                      </span>
                    </div>

                    {/* Agent Role & Name */}
                    <div>
                      <h3 className="text-xs font-bold text-white flex items-center justify-between">
                        <span>{agent.name}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>}
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{agent.role}</p>
                    </div>

                    {/* Current Autonomous Task */}
                    <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800/80 text-[10px] space-y-1.5">
                      <span className="text-slate-500 uppercase tracking-wider font-bold block text-[9px]">
                        Misión en curso:
                      </span>
                      <p className="text-slate-200 line-clamp-2 leading-relaxed">
                        {agent.currentTask}
                      </p>
                      {/* Progress bar */}
                      <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${agent.color}`}
                          style={{ width: `${agent.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Agent Footer Badge & Dispatch Button */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-cyan-300 font-semibold">{agent.badge}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDispatchCommand(agent.id);
                        }}
                        className="px-2 py-1 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white text-[10px] font-bold transition-colors"
                      >
                        Despachar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time Tactical Terminal Logs */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-mono">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="font-bold">CONSOLA OPERATIVA DE AGENTES // EN TIEMPO REAL</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">● STREAM ACTIVO</span>
            </div>

            <div className="p-4 font-mono text-[11px] space-y-1.5 max-h-48 overflow-y-auto">
              {tacticalLog.map((log, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 ${
                    log.includes("[ORDEN DE NEXO]")
                      ? "text-cyan-300 font-bold bg-cyan-950/20 p-1 rounded"
                      : log.includes("SALES")
                      ? "text-blue-300"
                      : log.includes("VALUATION")
                      ? "text-emerald-300"
                      : log.includes("DISTRIB")
                      ? "text-purple-300"
                      : "text-slate-400"
                  }`}
                >
                  <span className="text-slate-600 select-none">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Chat with Nexo View */
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-[560px]">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Nexo — Jefe de Equipo</h3>
                <p className="text-[10px] text-slate-400">Canal directo de instrucciones estratégicas para Orlando Cars</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-2.5 ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    msg.sender === "user" ? "bg-blue-600 text-white" : "bg-cyan-600/20 text-cyan-400"
                  }`}
                >
                  {msg.sender === "user" ? "Tú" : "N"}
                </div>
                <div
                  className={`p-3.5 rounded-2xl text-xs max-w-xl leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChat} className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ordena a Nexo analizar el stock, generar copys o evaluar una tasación..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-cyan-600 text-white hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-600/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
