"use client";

import { useState } from "react";
import { MessageSquare, Send, CheckCheck, User, Car, Paperclip, Phone, MoreVertical } from "lucide-react";
import { mockVehicles } from "@/lib/mock-data";

export default function WhatsAppPage() {
  const [activeChat, setActiveChat] = useState("chat-1");
  const [messageInput, setMessageInput] = useState("");

  const chats = [
    {
      id: "chat-1",
      customer: "Carlos Mendoza Silva",
      phone: "+34 620 441 298",
      vehicle: "Mercedes-Benz Clase A (4821-LXZ)",
      lastMessage: "He enviado la documentación de la nómina para el estudio.",
      time: "17:15",
      unread: 1,
    },
    {
      id: "chat-2",
      customer: "Alejandro Gómez Rovira",
      phone: "+34 689 334 122",
      vehicle: "Porsche Macan GTS (3302-MMT)",
      lastMessage: "¿A qué hora podríamos ver el Macan el sábado?",
      time: "15:40",
      unread: 0,
    },
    {
      id: "chat-3",
      customer: "Beatriz Fernández",
      phone: "+34 644 112 334",
      vehicle: "Audi Q5 quattro (9134-MBN)",
      lastMessage: "Confirmada la cita de prueba mañana a las 11:30.",
      time: "12:10",
      unread: 0,
    },
  ];

  const [messages, setMessages] = useState([
    {
      sender: "customer",
      text: "Hola buenas tardes, vi el Mercedes Clase A 200d AMG Line en Coches.net.",
      time: "16:45",
    },
    {
      sender: "agent",
      text: "¡Hola Carlos! Sí, el vehículo está disponible en nuestra exposición central de Orlando Cars. Cuenta con techo panorámico y garantía oficial de 1 año.",
      time: "16:48",
    },
    {
      sender: "customer",
      text: "¿Podríamos financiarlo a 6 años? ¿Qué cuota aproximada saldría?",
      time: "16:52",
    },
    {
      sender: "agent",
      text: "Con el precio financiado de 28.400 € y sin entrada, la cuota estimada ronda los 445 €/mes. Te adjunto la ficha completa con fotos.",
      time: "17:02",
    },
    {
      sender: "customer",
      text: "He enviado la documentación de la nómina para el estudio.",
      time: "17:15",
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    setMessages([
      ...messages,
      {
        sender: "agent",
        text: messageInput,
        time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setMessageInput("");
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-white">
            WhatsApp Business Cloud Platform
          </h1>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
            Conectado Oficial Meta
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Atención comercial instantánea vinculada al inventario y al embudo de leads
        </p>
      </div>

      <div className="flex-1 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl flex">
        {/* Left: Chat list */}
        <div className="w-80 border-r border-slate-800 flex flex-col bg-slate-950/60">
          <div className="p-3 border-b border-slate-800 text-xs font-bold text-white uppercase tracking-wider">
            Conversaciones Activas ({chats.length})
          </div>
          <div className="divide-y divide-slate-800/80 overflow-y-auto flex-1">
            {chats.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveChat(c.id)}
                className={`w-full text-left p-3.5 transition-colors flex items-start justify-between ${
                  activeChat === c.id ? "bg-slate-800/90" : "hover:bg-slate-900"
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{c.customer}</h4>
                  <p className="text-[10px] text-blue-400 font-mono">{c.vehicle}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">{c.lastMessage}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500">{c.time}</span>
                  {c.unread > 0 && (
                    <span className="block mt-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-bold text-[9px] text-center leading-4">
                      {c.unread}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Message Window */}
        <div className="flex-1 flex flex-col bg-[#070b13]">
          {/* Chat Header */}
          <div className="p-3.5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                CM
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Carlos Mendoza Silva</h3>
                <p className="text-[10px] text-slate-400 font-mono">+34 620 441 298 • Interés: Mercedes-Benz Clase A 200d</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert("Enviando ficha técnica de coche...")}
                className="px-2.5 py-1 rounded bg-blue-600/20 text-blue-400 text-xs font-semibold hover:bg-blue-600 hover:text-white transition-colors"
              >
                Compartir Ficha Coche
              </button>
            </div>
          </div>

          {/* Messages Flow */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === "agent" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-md p-3 rounded-2xl text-xs space-y-1 shadow-md ${
                    m.sender === "agent"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-slate-800 text-slate-200 rounded-bl-none"
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                  <div className="flex items-center justify-end gap-1 text-[9px] opacity-75">
                    <span>{m.time}</span>
                    {m.sender === "agent" && <CheckCheck className="w-3 h-3 text-cyan-300" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-slate-800 bg-slate-900/60 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Escribe un mensaje de WhatsApp para el cliente..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
