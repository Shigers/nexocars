"use client";

import { useState } from "react";
import { Bot, Sparkles, Send, Car, TrendingUp, Megaphone, CheckCircle2 } from "lucide-react";
import { mockVehicles } from "@/lib/mock-data";

export default function AIAssistantPage() {
  const [selectedAgent, setSelectedAgent] = useState<"ventas" | "compras" | "marketing">("ventas");
  const [inputQuery, setInputQuery] = useState("");

  const [chatLog, setChatLog] = useState([
    {
      agent: "ventas",
      role: "assistant",
      text: "¡Hola! Soy tu Agente Copiloto de Ventas para Orlando Cars y Loewe Cars. Conozco todo el stock en tiempo real, precios de contado, financiaciones y estado de ITV. ¿En qué te puedo ayudar?",
    },
  ]);

  const quickPrompts = {
    ventas: [
      "¿Qué SUV híbridos o ECO tenemos disponibles para entrega inmediata?",
      "Dame los datos clave y precio financiado del Audi Q5",
      "¿Qué vehículo de menos de 30.000 € tiene mejor margen?",
    ],
    compras: [
      "Tengo un cliente que ofrece un Cupra Formentor 2021 con 50.000 km. ¿Cuál sería el precio máximo de compra para dejar 4.000 € de margen?",
      "Analiza el precio de mercado para tasar un BMW M2 Competition",
    ],
    marketing: [
      "Redacta un anuncio persuasivo para Wallapop del Porsche Macan GTS",
      "¿Qué coches llevan más de 40 días en stock y qué descuento podemos aplicar?",
      "Genera 3 ganchos para Instagram Stories sobre la llegada del Clase A AMG Line",
    ],
  };

  const handleSend = (text?: string) => {
    const query = text || inputQuery;
    if (!query.trim()) return;

    const newLogs = [...chatLog, { agent: selectedAgent, role: "user", text: query }];
    setChatLog(newLogs);
    setInputQuery("");

    setTimeout(() => {
      let reply = "";
      if (selectedAgent === "ventas") {
        reply = `En el inventario de Orlando Cars disponemos de 2 unidades híbridas con etiqueta ECO:
1. **Audi Q5 40 TDI quattro S-Line (2023)**: 45.900 € contado (43.900 € financiado). 36.200 km. Margen REBU: +6.250 €.
2. **Volkswagen Golf 8 1.5 eTSI R-Line**: Vendido recientemente.
Recomendación para el cliente: el Audi Q5 está impecable en Loewe Cars y listo para prueba dinámica.`;
      } else if (selectedAgent === "compras") {
        reply = `Para un Cupra Formentor 2021 de 50.000 km:
- Precio de venta de mercado estimado: **31.500 € - 32.900 €**.
- Gastos estimados de taller / reacondicionamiento: **850 €**.
- Margen objetivo deseado: **4.000 €**.
- **Oferta máxima de compra recomendada:** **26.900 €**. Si compras por debajo de 26.500 €, aseguras un margen neto excelente bajo REBU.`;
      } else {
        reply = `¡Anuncio listo para Wallapop / Coches.net! 🚀
**TITULAR:** ⚡ PORSCHE MACAN GTS 440CV PDK • COLOR CRAIYON • PORSCHE APPROVED ⚡
**DESCRIPCIÓN:**
Unidad exclusiva nacional con historial impecable. Color especial Crayon, escape deportivo conmutable, suspensión neumática PASM y frenos PSCB.
✅ Etiqueta C DGT
✅ Garantía oficial Porsche Approved
✅ Financiación a medida disponible
📍 Disponible en el Showroom de Loewe Cars. ¡Escríbenos por WhatsApp para agendar visita!`;
      }

      setChatLog([...newLogs, { agent: selectedAgent, role: "assistant", text: reply }]);
    }, 600);
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Copiloto de Inteligencia Artificial Automotriz
            <Sparkles className="w-4 h-4 text-purple-400" />
          </h1>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-semibold border border-purple-500/30">
            OpenAI GPT-4o
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Asistentes especializados entrenados con los datos de stock, márgenes de compra y estrategias comerciales de Orlando Cars
        </p>
      </div>

      {/* Agents Selector Strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            key: "ventas",
            name: "Agente de Ventas",
            desc: "Consulta de stock, especificaciones y cuotas",
            icon: Car,
            color: "border-blue-500/40 bg-blue-600/10 text-blue-400",
          },
          {
            key: "compras",
            name: "Agente de Compras",
            desc: "Tasaciones de mercado y márgenes de compra",
            icon: TrendingUp,
            color: "border-emerald-500/40 bg-emerald-600/10 text-emerald-400",
          },
          {
            key: "marketing",
            name: "Agente de Marketing",
            desc: "Redactor de anuncios y rotación de stock",
            icon: Megaphone,
            color: "border-purple-500/40 bg-purple-600/10 text-purple-400",
          },
        ].map((agent) => {
          const Icon = agent.icon;
          const isSelected = selectedAgent === agent.key;
          return (
            <button
              key={agent.key}
              onClick={() => setSelectedAgent(agent.key as any)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? `${agent.color} shadow-lg ring-1 ring-blue-500/50`
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4" />
                <span className="text-xs font-bold text-white">{agent.name}</span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-1">{agent.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
        {/* Messages Flow */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {chatLog.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                }`}
              >
                {msg.role === "user" ? "Tú" : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`p-4 rounded-2xl text-xs space-y-2 max-w-2xl leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-slate-950 border border-slate-800/80 text-slate-200 rounded-tl-none whitespace-pre-line"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Suggestions */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-500 text-[10px] uppercase font-bold flex-shrink-0">
            Sugerencias:
          </span>
          {quickPrompts[selectedAgent].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors whitespace-nowrap flex-shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Query Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-slate-800 bg-slate-900 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={`Pregunta al Agente de ${
              selectedAgent.charAt(0).toUpperCase() + selectedAgent.slice(1)
            } sobre stock, márgenes o anuncios...`}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
