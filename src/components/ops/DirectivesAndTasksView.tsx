"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Mail,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  AlertTriangle,
  Bot,
  Sparkles,
  ChevronRight,
  Filter,
  Check,
  Bell,
  ArrowRight,
  FileText,
  User,
  Zap,
} from "lucide-react";
import { BotStatus } from "./types";

export interface ScheduledTask {
  id: string;
  title: string;
  type: "correo" | "tarea" | "recordatorio" | "llamada" | "directriz_bot";
  assignedTo: string; // "Yo (Shigeru)" o Bot ID
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  priority: "alta" | "media" | "baja";
  completed: boolean;
  notes?: string;
  botInstruction?: string;
}

export interface BotDirective {
  id: string;
  botId: string;
  frequency: "Diario a las 09:00" | "Cada 2 horas" | "En tiempo real" | "Al cerrar venta";
  title: string;
  instruction: string;
  active: boolean;
}

const STORAGE_KEY_TASKS = "orlando_ops_tasks_v3";
const STORAGE_KEY_DIRECTIVES = "orlando_ops_directives_v3";

const INITIAL_DIRECTIVES: BotDirective[] = [
  {
    id: "dir-1",
    botId: "chief",
    frequency: "Diario a las 09:00",
    title: "Auditoría diaria de stock parado (>45 días en campa)",
    instruction: "Escanear vehículos en Supabase. Si alguno supera 45 días sin venderse, calcular la rebaja psicológica al 90 y preparar notificación de liquidación urgente.",
    active: true,
  },
  {
    id: "dir-2",
    botId: "stock",
    frequency: "Cada 2 horas",
    title: "Verificación de fotos y especificaciones de stock",
    instruction: "Comprobar que todos los coches en estado 'disponible' tengan al menos 6 fotos y equipamiento completo para los feeds de Coches.net.",
    active: true,
  },
  {
    id: "dir-3",
    botId: "social",
    frequency: "Diario a las 09:00",
    title: "Generación de borrador de Reel & Anuncio para el coche destacado",
    instruction: "Seleccionar el coche con mejor margen neto del día y redactar un guion persuasivo con gancho para Instagram, TikTok y Wallapop.",
    active: true,
  },
  {
    id: "dir-4",
    botId: "network",
    frequency: "En tiempo real",
    title: "Centinela de conectividad y sincronización Supabase",
    instruction: "Monitorizar latencia de la base de datos cloud y verificar que los feeds XML respondan con código 200 en menos de 100ms.",
    active: true,
  },
];

const INITIAL_TASKS: ScheduledTask[] = [
  {
    id: "task-01",
    title: "09:00 - Enviar correo a gestoría con contratos firmados y justificantes bancarios",
    type: "correo",
    assignedTo: "Yo (Shigeru)",
    date: new Date().toISOString().split("T")[0],
    time: "09:00",
    priority: "alta",
    completed: false,
    notes: "Documentación de la Mercedes Vito y DNI del comprador para tramitar cambio de titularidad DGT.",
  },
  {
    id: "task-02",
    title: "10:15 - Inspección matinal de patio y campa de Paterna",
    type: "tarea",
    assignedTo: "Yo (Shigeru)",
    date: new Date().toISOString().split("T")[0],
    time: "10:15",
    priority: "media",
    completed: false,
    notes: "Revisar coches lavados, carteles de precios colocados y verificar si alguno cumple más de 45 días.",
  },
  {
    id: "task-03",
    title: "11:30 - Recordatorio: Llamar a cliente del Audi Q5 para concretar cita de prueba",
    type: "llamada",
    assignedTo: "Yo (Shigeru)",
    date: new Date().toISOString().split("T")[0],
    time: "11:30",
    priority: "alta",
    completed: false,
    notes: "Preguntarle si entrega coche como parte de pago para abrir tasador REBU.",
  },
  {
    id: "task-04",
    title: "13:00 - Revisión de solicitudes de tasación de particulares en Wallapop",
    type: "tarea",
    assignedTo: "Nexo-Chief",
    date: new Date().toISOString().split("T")[0],
    time: "13:00",
    priority: "alta",
    completed: false,
    notes: "Pasar ofertas por la calculadora de tasación inversa REBU para no exceder el precio tope.",
  },
  {
    id: "task-05",
    title: "16:00 - Comprobar estado de taller (pastillas de freno del Seat León)",
    type: "tarea",
    assignedTo: "Yo (Shigeru)",
    date: new Date().toISOString().split("T")[0],
    time: "16:00",
    priority: "media",
    completed: false,
    notes: "Si el mecánico termina la revisión y limpieza, cambiar estado a 'disponible' en el sistema.",
  },
  {
    id: "task-06",
    title: "18:00 - Sincronizar feeds de stock con Coches.net y AutoScout24",
    type: "directriz_bot",
    assignedTo: "Stock-Ingestor",
    date: new Date().toISOString().split("T")[0],
    time: "18:00",
    priority: "media",
    completed: false,
    botInstruction: "Consumir endpoint /api/feed/coches_net y refrescar caché en la CDN de Vercel.",
  },
  {
    id: "task-07",
    title: "19:30 - Cierre de jornada: Balance de ventas y margen acumulado del día",
    type: "recordatorio",
    assignedTo: "Nexo-Chief",
    date: new Date().toISOString().split("T")[0],
    time: "19:30",
    priority: "media",
    completed: false,
    notes: "Revisar leads atendidos, nuevos contratos y dejar programadas las funciones de mañana.",
  },
];

export function DirectivesAndTasksView({ bots }: { bots: BotStatus[] }) {
  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [filterType, setFilterType] = useState<string>("all");

  const [tasks, setTasks] = useState<ScheduledTask[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_TASKS);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_TASKS;
  });

  const [directives, setDirectives] = useState<BotDirective[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_DIRECTIVES);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_DIRECTIVES;
  });

  // Modals / Form State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<ScheduledTask["type"]>("tarea");
  const [newAssignedTo, setNewAssignedTo] = useState("Yo (Shigeru)");
  const [newTime, setNewTime] = useState("10:00");
  const [newPriority, setNewPriority] = useState<ScheduledTask["priority"]>("media");
  const [newNotes, setNewNotes] = useState("");

  // Directive Form State
  const [isDirectiveModalOpen, setIsDirectiveModalOpen] = useState(false);
  const [newDirBotId, setNewDirBotId] = useState("chief");
  const [newDirFrequency, setNewDirFrequency] = useState<BotDirective["frequency"]>("Diario a las 09:00");
  const [newDirTitle, setNewDirTitle] = useState("");
  const [newDirInstruction, setNewDirInstruction] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_DIRECTIVES, JSON.stringify(directives));
    }
  }, [directives]);

  const handleToggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: ScheduledTask = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      type: newType,
      assignedTo: newAssignedTo,
      date: selectedDate,
      time: newTime,
      priority: newPriority,
      completed: false,
      notes: newNotes.trim() || undefined,
    };

    setTasks(prev => [newTask, ...prev]);
    setIsTaskModalOpen(false);
    setNewTitle("");
    setNewNotes("");
  };

  const handleCreateDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDirTitle.trim() || !newDirInstruction.trim()) return;

    const newDir: BotDirective = {
      id: `dir-${Date.now()}`,
      botId: newDirBotId,
      frequency: newDirFrequency,
      title: newDirTitle.trim(),
      instruction: newDirInstruction.trim(),
      active: true,
    };

    setDirectives(prev => [...prev, newDir]);
    setIsDirectiveModalOpen(false);
    setNewDirTitle("");
    setNewDirInstruction("");
  };

  const handleToggleDirective = (dirId: string) => {
    setDirectives(prev =>
      prev.map(d => (d.id === dirId ? { ...d, active: !d.active } : d))
    );
  };

  const handleDeleteDirective = (dirId: string) => {
    setDirectives(prev => prev.filter(d => d.id !== dirId));
  };

  // Filter tasks for selected date and type
  const dayTasks = tasks.filter(t => t.date === selectedDate);
  const filteredTasks = dayTasks.filter(t => {
    if (filterType === "all") return true;
    if (filterType === "pending") return !t.completed;
    if (filterType === "completed") return t.completed;
    return t.type === filterType;
  });

  const pendingCount = dayTasks.filter(t => !t.completed).length;
  const completedCount = dayTasks.filter(t => t.completed).length;

  const getTypeBadge = (type: ScheduledTask["type"]) => {
    switch (type) {
      case "correo":
        return { label: "Correo", icon: Mail, color: "bg-blue-500/20 text-blue-300 border-blue-500/30" };
      case "llamada":
        return { label: "Llamada", icon: Bell, color: "bg-purple-500/20 text-purple-300 border-purple-500/30" };
      case "recordatorio":
        return { label: "Recordatorio", icon: Clock, color: "bg-amber-500/20 text-amber-300 border-amber-500/30" };
      case "directriz_bot":
        return { label: "Bot Task", icon: Bot, color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" };
      default:
        return { label: "Tarea", icon: FileText, color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#091024] border border-blue-500/30 flex items-center justify-between shadow-lg shadow-blue-950/20">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Funciones de Hoy
            </span>
            <span className="text-2xl font-black text-white mt-1 block">
              {pendingCount} <span className="text-xs font-normal text-slate-400">pendientes</span>
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#091024] border border-emerald-500/30 flex items-center justify-between shadow-lg shadow-emerald-950/20">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Completadas Hoy
            </span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">
              {completedCount} <span className="text-xs font-normal text-slate-400">hechas</span>
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#091024] border border-purple-500/30 flex items-center justify-between shadow-lg shadow-purple-950/20">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Directrices de Bots
            </span>
            <span className="text-2xl font-black text-purple-300 mt-1 block">
              {directives.filter(d => d.active).length} <span className="text-xs font-normal text-slate-400">activas</span>
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Bot className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#091024] border border-amber-500/30 flex items-center justify-between shadow-lg shadow-amber-950/20">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Fecha Seleccionada
            </span>
            <span className="text-base font-bold text-white mt-1 block">
              {selectedDate === todayStr ? "Hoy (" + selectedDate + ")" : selectedDate}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Directrices Fijas de Bots (Izquierda) + Agenda Diaria (Derecha) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA 1: DIRECTRICES PERMANENTES DE BOTS */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded-2xl bg-[#091024] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Directrices Fijas de Bots</h3>
              </div>
              <button
                onClick={() => setIsDirectiveModalOpen(true)}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 font-semibold transition-all"
              >
                <Plus className="w-3 h-3" />
                <span>Nueva</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Instrucciones programadas que tus bots ejecutan en segundo plano (rutinas diarias, alertas y chequeos).
            </p>

            <div className="space-y-3">
              {directives.map(dir => (
                <div
                  key={dir.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    dir.active
                      ? "bg-[#0c142c] border-purple-500/30 shadow-sm"
                      : "bg-[#060a16] border-slate-800/80 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono font-bold">
                          {dir.frequency}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {bots.find(b => b.id === dir.botId)?.name || "Bot"}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{dir.title}</h4>
                      <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {dir.instruction}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1 items-end">
                      <button
                        onClick={() => handleToggleDirective(dir.id)}
                        className={`text-[10px] px-2 py-0.5 rounded font-bold transition-colors ${
                          dir.active ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {dir.active ? "ACTIVA" : "PAUSA"}
                      </button>
                      <button
                        onClick={() => handleDeleteDirective(dir.id)}
                        className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                        title="Eliminar directriz"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMNA 2 Y 3: AGENDA DIARIA, TAREAS Y CORREOS */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-2xl bg-[#091024] border border-slate-800 space-y-4">
            {/* Header with Date Switcher and New Task Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Cronograma y Funciones del Día</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">
                    {dayTasks.length} funciones
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Planificación diaria de correos a gestoría, llamadas comerciales, taller y tareas de bots.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="bg-[#0c142c] border border-slate-700 text-xs text-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
                />

                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Programar Función</span>
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
              {[
                { id: "all", label: "Todas" },
                { id: "pending", label: "Pendientes" },
                { id: "completed", label: "Completadas" },
                { id: "correo", label: "📧 Correos" },
                { id: "llamada", label: "📞 Llamadas" },
                { id: "recordatorio", label: "⏰ Recordatorios" },
                { id: "directriz_bot", label: "🤖 Bots" },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    filterType === f.id
                      ? "bg-blue-600 text-white font-semibold"
                      : "bg-[#0c142c] text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Task List */}
            <div className="space-y-2.5">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12 rounded-xl bg-[#060a16] border border-dashed border-slate-800">
                  <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No hay funciones programadas para este filtro o fecha.</p>
                  <button
                    onClick={() => setIsTaskModalOpen(true)}
                    className="mt-3 text-xs text-blue-400 hover:underline font-semibold"
                  >
                    + Programar la primera función
                  </button>
                </div>
              ) : (
                filteredTasks.map(t => {
                  const badge = getTypeBadge(t.type);
                  const Icon = badge.icon;

                  return (
                    <div
                      key={t.id}
                      className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                        t.completed
                          ? "bg-[#060a16]/60 border-slate-800/60 opacity-60"
                          : "bg-[#0c142c] border-slate-700/80 hover:border-slate-600 shadow-sm"
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Checkbox */}
                        <button
                          onClick={() => handleToggleTask(t.id)}
                          className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors"
                        >
                          {t.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-500 hover:border-emerald-400" />
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border flex items-center gap-1 ${badge.color}`}
                            >
                              <Icon className="w-3 h-3" />
                              {badge.label}
                            </span>

                            {t.time && (
                              <span className="text-[11px] font-mono text-amber-300 flex items-center gap-1 font-bold">
                                <Clock className="w-3 h-3" />
                                {t.time}
                              </span>
                            )}

                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                              {t.assignedTo}
                            </span>

                            {t.priority === "alta" && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                                PRIORIDAD ALTA
                              </span>
                            )}
                          </div>

                          <h4
                            className={`text-xs font-bold ${
                              t.completed ? "line-through text-slate-500" : "text-white"
                            }`}
                          >
                            {t.title}
                          </h4>

                          {t.notes && (
                            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                              {t.notes}
                            </p>
                          )}

                          {t.botInstruction && (
                            <div className="mt-1.5 p-2 rounded-lg bg-blue-950/40 border border-blue-500/30 text-[10px] font-mono text-blue-300">
                              🤖 Directriz Bot: {t.botInstruction}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <button
                        onClick={() => handleDeleteTask(t.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        title="Eliminar función"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: NUEVA FUNCIÓN / TAREA / CORREO */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#091024] border border-blue-500/40 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>Programar Nueva Función Diaria</span>
              </h3>
              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Título de la función o tarea *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Enviar correo a gestoría con contrato firmado..."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-[#0c142c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Tipo de función
                  </label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full bg-[#0c142c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="tarea">📋 Tarea General</option>
                    <option value="correo">📧 Enviar / Revisar Correo</option>
                    <option value="llamada">📞 Llamada Comercial</option>
                    <option value="recordatorio">⏰ Recordatorio con Hora</option>
                    <option value="directriz_bot">🤖 Tarea para Bot Autónomo</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Asignar a
                  </label>
                  <select
                    value={newAssignedTo}
                    onChange={e => setNewAssignedTo(e.target.value)}
                    className="w-full bg-[#0c142c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Yo (Shigeru)">👤 Yo (Shigeru)</option>
                    <option value="Nexo-Chief">👔 Nexo-Chief (Supervisor)</option>
                    <option value="Stock-Ingestor">🚗 Stock-Ingestor</option>
                    <option value="Social-Copilot">📱 Social-Copilot</option>
                    <option value="Comercial Paterna">🤝 Comercial Paterna</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Hora prevista
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="w-full bg-[#0c142c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Prioridad
                  </label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as any)}
                    className="w-full bg-[#0c142c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="alta">🔴 Alta / Urgente</option>
                    <option value="media">🟡 Media</option>
                    <option value="baja">🟢 Baja</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Notas o Directriz detallada (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles, documentación a adjuntar, enlaces o pasos..."
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  className="w-full bg-[#0c142c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-lg shadow-blue-600/30"
                >
                  Guardar Función
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NUEVA DIRECTRIZ FIJA DE BOT */}
      {isDirectiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#091024] border border-purple-500/40 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-400" />
                <span>Configurar Nueva Directriz Fija para Bot</span>
              </h3>
              <button
                onClick={() => setIsDirectiveModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDirective} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Bot Asignado
                </label>
                <select
                  value={newDirBotId}
                  onChange={e => setNewDirBotId(e.target.value)}
                  className="w-full bg-[#0c142c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="chief">👔 Nexo-Chief (Supervisor)</option>
                  <option value="stock">🚗 Stock-Ingestor (Plataformas)</option>
                  <option value="social">📱 Social-Copilot (Redes)</option>
                  <option value="network">📡 Net-Sentinel (Sistemas)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Frecuencia de ejecución
                </label>
                <select
                  value={newDirFrequency}
                  onChange={e => setNewDirFrequency(e.target.value as any)}
                  className="w-full bg-[#0c142c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Diario a las 09:00">⏰ Diario a las 09:00 (Apertura)</option>
                  <option value="Cada 2 horas">🔄 Cada 2 horas</option>
                  <option value="En tiempo real">⚡ En tiempo real (Al haber cambios)</option>
                  <option value="Al cerrar venta">🤝 Al registrar una venta</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Nombre de la directriz *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Reporte matutino de llamadas y correos pendientes..."
                  value={newDirTitle}
                  onChange={e => setNewDirTitle(e.target.value)}
                  className="w-full bg-[#0c142c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Instrucción exacta para el bot *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe exactamente qué debe revisar el bot, qué debe calcular y qué recordatorio debe enviarte..."
                  value={newDirInstruction}
                  onChange={e => setNewDirInstruction(e.target.value)}
                  className="w-full bg-[#0c142c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDirectiveModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white shadow-lg shadow-purple-600/30"
                >
                  Activar Directriz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
