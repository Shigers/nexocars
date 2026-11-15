"use client";

import { useState, useEffect } from "react";
import {
  Bot,
  Sparkles,
  Car,
  TrendingUp,
  Megaphone,
  MessageSquare,
  Copy,
  Check,
  Send,
  ExternalLink,
  ShieldCheck,
  Calculator,
  Video,
  Key,
  Layers,
  ArrowRight,
  Info,
  Euro,
} from "lucide-react";
import { getStoredVehicles } from "@/lib/storage";
import { Vehicle } from "@/types";
import {
  generatePortalTexts,
  generateWhatsAppReply,
  calculateTasacion,
  generateMarketingPack,
  VehicleInput,
  TasacionInput,
} from "@/lib/agents-engine";

export default function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState<
    "portales" | "whatsapp" | "tasador" | "marketing" | "chat"
  >("portales");

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Optional User Gemini Key
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [showKeyModal, setShowKeyModal] = useState(false);

  // ---------------------------------------------------------------------------
  // 1. AGENTE PORTALES STATE
  // ---------------------------------------------------------------------------
  const [portalInput, setPortalInput] = useState<VehicleInput>({
    make: "Audi",
    model: "A4 2.0 TDI S-Line",
    year: 2021,
    km: 68000,
    price: 24900,
    fuel: "Diésel",
    cv: 150,
    transmission: "Automático S-Tronic",
    extras:
      "Paquete S-Line interior y exterior, Techo solar panorámico, Virtual Cockpit, Faros Matrix LED, Sensores 360 con cámara, Llantas 19 pulgadas",
  });
  const [portalActiveSubTab, setPortalActiveSubTab] = useState<
    "wallapop" | "cochesNet" | "milanuncios" | "web"
  >("wallapop");
  const [portalResults, setPortalResults] = useState<any>(null);

  // ---------------------------------------------------------------------------
  // 2. AGENTE WHATSAPP COMERCIAL STATE
  // ---------------------------------------------------------------------------
  const [leadClientName, setLeadClientName] = useState("David");
  const [leadVehicle, setLeadVehicle] = useState("Audi A4 2.0 TDI S-Line");
  const [leadPrice, setLeadPrice] = useState(24900);
  const [leadQuestion, setLeadQuestion] = useState(
    "Hola buenas, ¿sigue disponible el coche? ¿Y aceptáis coche a cambio?"
  );
  const [leadReply, setLeadReply] = useState<any>(null);

  // ---------------------------------------------------------------------------
  // 3. AGENTE TASADOR STATE
  // ---------------------------------------------------------------------------
  const [tasacionInput, setTasacionInput] = useState<TasacionInput>({
    make: "Seat",
    model: "León 1.6 TDI Style",
    year: 2018,
    km: 115000,
    fuel: "Diésel",
    condition: "bueno",
    askingPrice: 11000,
  });
  const [tasacionResult, setTasacionResult] = useState<any>(null);

  // ---------------------------------------------------------------------------
  // 4. AGENTE MARKETING & REELS STATE
  // ---------------------------------------------------------------------------
  const [marketingCar, setMarketingCar] = useState("Audi A4 2.0 TDI S-Line");
  const [marketingPrice, setMarketingPrice] = useState(24900);
  const [marketingExtras, setMarketingExtras] = useState(
    "Techo solar panorámico, Virtual Cockpit, Faros Matrix LED, Llantas 19"
  );
  const [marketingResult, setMarketingResult] = useState<any>(null);

  // ---------------------------------------------------------------------------
  // 5. CHAT CON NEXO STATE
  // ---------------------------------------------------------------------------
  const [chatMessages, setChatMessages] = useState<
    { sender: "nexo" | "user"; text: string; time: string }[]
  >([
    {
      sender: "nexo",
      text: "¡Hola! Soy Nexo, tu copiloto de IA automotriz para Orlando Cars. Tienes a tu disposición tus 4 agentes especializados (Portales, WhatsApp, Tasador y Marketing). ¿Qué necesitas resolver hoy?",
      time: "Ahora",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Load Stock on mount
  useEffect(() => {
    const list = getStoredVehicles();
    setVehicles(list);
    if (list.length > 0) {
      const first = list[0];
      setPortalInput({
        make: first.brand || "Audi",
        model: first.model || "A4",
        year: first.year || 2021,
        km: first.mileage || 65000,
        price: first.selling_price || 24900,
        fuel: first.fuel_type || "Diésel",
        cv: first.power_hp || 150,
        transmission: first.transmission === "automatico" ? "Automático" : "Manual",
        extras:
          first.equipment_list && first.equipment_list.length > 0
            ? first.equipment_list.join(", ")
            : first.description || "Acabado deportivo, navegación, sensores y garantía 12 meses",
        plate: first.plate,
      });
      setLeadVehicle(`${first.brand} ${first.model}`);
      setLeadPrice(first.selling_price || 24900);
      setMarketingCar(`${first.brand} ${first.model}`);
      setMarketingPrice(first.selling_price || 24900);
    }
    // Pre-calculate initial results
    setPortalResults(generatePortalTexts(portalInput));
    setLeadReply(
      generateWhatsAppReply({
        clientName: "David",
        question: "Hola buenas, ¿sigue disponible el coche? ¿Y aceptáis coche a cambio?",
        vehicleName: "Audi A4 2.0 TDI S-Line",
        price: 24900,
      })
    );
    setTasacionResult(calculateTasacion(tasacionInput));
    setMarketingResult(
      generateMarketingPack({
        vehicleName: "Audi A4 2.0 TDI S-Line",
        price: 24900,
        extras: "Techo solar panorámico, Virtual Cockpit, Faros Matrix LED",
        promoType: "novedad",
      })
    );

    const savedKey = localStorage.getItem("orlando_gemini_key");
    if (savedKey) setGeminiApiKey(savedKey);
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSelectStockVehicle = (vehId: string) => {
    const selected = vehicles.find((v) => v.id === vehId);
    if (!selected) return;

    const updated: VehicleInput = {
      make: selected.brand,
      model: selected.model,
      year: selected.year,
      km: selected.mileage,
      price: selected.selling_price,
      fuel: selected.fuel_type,
      cv: selected.power_hp || 150,
      transmission: selected.transmission === "automatico" ? "Automático" : "Manual",
      extras:
        selected.equipment_list && selected.equipment_list.length > 0
          ? selected.equipment_list.join(", ")
          : selected.description || "Paquete completo, revisión recién hecha, 12 meses garantía oficial",
      plate: selected.plate,
    };

    setPortalInput(updated);
    setPortalResults(generatePortalTexts(updated));
    setLeadVehicle(`${selected.brand} ${selected.model}`);
    setLeadPrice(selected.selling_price);
    setMarketingCar(`${selected.brand} ${selected.model}`);
    setMarketingPrice(selected.selling_price);
  };

  const handleGeneratePortales = (e: React.FormEvent) => {
    e.preventDefault();
    const res = generatePortalTexts(portalInput);
    setPortalResults(res);
  };

  const handleGenerateLead = (e: React.FormEvent) => {
    e.preventDefault();
    const res = generateWhatsAppReply({
      clientName: leadClientName,
      vehicleName: leadVehicle,
      price: leadPrice,
      question: leadQuestion,
    });
    setLeadReply(res);
  };

  const handleCalculateTasacion = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculateTasacion(tasacionInput);
    setTasacionResult(res);
  };

  const handleGenerateMarketing = (e: React.FormEvent) => {
    e.preventDefault();
    const res = generateMarketingPack({
      vehicleName: marketingCar,
      price: marketingPrice,
      extras: marketingExtras,
      promoType: "novedad",
    });
    setMarketingResult(res);
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput.trim();
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setChatMessages((prev) => [
      ...prev,
      { sender: "user", text: userText, time: timeNow },
    ]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userText,
          apiKey: geminiApiKey,
        }),
      });
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "nexo",
          text: data.reply || "Operación procesada con éxito.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "nexo",
          text: "Nexo conectado en modo offline. Los 4 agentes superiores están listos para ejecutar en sus pestañas específicas.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSaveKey = () => {
    localStorage.setItem("orlando_gemini_key", geminiApiKey);
    setShowKeyModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 p-6 rounded-3xl border border-blue-900/40 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30">
              <Bot className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-white tracking-tight">
              Centro de Mando de Agentes IA — Orlando Cars
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              MOTOR DEDICADO
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Tus 4 agentes personales especializados en el mercado de automoción español:
            publicación multi-portal, conversión de leads por WhatsApp, tasador express REBU y
            campañas de marketing en vídeo.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => setShowKeyModal(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all"
          >
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span>{geminiApiKey ? "API Gemini Conectada" : "Configurar API"}</span>
          </button>
        </div>
      </div>

      {/* Main Agent Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <button
          onClick={() => setActiveTab("portales")}
          className={`flex items-center gap-2.5 p-3.5 rounded-2xl border text-left transition-all ${
            activeTab === "portales"
              ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30"
              : "bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
          }`}
        >
          <div className="p-2 rounded-xl bg-blue-500/20 text-cyan-300">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold">1. Portales Web</div>
            <div className="text-[10px] opacity-75">Wallapop & Coches.net</div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("whatsapp")}
          className={`flex items-center gap-2.5 p-3.5 rounded-2xl border text-left transition-all ${
            activeTab === "whatsapp"
              ? "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30"
              : "bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
          }`}
        >
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold">2. Ventas WhatsApp</div>
            <div className="text-[10px] opacity-75">Cierre de citas & cuotas</div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("tasador")}
          className={`flex items-center gap-2.5 p-3.5 rounded-2xl border text-left transition-all ${
            activeTab === "tasador"
              ? "bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-600/30"
              : "bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
          }`}
        >
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold">3. Tasador & REBU</div>
            <div className="text-[10px] opacity-75">Valoración de compras VO</div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("marketing")}
          className={`flex items-center gap-2.5 p-3.5 rounded-2xl border text-left transition-all ${
            activeTab === "marketing"
              ? "bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30"
              : "bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
          }`}
        >
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold">4. Reels & Ads</div>
            <div className="text-[10px] opacity-75">Guiones y publicidad</div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("chat")}
          className={`flex items-center gap-2.5 p-3.5 rounded-2xl border text-left transition-all ${
            activeTab === "chat"
              ? "bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-600/30"
              : "bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
          }`}
        >
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold">Chat con Nexo</div>
            <div className="text-[10px] opacity-75">Consultas libres y táctica</div>
          </div>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: AGENTE PORTALES MULTI-WEB                                          */}
      {/* ========================================================================= */}
      {activeTab === "portales" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Inputs */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Datos del Vehículo</h3>
              </div>
              {vehicles.length > 0 && (
                <div className="text-[11px] text-slate-400">
                  <select
                    onChange={(e) => handleSelectStockVehicle(e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-cyan-300 rounded-lg px-2 py-1 text-xs focus:outline-none"
                  >
                    <option value="">Cargar de Stock Orlando...</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.brand} {v.model} ({v.plate || "S/M"})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <form onSubmit={handleGeneratePortales} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Marca
                  </label>
                  <input
                    type="text"
                    value={portalInput.make}
                    onChange={(e) => setPortalInput({ ...portalInput, make: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Modelo / Acabado
                  </label>
                  <input
                    type="text"
                    value={portalInput.model}
                    onChange={(e) => setPortalInput({ ...portalInput, model: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Año</label>
                  <input
                    type="number"
                    value={portalInput.year}
                    onChange={(e) =>
                      setPortalInput({ ...portalInput, year: parseInt(e.target.value) || 2021 })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Kilómetros
                  </label>
                  <input
                    type="number"
                    value={portalInput.km}
                    onChange={(e) =>
                      setPortalInput({ ...portalInput, km: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Precio (€)
                  </label>
                  <input
                    type="number"
                    value={portalInput.price}
                    onChange={(e) =>
                      setPortalInput({ ...portalInput, price: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Combustible
                  </label>
                  <input
                    type="text"
                    value={portalInput.fuel}
                    onChange={(e) => setPortalInput({ ...portalInput, fuel: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Potencia (CV)
                  </label>
                  <input
                    type="number"
                    value={portalInput.cv}
                    onChange={(e) =>
                      setPortalInput({ ...portalInput, cv: parseInt(e.target.value) || 150 })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Cambio
                  </label>
                  <input
                    type="text"
                    value={portalInput.transmission}
                    onChange={(e) =>
                      setPortalInput({ ...portalInput, transmission: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Equipamiento y extras clave (separados por comas)
                </label>
                <textarea
                  rows={3}
                  value={portalInput.extras}
                  onChange={(e) => setPortalInput({ ...portalInput, extras: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white leading-relaxed"
                  placeholder="Techo solar, Navegador, Sensores..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-xs shadow-lg shadow-blue-600/30 hover:brightness-110 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generar Textos para los 4 Portales</span>
              </button>
            </form>
          </div>

          {/* Right Preview: Generated Portal Texts */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {/* Sub-tabs selector for the portals */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setPortalActiveSubTab("wallapop")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      portalActiveSubTab === "wallapop"
                        ? "bg-emerald-500 text-slate-950 shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Wallapop
                  </button>
                  <button
                    onClick={() => setPortalActiveSubTab("cochesNet")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      portalActiveSubTab === "cochesNet"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Coches.net
                  </button>
                  <button
                    onClick={() => setPortalActiveSubTab("milanuncios")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      portalActiveSubTab === "milanuncios"
                        ? "bg-amber-600 text-white shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Milanuncios
                  </button>
                  <button
                    onClick={() => setPortalActiveSubTab("web")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      portalActiveSubTab === "web"
                        ? "bg-purple-600 text-white shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Web Orlando
                  </button>
                </div>

                {portalResults && (
                  <button
                    onClick={() =>
                      copyToClipboard(
                        portalResults[portalActiveSubTab],
                        `portal_${portalActiveSubTab}`
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600 hover:text-white text-xs font-bold transition-colors"
                  >
                    {copiedKey === `portal_${portalActiveSubTab}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar al Portapapeles</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Text content */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[460px] overflow-y-auto">
                {portalResults ? (
                  portalResults[portalActiveSubTab]
                ) : (
                  <p className="text-slate-500 italic">Haz clic en generar para obtener los textos.</p>
                )}
              </div>
            </div>

            {portalResults && (
              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 text-[11px] text-blue-300 flex items-center justify-between">
                <span>
                  💡 <strong>Tip Comercial:</strong> Cuota estimada calculada:{" "}
                  <strong>{portalResults.estimatedCuota} €/mes</strong> sin entrada. Mención REBU
                  incorporada.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: AGENTE VENTAS & LEADS WHATSAPP                                     */}
      {/* ========================================================================= */}
      {activeTab === "whatsapp" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Query */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Consulta del Cliente</h3>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                WHATSAPP CLOSER
              </span>
            </div>

            <form onSubmit={handleGenerateLead} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Nombre del Cliente (Opcional)
                  </label>
                  <input
                    type="text"
                    value={leadClientName}
                    onChange={(e) => setLeadClientName(e.target.value)}
                    placeholder="Ej. Carlos"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Vehículo Consultado
                  </label>
                  <input
                    type="text"
                    value={leadVehicle}
                    onChange={(e) => setLeadVehicle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Preguntas habituales (clic para rellenar rápido):
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <button
                    type="button"
                    onClick={() =>
                      setLeadQuestion("Hola buenas, ¿sigue disponible el coche? ¿Y aceptáis coche a cambio?")
                    }
                    className="text-[10px] px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                  >
                    ¿Disponible + Aceptan coche?
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setLeadQuestion("¿Cuánto se quedaría financiado sin entrada a 5 o 6 años?")
                    }
                    className="text-[10px] px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                  >
                    Simulación financiación
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setLeadQuestion("Hola, ¿el precio se puede negociar un poco o es el último precio?")
                    }
                    className="text-[10px] px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                  >
                    ¿Rebaja de precio?
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setLeadQuestion("¿Qué garantía dais y cómo se entrega el coche?")
                    }
                    className="text-[10px] px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                  >
                    Garantía y entrega
                  </button>
                </div>

                <textarea
                  rows={3}
                  value={leadQuestion}
                  onChange={(e) => setLeadQuestion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white leading-relaxed"
                  placeholder="Pega aquí el mensaje exacto que te mandó el cliente por WhatsApp..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 hover:brightness-110 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generar Respuesta de Cierre</span>
              </button>
            </form>
          </div>

          {/* Right Preview: Generated WhatsApp Messages */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Respuesta Comercial para WhatsApp</span>
              </h3>
              {leadReply && (
                <button
                  onClick={() => copyToClipboard(leadReply.fullMessage, "lead_full")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white text-xs font-bold transition-colors"
                >
                  {copiedKey === "lead_full" ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar para WhatsApp</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {leadReply ? (
              <div className="space-y-4">
                {/* Full Message Box formatted like WhatsApp */}
                <div className="p-4 rounded-2xl bg-[#0b141a] border border-[#202c33] text-xs text-[#e9edef] space-y-3 relative shadow-inner">
                  <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Mensaje Completo (Cierre de Cita & Argumentario)
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed font-sans text-xs bg-[#1f2c34] p-3.5 rounded-xl border border-[#2a3942]">
                    {leadReply.fullMessage}
                  </div>
                </div>

                {/* Quick 2-line Message */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">
                      ⚡ Opción Rápida (Para responder al vuelo desde el móvil):
                    </span>
                    <button
                      onClick={() => copyToClipboard(leadReply.quickMessage, "lead_quick")}
                      className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      {copiedKey === "lead_quick" ? "¡Copiado!" : "Copiar"}
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 italic">"{leadReply.quickMessage}"</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Rellena la pregunta del cliente para ver la respuesta.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: AGENTE TASADOR EXPRESS & REBU                                     */}
      {/* ========================================================================= */}
      {activeTab === "tasador" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Inputs */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Vehículo a Tasar (Compra VO)</h3>
              </div>
              <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                MARGEN REBU
              </span>
            </div>

            <form onSubmit={handleCalculateTasacion} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Marca
                  </label>
                  <input
                    type="text"
                    value={tasacionInput.make}
                    onChange={(e) =>
                      setTasacionInput({ ...tasacionInput, make: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Modelo
                  </label>
                  <input
                    type="text"
                    value={tasacionInput.model}
                    onChange={(e) =>
                      setTasacionInput({ ...tasacionInput, model: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Año Matriculación
                  </label>
                  <input
                    type="number"
                    value={tasacionInput.year}
                    onChange={(e) =>
                      setTasacionInput({
                        ...tasacionInput,
                        year: parseInt(e.target.value) || 2018,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Kilómetros
                  </label>
                  <input
                    type="number"
                    value={tasacionInput.km}
                    onChange={(e) =>
                      setTasacionInput({
                        ...tasacionInput,
                        km: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Estado de Chapa / Mecánica
                  </label>
                  <select
                    value={tasacionInput.condition}
                    onChange={(e: any) =>
                      setTasacionInput({ ...tasacionInput, condition: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="impecable">Impecable (Sin roces)</option>
                    <option value="bueno">Bueno (Desgaste habitual)</option>
                    <option value="regular">Regular (Requiere pintura/ruedas)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    ¿Cuánto pide el cliente? (€)
                  </label>
                  <input
                    type="number"
                    value={tasacionInput.askingPrice}
                    onChange={(e) =>
                      setTasacionInput({
                        ...tasacionInput,
                        askingPrice: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs shadow-lg shadow-amber-600/30 hover:brightness-110 flex items-center justify-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                <span>Calcular Tasación y Margen REBU</span>
              </button>
            </form>
          </div>

          {/* Right Preview: Valuation Metrics & Script */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            {tasacionResult && (
              <>
                {/* 4 Financial Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold block">PVP MERCADO VO</span>
                    <span className="text-base font-black text-white mt-1 block">
                      {tasacionResult.pvpEstimado.toLocaleString("es-ES")} €
                    </span>
                    <span className="text-[9px] text-slate-400">Referencia venta</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-amber-500 font-bold block">REACONDICIONAMIENTO</span>
                    <span className="text-base font-black text-amber-400 mt-1 block">
                      -{tasacionResult.totalReacondicionamiento.toLocaleString("es-ES")} €
                    </span>
                    <span className="text-[9px] text-slate-400">Taller + DGT + Póliza</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-emerald-500 font-bold block">MARGEN ORLANDO</span>
                    <span className="text-base font-black text-emerald-400 mt-1 block">
                      +{tasacionResult.margenObjetivo.toLocaleString("es-ES")} €
                    </span>
                    <span className="text-[9px] text-slate-400">Beneficio seguro</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-800/60 shadow-lg">
                    <span className="text-[10px] text-cyan-400 font-bold block">OFERTA SEGURA</span>
                    <span className="text-base font-black text-cyan-300 mt-1 block">
                      {tasacionResult.ofertaInicial.toLocaleString("es-ES")} €
                    </span>
                    <span className="text-[9px] text-cyan-400/80">
                      Techo: {tasacionResult.techoMaximo.toLocaleString("es-ES")} €
                    </span>
                  </div>
                </div>

                {/* Argumentation Script for Customer */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Argumentario para Explicar la Tasación al Cliente:</span>
                    </h4>
                    <button
                      onClick={() => copyToClipboard(tasacionResult.argumentario, "tasacion_arg")}
                      className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      {copiedKey === "tasacion_arg" ? "¡Copiado!" : "Copiar Argumentario"}
                    </button>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                    {tasacionResult.argumentario}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: AGENTE MARKETING, REELS & ADS                                      */}
      {/* ========================================================================= */}
      {activeTab === "marketing" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Coche para Campaña / Vídeo</h3>
              </div>
              <span className="text-[10px] text-purple-400 font-bold bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                REELS & TIKTOK
              </span>
            </div>

            <form onSubmit={handleGenerateMarketing} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Vehículo a promocionar
                </label>
                <input
                  type="text"
                  value={marketingCar}
                  onChange={(e) => setMarketingCar(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Precio PVP (€)
                </label>
                <input
                  type="number"
                  value={marketingPrice}
                  onChange={(e) => setMarketingPrice(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  3 Extras visuales que deben salir en el vídeo
                </label>
                <textarea
                  rows={2}
                  value={marketingExtras}
                  onChange={(e) => setMarketingExtras(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-lg shadow-purple-600/30 hover:brightness-110 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generar Guion de Vídeo & Copy de Anuncio</span>
              </button>
            </form>
          </div>

          {/* Right Preview */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            {marketingResult && (
              <>
                {/* Reel Script */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5" />
                      <span>Guion de Grabación en Campa (30s)</span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(marketingResult.reelScript, "marketing_reel")}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      {copiedKey === "marketing_reel" ? "¡Copiado!" : "Copiar Guion"}
                    </button>
                  </div>
                  <div className="text-xs text-slate-300 font-mono whitespace-pre-wrap bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed max-h-56 overflow-y-auto">
                    {marketingResult.reelScript}
                  </div>
                </div>

                {/* Meta Ad Copy */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                      <Megaphone className="w-3.5 h-3.5" />
                      <span>Copy para Anuncio de Facebook / Instagram Ads</span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(marketingResult.metaAdCopy, "marketing_ad")}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      {copiedKey === "marketing_ad" ? "¡Copiado!" : "Copiar Anuncio"}
                    </button>
                  </div>
                  <div className="text-xs text-slate-300 whitespace-pre-wrap bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                    {marketingResult.metaAdCopy}
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">{marketingResult.hashtags}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: CHAT CON NEXO                                                      */}
      {/* ========================================================================= */}
      {activeTab === "chat" && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[580px]">
          {/* Top Chat Bar */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Nexo — Inteligencia Operativa</h3>
                <p className="text-[10px] text-slate-400">
                  Responde consultas legales (REBU/DGT), tácticas comerciales o redacta textos
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3.5">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-2.5 ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
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
            {isChatLoading && (
              <div className="flex items-center gap-2 text-xs text-cyan-400 italic">
                <Bot className="w-4 h-4 animate-spin" />
                <span>Nexo analizando y procesando respuesta...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSendChat}
            className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Pregúntale a Nexo sobre tasaciones, cómo rebatir a un cliente o dudas del REBU..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={isChatLoading}
              className="p-2.5 rounded-xl bg-cyan-600 text-white hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-600/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Modal for Gemini API Key */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                <span>Conectar tu propia API de Gemini</span>
              </h3>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              El sistema ya funciona al 100% de forma autónoma con el motor automotriz de Orlando
              Cars. Si quieres conectar tu propia clave gratuita de Google Gemini para respuestas
              completamente libres en el chat, pégala aquí:
            </p>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
            <div className="flex items-center justify-between pt-2">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Conseguir API Key gratis en Google</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={handleSaveKey}
                className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs hover:bg-cyan-500"
              >
                Guardar Clave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
