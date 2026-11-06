"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Car, 
  Smartphone, 
  Share2, 
  Calculator, 
  CheckCircle2, 
  ArrowRight,
  Video
} from "lucide-react";

const CHAPTERS = [
  {
    id: 0,
    badge: "⚡ PLATAFORMA INTEGRAL ERP & CRM",
    title: "Nexo-Car: Creado a medida para Orlando Cars y Loewe",
    desc: "Plataforma centralizada para la sede de Paterna (Pol. Ind. Fuente del Jarro). Sustituye software disperso y hojas de cálculo con control de stock, tasaciones, agenda de pruebas y márgenes comerciales automáticos.",
    color: "from-blue-500 to-indigo-600",
    stats: [
      { label: "Sede", val: "Paterna, Valencia" },
      { label: "Ahorro", val: "100% Sin Comisiones" },
      { label: "Modo", val: "En Tiempo Real" }
    ]
  },
  {
    id: 1,
    badge: "📱 CATÁLOGO DIGITAL EXCLUSIVO",
    title: "Showroom Público para Móvil con Filtro de Cuota",
    desc: "Tus clientes pueden explorar el stock de Orlando Cars y la gama de lujo de Loewe Cars. Cada vehículo cuenta con simulador de financiación mensual y botón directo a WhatsApp de la agencia.",
    color: "from-cyan-500 to-blue-600",
    stats: [
      { label: "Conversión", val: "WhatsApp Directo" },
      { label: "Filtro", val: "Por Cuota al Mes" },
      { label: "Marcas", val: "Orlando & Loewe" }
    ]
  },
  {
    id: 2,
    badge: "📸 GESTIÓN DE STOCK & FOTOS",
    title: "Fotos al Vuelo con Cámara Móvil y Estudio IA",
    desc: "Los comerciales y mecánicos pueden subir fotos directas desde la cámara del smartphone al recibir un vehículo. Con 1 clic, el Estudio IA elimina el fondo de la campa y lo coloca en un showroom de lujo.",
    color: "from-purple-500 to-indigo-600",
    stats: [
      { label: "Cámara", val: "Subida al Instante" },
      { label: "Estudio IA", val: "Showroom Virtual" },
      { label: "Watermark", val: "Logo Orlando" }
    ]
  },
  {
    id: 3,
    badge: "🌐 MULTI-PORTAL & DIFUSIÓN",
    title: "Sincronización Automática y Feeds XML / JSON",
    desc: "Publica y retira vehículos en Coches.net, Wallapop, Milanuncios, Autocasión y Motor.es desde una matriz visual. Dispone de enlaces de feeds XML estandarizados listos para conectar cualquier plataforma.",
    color: "from-amber-500 to-orange-600",
    stats: [
      { label: "Portales", val: "5+ Integrados" },
      { label: "Feeds", val: "XML / JSON / CSV" },
      { label: "Control", val: "Matriz por Coche" }
    ]
  },
  {
    id: 4,
    badge: "💰 FINANZAS Y FISCALIDAD",
    title: "Cálculo Exacto de Margen REBU y Gastos de Campa",
    desc: "Control total de rentabilidad por unidad. Desglose de precio de compra, preparación, chapa y pintura, ITV y liquidación exacta del Régimen Especial de Bienes Usados (REBU) sin sorpresas.",
    color: "from-emerald-500 to-teal-600",
    stats: [
      { label: "Fiscalidad", val: "REBU Automatizado" },
      { label: "Gastos", val: "Taller & Campa" },
      { label: "Beneficio", val: "Margen Neto Limpio" }
    ]
  }
];

export default function TourPage() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = 50;
    const duration = 7500;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrent((c) => (c + 1) % CHAPTERS.length);
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, current]);

  const goTo = (index: number) => {
    setCurrent(index);
    setProgress(0);
  };

  const ch = CHAPTERS[current];

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col justify-center items-center p-3 md:p-6 select-none">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl shadow-blue-950/40 flex flex-col">
        
        {/* Top Story Timeline */}
        <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex flex-col gap-3">
          <div className="grid grid-cols-5 gap-1.5 w-full">
            {CHAPTERS.map((c, i) => (
              <div 
                key={c.id} 
                onClick={() => goTo(i)}
                className="h-1.5 rounded-full bg-slate-800 overflow-hidden cursor-pointer"
              >
                <div 
                  className="h-full bg-blue-500 transition-all duration-75"
                  style={{
                    width: i < current ? "100%" : i === current ? `${progress}%` : "0%"
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-md text-sm">
                N
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xs text-white">NEXO-CAR PRO</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                    VIDEO SHOWCASE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Capítulo {current + 1} de {CHAPTERS.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? "Pausar" : "Reproducir"}</span>
              </button>
              <Link 
                href="/catalog"
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
              >
                Ver Catálogo ↗
              </Link>
            </div>
          </div>
        </div>

        {/* Video Canvas Stage */}
        <div className="relative bg-gradient-to-b from-[#0a0f1d] to-[#060911] p-6 md:p-12 min-h-[420px] flex flex-col justify-center items-center text-center">
          <div className="max-w-xl mx-auto space-y-5 animate-in fade-in duration-300">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{ch.badge}</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
              {ch.title}
            </h1>

            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              {ch.desc}
            </p>

            <div className="grid grid-cols-3 gap-2.5 w-full pt-4 text-left">
              {ch.stats.map((s, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                  <p className="text-[11px] text-slate-400">{s.label}</p>
                  <p className="text-sm font-bold text-white truncate">{s.val}</p>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => goTo((current - 1 + CHAPTERS.length) % CHAPTERS.length)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Anterior</span>
            </button>
            <button 
              onClick={() => goTo((current + 1) % CHAPTERS.length)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 transition-colors flex items-center gap-1"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Video className="w-3.5 h-3.5 text-blue-400" />
            <span>Graba la pantalla en tu móvil para enviarlo por WhatsApp</span>
          </div>
        </div>

      </div>
    </div>
  );
}
