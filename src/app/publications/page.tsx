"use client";

import { useState, useEffect } from "react";
import {
  Share2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Globe,
  Plus,
  Trash2,
  Code2,
  Copy,
  Check,
  Radio,
  Link as LinkIcon,
  Power,
  X,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  getStoredPortals,
  savePortal,
  deletePortal,
  togglePortalEnabled,
  getStoredVehicles,
  getVehiclePortalMatrix,
  toggleVehiclePortalPublication,
} from "@/lib/storage";
import { PortalPublication, Vehicle } from "@/types";

export default function PublicationsPage() {
  const [portals, setPortals] = useState<PortalPublication[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({});
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFeedModalOpen, setIsFeedModalOpen] = useState(false);
  const [copiedFeed, setCopiedFeed] = useState<string | null>(null);

  // New Portal Form State
  const [newPortalName, setNewPortalName] = useState("");
  const [newPortalType, setNewPortalType] = useState<"api" | "xml_feed" | "ftp" | "webhook">("xml_feed");
  const [newPortalLogo, setNewPortalLogo] = useState("🚀");
  const [newPortalUrl, setNewPortalUrl] = useState("");
  const [newPortalFrequency, setNewPortalFrequency] = useState("Cada 15 min");

  const loadData = () => {
    setPortals(getStoredPortals());
    setVehicles(getStoredVehicles());
    setMatrix(getVehiclePortalMatrix());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("nexo_storage_updated", handleUpdate);
    return () => window.removeEventListener("nexo_storage_updated", handleUpdate);
  }, []);

  const handleSyncAll = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      alert(`¡Sincronización completada! ${vehicles.length} vehículos actualizados en ${portals.filter(p => p.status === "publicado").length} plataformas activas.`);
    }, 1200);
  };

  const handleTogglePortal = (portalKey: string) => {
    const updated = togglePortalEnabled(portalKey);
    setPortals(updated);
  };

  const handleDeletePortal = (portalKey: string) => {
    if (confirm("¿Eliminar este conector de plataforma del distribuidor multi-portal?")) {
      const updated = deletePortal(portalKey);
      setPortals(updated);
    }
  };

  const handleCreatePortal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortalName.trim()) return;

    const portalKey = newPortalName.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const newPortal: PortalPublication = {
      portal: portalKey,
      name: newPortalName.trim(),
      logo: newPortalLogo || "🚗",
      status: "publicado",
      last_synced: "Recién configurado",
      type: newPortalType,
      ad_url: newPortalUrl || `https://${portalKey}.com`,
      is_custom: true,
      enabled: true,
    };

    const updated = savePortal(newPortal);
    setPortals(updated);
    setIsAddModalOpen(false);
    setNewPortalName("");
    setNewPortalUrl("");
  };

  const handleToggleVehiclePortal = (vehicleId: string, portalKey: string) => {
    toggleVehiclePortalPublication(vehicleId, portalKey);
    setMatrix(getVehiclePortalMatrix());
  };

  const isVehiclePublishedOnPortal = (vehicleId: string, portalKey: string, portalStatus: string) => {
    if (portalStatus === "retirado") return false;
    const vehMap = matrix[vehicleId];
    if (!vehMap || vehMap[portalKey] === undefined) return true; // Default true
    return vehMap[portalKey];
  };

  const handleCopyLink = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFeed(id);
    setTimeout(() => setCopiedFeed(null), 2000);
  };

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.plate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto min-w-0">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">
              Distribuidor Multi-Portal Automotriz
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-semibold border border-blue-500/30">
              {portals.filter((p) => p.status === "publicado").length} portales activos
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Publicación simultánea con Coches.net, AutoScout24, Wallapop, Milanuncios, Web y conectores a medida
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Feed Generator Button */}
          <button
            onClick={() => setIsFeedModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold hover:border-slate-700 transition-all"
          >
            <Code2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Feeds XML / JSON</span>
          </button>

          {/* Add Platform Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30 text-xs font-semibold transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Conectar Nueva Plataforma</span>
          </button>

          {/* Sync All Button */}
          <button
            onClick={handleSyncAll}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
            <span>{syncing ? "Sincronizando..." : "Sincronizar Todo"}</span>
          </button>
        </div>
      </div>

      {/* Dynamic Portals Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {portals.map((p) => {
          const isActive = p.status === "publicado";

          return (
            <div
              key={p.portal}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 relative group ${
                isActive
                  ? "bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-md"
                  : "bg-slate-950/60 border-slate-900 opacity-60 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{p.logo}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleTogglePortal(p.portal)}
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
                      isActive
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                    title="Clic para activar / pausar este portal"
                  >
                    <Power className="w-2.5 h-2.5" />
                    <span>{isActive ? "Activo" : "Pausado"}</span>
                  </button>

                  {p.is_custom && (
                    <button
                      onClick={() => handleDeletePortal(p.portal)}
                      className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Eliminar plataforma personalizada"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{p.name}</span>
                  {p.is_custom && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-normal">
                      A medida
                    </span>
                  )}
                </h3>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>{p.last_synced || "Activo"}</span>
                  <span className="text-[10px] text-blue-400 uppercase font-mono">
                    {p.type || "API"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vehicles Publication Matrix Header & Search */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Matriz Interactiva de Publicación por Bastidor
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Haz clic sobre cualquier casilla para publicar o despublicar un vehículo de una plataforma concreta en tiempo real
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrar por coche o matrícula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Matrix Table with Horizontal Scroll Safe wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 min-w-[200px]">Vehículo en Stock</th>
                {portals.map((p) => (
                  <th key={p.portal} className="py-3 px-3 text-center whitespace-nowrap min-w-[100px]">
                    <div className="flex items-center justify-center gap-1.5">
                      <span>{p.logo}</span>
                      <span className={p.status === "retirado" ? "line-through text-slate-500" : "text-slate-300"}>
                        {p.name}
                      </span>
                    </div>
                  </th>
                ))}
                <th className="py-3 px-4 text-right min-w-[120px]">Estado Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredVehicles.map((v) => {
                const activeCount = portals.filter((p) =>
                  isVehiclePublishedOnPortal(v.id, p.portal, p.status)
                ).length;

                return (
                  <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded bg-white text-slate-950 font-mono font-bold text-[11px] shadow-sm">
                          {v.plate}
                        </span>
                        <div>
                          <p className="text-white font-medium text-xs">
                            {v.brand} {v.model}
                          </p>
                          <p className="text-[10px] text-slate-400">{v.location}</p>
                        </div>
                      </div>
                    </td>

                    {/* Interactive Portal Toggles */}
                    {portals.map((p) => {
                      const published = isVehiclePublishedOnPortal(v.id, p.portal, p.status);
                      const isPortalDisabled = p.status === "retirado";

                      return (
                        <td key={p.portal} className="py-3 px-3 text-center">
                          <button
                            onClick={() => !isPortalDisabled && handleToggleVehiclePortal(v.id, p.portal)}
                            disabled={isPortalDisabled}
                            title={
                              isPortalDisabled
                                ? `Plataforma ${p.name} desactivada globalmente`
                                : published
                                ? `Publicado en ${p.name} (clic para pausar)`
                                : `Pausado en ${p.name} (clic para activar)`
                            }
                            className={`p-1.5 rounded-lg transition-all inline-flex items-center justify-center ${
                              isPortalDisabled
                                ? "opacity-20 cursor-not-allowed text-slate-600"
                                : published
                                ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 hover:scale-110"
                                : "bg-slate-800/60 text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                            }`}
                          >
                            {published && !isPortalDisabled ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      );
                    })}

                    <td className="py-3 px-4 text-right">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                          activeCount > 0
                            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                            : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {activeCount} / {portals.length} activas
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: ADD NEW PLATFORM / PORTAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Conectar Nueva Plataforma o Portal
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Integra cualquier portal que use Orlando Cars (ej. <strong>Autocasión</strong>, <strong>Motor.es</strong>, <strong>Facebook Marketplace</strong>, <strong>Coches.com</strong> o plataformas B2B).
            </p>

            <form onSubmit={handleCreatePortal} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Nombre de la Plataforma / Portal *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Autocasión, Motor.es, CarGurus..."
                  value={newPortalName}
                  onChange={(e) => setNewPortalName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Tipo de Conexión
                  </label>
                  <select
                    value={newPortalType}
                    onChange={(e) => setNewPortalType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="xml_feed">📄 Feed XML / RSS Automático</option>
                    <option value="api">⚡ API REST / Webhook</option>
                    <option value="ftp">📂 Pasarela FTP / CSV Programado</option>
                    <option value="webhook">🌐 Webhook en Tiempo Real</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Icono / Logo
                  </label>
                  <select
                    value={newPortalLogo}
                    onChange={(e) => setNewPortalLogo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="🚗">🚗 Automotriz Rojo</option>
                    <option value="🏎️">🏎️ Deportivo</option>
                    <option value="🟡">🟡 Amarillo (Autoscout/Auto)</option>
                    <option value="🟢">🟢 Verde (Wallapop/Ecológico)</option>
                    <option value="🔵">🔵 Azul Corporativo</option>
                    <option value="📱">📱 Redes Sociales / Meta</option>
                    <option value="🌐">🌐 Web / Marketplace</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  URL del Feed o Endpoint de la Plataforma
                </label>
                <input
                  type="text"
                  placeholder="https://api.portal.com/v1/stock o enlace del proveedor"
                  value={newPortalUrl}
                  onChange={(e) => setNewPortalUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Frecuencia de Actualización
                </label>
                <select
                  value={newPortalFrequency}
                  onChange={(e) => setNewPortalFrequency(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                >
                  <option value="Inmediata">Inmediata (Al guardar vehículo)</option>
                  <option value="Cada 15 min">Cada 15 minutos</option>
                  <option value="Cada 1 hora">Cada 1 hora</option>
                  <option value="Cada noche">Cada noche (00:00 h)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
                >
                  Guardar y Activar Plataforma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: XML / JSON FEEDS GENERATOR */}
      {isFeedModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  Feeds Públicos de Stock para Portales Externos
                </h3>
              </div>
              <button
                onClick={() => setIsFeedModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Copia y entrega estos enlaces a los técnicos de cualquier plataforma nueva que contrate Orlando Cars. Los feeds se generan automáticamente con los coches marcados en el catálogo:
            </p>

            <div className="space-y-3 pt-1">
              {/* Feed 1: XML */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Feed XML Estándar Automotriz (Coches.net / Ganvam / Autocasión)
                  </span>
                  <button
                    onClick={() => handleCopyLink("https://nexo-car.vercel.app/api/feeds/stock.xml", "xml")}
                    className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    {copiedFeed === "xml" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFeed === "xml" ? "Copiado" : "Copiar"}</span>
                  </button>
                </div>
                <code className="block p-2 rounded-lg bg-slate-900 text-purple-300 font-mono text-[11px] truncate">
                  https://nexo-car.vercel.app/api/feeds/stock.xml
                </code>
              </div>

              {/* Feed 2: JSON API */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    API REST JSON en Tiempo Real (Web Propia / Apps)
                  </span>
                  <button
                    onClick={() => handleCopyLink("https://nexo-car.vercel.app/api/feeds/stock.json", "json")}
                    className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    {copiedFeed === "json" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFeed === "json" ? "Copiado" : "Copiar"}</span>
                  </button>
                </div>
                <code className="block p-2 rounded-lg bg-slate-900 text-blue-300 font-mono text-[11px] truncate">
                  https://nexo-car.vercel.app/api/feeds/stock.json
                </code>
              </div>

              {/* Feed 3: Meta Facebook Catalog */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    Meta Automotive Inventory Ads (Facebook / Instagram)
                  </span>
                  <button
                    onClick={() => handleCopyLink("https://nexo-car.vercel.app/api/feeds/meta-automotive.csv", "meta")}
                    className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    {copiedFeed === "meta" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFeed === "meta" ? "Copiado" : "Copiar"}</span>
                  </button>
                </div>
                <code className="block p-2 rounded-lg bg-slate-900 text-cyan-300 font-mono text-[11px] truncate">
                  https://nexo-car.vercel.app/api/feeds/meta-automotive.csv
                </code>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsFeedModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}