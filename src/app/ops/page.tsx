"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HeaderOps } from "@/components/ops/HeaderOps";
import { ChiefSupervisorView } from "@/components/ops/ChiefSupervisorView";
import { StockBotView } from "@/components/ops/StockBotView";
import { SocialBotView } from "@/components/ops/SocialBotView";
import { NetworkBotView } from "@/components/ops/NetworkBotView";
import { CustomBotView } from "@/components/ops/CustomBotView";
import { DirectivesAndTasksView } from "@/components/ops/DirectivesAndTasksView";
import { 
  INITIAL_BOTS, 
  INITIAL_NODES, 
  INITIAL_DRAFTS, 
  INITIAL_INGESTIONS 
} from "@/components/ops/mock-ops";
import { BotStatus } from "@/components/ops/types";
import { Plus, X, Sparkles, ExternalLink, Bot, ArrowLeft } from "lucide-react";

const OPS_BOTS_STORAGE_KEY = "orlando_ops_bots_cloud_v1";

export default function OpsCommandPage() {
  const [bots, setBots] = useState<BotStatus[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(OPS_BOTS_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_BOTS;
  });

  const [activeTab, setActiveTab] = useState<string>("chief");
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [drafts, setDrafts] = useState(INITIAL_DRAFTS);
  const [ingestions, setIngestions] = useState(INITIAL_INGESTIONS);

  // Add Bot Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [newBotName, setNewBotName] = useState("");
  const [newBotTagline, setNewBotTagline] = useState("");
  const [newBotRole, setNewBotRole] = useState("");
  const [newBotAvatar, setNewBotAvatar] = useState("⚡");
  const [newBotInstructions, setNewBotInstructions] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(OPS_BOTS_STORAGE_KEY, JSON.stringify(bots));
    }
  }, [bots]);

  const handleRefreshAll = () => {
    setBots(prev =>
      prev.map(b => ({
        ...b,
        completedTasks: b.completedTasks + Math.floor(Math.random() * 3) + 1,
        lastAction: "Telemetría sincronizada con éxito"
      }))
    );
  };

  const handleDelegateAction = (botId: string, _command: string) => {
    setActiveTab(botId);
  };

  const handleCreateBot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBotName.trim()) return;

    const id = `bot-${Date.now()}`;
    const newBot: BotStatus = {
      id,
      name: newBotName.trim(),
      tagline: newBotTagline.trim() || "Especialista Operativo para Orlando Cars",
      avatar: newBotAvatar,
      role: newBotRole.trim() || "Gestión de tareas específicas en concesionario",
      color: "from-blue-600 via-indigo-600 to-cyan-500",
      badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      status: "ONLINE",
      activeTasks: 1,
      completedTasks: 0,
      accuracyRate: "100%",
      lastAction: "Bot anexado e inicializado",
      isCustom: true,
      promptInstructions: newBotInstructions.trim() || "Ejecutar directrices de gestión para Orlando Cars y reportar incidencias."
    };

    setBots(prev => [...prev, newBot]);
    setActiveTab(id);
    setModalOpen(false);

    // Reset form
    setNewBotName("");
    setNewBotTagline("");
    setNewBotRole("");
    setNewBotInstructions("");
    setNewBotAvatar("⚡");
  };

  const handleDeleteBot = (botId: string) => {
    setBots(prev => prev.filter(b => b.id !== botId));
    setActiveTab("chief");
  };

  const selectedCustomBot = bots.find(b => b.id === activeTab && b.isCustom);

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Top Header */}
      <HeaderOps onRefreshAll={handleRefreshAll} />

      {/* Main Container */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#070c1b] border border-slate-800 p-2 rounded-2xl">
          
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 font-mono text-xs flex-1 scrollbar-none">
            
            {/* Native 4 Bots */}
            <button
              onClick={() => setActiveTab("agenda")}
              className={`flex items-center gap-2 py-2.5 px-3.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                activeTab === "agenda"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-900/30"
                  : "text-slate-400 hover:text-white hover:bg-[#0a1228]"
              }`}
            >
              <span>📅</span>
              <span>Directrices & Agenda Diaria</span>
            </button>

            <button
              onClick={() => setActiveTab("chief")}
              className={`flex items-center gap-2 py-2.5 px-3.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                activeTab === "chief"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/30"
                  : "text-slate-400 hover:text-white hover:bg-[#0a1228]"
              }`}
            >
              <span>👔</span>
              <span>Nexo-Chief</span>
            </button>

            <button
              onClick={() => setActiveTab("stock")}
              className={`flex items-center gap-2 py-2.5 px-3.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                activeTab === "stock"
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/30"
                  : "text-slate-400 hover:text-white hover:bg-[#0a1228]"
              }`}
            >
              <span>🚗</span>
              <span>Stock & Plataformas</span>
            </button>

            <button
              onClick={() => setActiveTab("social")}
              className={`flex items-center gap-2 py-2.5 px-3.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                activeTab === "social"
                  ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-900/30"
                  : "text-slate-400 hover:text-white hover:bg-[#0a1228]"
              }`}
            >
              <span>📱</span>
              <span>Redes & Reels</span>
            </button>

            <button
              onClick={() => setActiveTab("network")}
              className={`flex items-center gap-2 py-2.5 px-3.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                activeTab === "network"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/30"
                  : "text-slate-400 hover:text-white hover:bg-[#0a1228]"
              }`}
            >
              <span>📡</span>
              <span>Red LAN & Sistemas</span>
            </button>

            {/* Annexed Custom Bots */}
            {bots.filter(b => b.isCustom).map(b => (
              <button
                key={b.id}
                onClick={() => setActiveTab(b.id)}
                className={`flex items-center gap-2 py-2.5 px-3.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
                  activeTab === b.id
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400 shadow-lg shadow-blue-900/30"
                    : "text-slate-300 hover:text-white bg-[#091024] border-slate-800"
                }`}
              >
                <span>{b.avatar}</span>
                <span>{b.name}</span>
              </button>
            ))}

            {/* Add Bot Button */}
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-cyan-500/15 to-blue-500/15 hover:from-cyan-500/25 hover:to-blue-500/25 text-cyan-300 border border-cyan-500/30 font-bold whitespace-nowrap transition-all active:scale-95 ml-1"
              title="Anexar un nuevo bot al centro de operaciones"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Anexar Bot</span>
            </button>

          </div>

          {/* Quick link to main ERP */}
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#091024] hover:bg-[#0e172f] border border-slate-800 text-slate-300 hover:text-cyan-400 text-xs font-mono font-medium transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Nexo-Car</span>
          </Link>

        </div>

        {/* Tab Content View */}
        <div className="transition-all duration-200">
          {activeTab === "agenda" && (
            <DirectivesAndTasksView bots={bots} />
          )}

          {activeTab === "chief" && (
            <ChiefSupervisorView
              bots={bots}
              onDelegateAction={handleDelegateAction}
            />
          )}

          {activeTab === "stock" && (
            <StockBotView ingestions={ingestions} />
          )}

          {activeTab === "social" && (
            <SocialBotView drafts={drafts} />
          )}

          {activeTab === "network" && (
            <NetworkBotView nodes={nodes} />
          )}

          {selectedCustomBot && (
            <CustomBotView
              bot={selectedCustomBot}
              onDeleteBot={handleDeleteBot}
            />
          )}
        </div>

      </main>

      {/* Modal: Add New Custom Bot */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200 select-none">
          <div className="w-full max-w-lg bg-[#070c1b] border border-slate-800 rounded-3xl p-6 shadow-2xl shadow-cyan-950/40 space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-sm shadow-md">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-mono font-bold text-sm text-white">Anexar Nuevo Bot al Escuadrón</h3>
                  <p className="text-[11px] text-slate-400">Crea un agente autónomo para una gestión específica</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBot} className="space-y-4 font-mono text-xs">
              
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Nombre del Bot</label>
                <input
                  type="text"
                  value={newBotName}
                  onChange={(e) => setNewBotName(e.target.value)}
                  placeholder="Ej: Factura-Bot, Taller-Guard, WhatsApp-Closer..."
                  className="w-full bg-[#091024] border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="text-[11px] text-slate-400 block mb-1">Emoji / Avatar</label>
                  <select
                    value={newBotAvatar}
                    onChange={(e) => setNewBotAvatar(e.target.value)}
                    className="w-full bg-[#091024] border border-slate-800 rounded-xl px-3 py-2 text-white text-base focus:outline-none focus:border-cyan-400"
                  >
                    <option value="⚡">⚡ Rayo</option>
                    <option value="🧾">🧾 Facturas</option>
                    <option value="🛡️">🛡️ Garantías</option>
                    <option value="⚙️">⚙️ Taller</option>
                    <option value="💬">💬 WhatsApp</option>
                    <option value="📊">📊 Métricas</option>
                    <option value="📸">📸 Fotos</option>
                    <option value="⚖️">⚖️ Legal / REBU</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-[11px] text-slate-400 block mb-1">Subtítulo / Especialidad</label>
                  <input
                    type="text"
                    value={newBotTagline}
                    onChange={(e) => setNewBotTagline(e.target.value)}
                    placeholder="Ej: Auditor de Facturas y Gastos REBU"
                    className="w-full bg-[#091024] border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Rol Operativo</label>
                <input
                  type="text"
                  value={newBotRole}
                  onChange={(e) => setNewBotRole(e.target.value)}
                  placeholder="Ej: Revisión automática de albaranes de chapa y pintura"
                  className="w-full bg-[#091024] border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Directrices / Instrucciones del Bot</label>
                <textarea
                  value={newBotInstructions}
                  onChange={(e) => setNewBotInstructions(e.target.value)}
                  rows={3}
                  placeholder="Describe qué debe hacer cuando le mandes una orden en su consola..."
                  className="w-full bg-[#091024] border border-slate-800 rounded-xl p-3 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-400 leading-relaxed resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Anexar e Inicializar</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060a17] px-6 py-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-400">
              Escuadrón Multi-Agente Permanente para Shigeru • Orlando Cars Paterna
            </span>
          </div>
          <div>
            <span>Orlando.Ops • Modular Bot Architecture</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
