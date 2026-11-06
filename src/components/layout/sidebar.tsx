"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Car,
  ShoppingBag,
  Receipt,
  Users,
  KanbanSquare,
  Calendar,
  BadgeDollarSign,
  Share2,
  MessageSquare,
  FileText,
  FileSpreadsheet,
  Bot,
  BarChart3,
  Settings,
  ChevronDown,
  Building2,
  ShieldCheck,
  PlusCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Globe,
  Video,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

const mainNavItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Web de Ventas", href: "/catalog", icon: Globe, badge: "Público", badgeColor: "bg-cyan-500/20 text-cyan-300" },
  { name: "Video Tour", href: "/tour", icon: Video, badge: "Demo", badgeColor: "bg-purple-500/20 text-purple-300" },
  { name: "Inventario", href: "/vehicles", icon: Car, badge: "Stock Real" },
  { name: "Nuevo Vehículo", href: "/vehicles/new", icon: PlusCircle },
  { name: "Compras & Tasación", href: "/purchases", icon: ShoppingBag },
  { name: "Gastos & Costes", href: "/expenses", icon: Receipt },
  { name: "Clientes", href: "/customers", icon: Users },
  { name: "CRM Pipeline", href: "/crm", icon: KanbanSquare, badge: "4 Leads", badgeColor: "bg-blue-500/20 text-blue-400" },
  { name: "Agenda & Citas", href: "/calendar", icon: Calendar, badge: "3 Hoy", badgeColor: "bg-amber-500/20 text-amber-400" },
  { name: "Ventas", href: "/sales", icon: BadgeDollarSign },
  { name: "Publicaciones", href: "/publications", icon: Share2, badge: "5 Portales" },
  { name: "WhatsApp Business", href: "/whatsapp", icon: MessageSquare, badge: "Live", badgeColor: "bg-emerald-500/20 text-emerald-400" },
  { name: "Documentos", href: "/documents", icon: FileText },
  { name: "Facturación & REBU", href: "/invoices", icon: FileSpreadsheet },
  { name: "Asistente IA", href: "/ai-assistant", icon: Bot, badge: "GPT-4o", badgeColor: "bg-purple-500/20 text-purple-400" },
  { name: "Estadísticas", href: "/analytics", icon: BarChart3 },
  { name: "Configuración", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [currentCompany, setCurrentCompany] = useState("Orlando Cars");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const companies = [
    { name: "Orlando Cars", label: "Sede Central (Alcalá)", icon: "OC" },
    { name: "Loewe Cars", label: "Showroom Premium (Pozuelo)", icon: "LC" },
  ];

  return (
    <aside
      className={`${
        collapsed ? "w-[72px]" : "w-64"
      } bg-[#070b13] border-r border-slate-800/80 flex flex-col h-screen sticky top-0 z-30 select-none transition-all duration-200 ease-in-out`}
    >
      {/* Brand Header */}
      <div className="p-3 border-b border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-700 via-indigo-900 to-slate-950 border border-blue-500/40 flex items-center justify-center p-1.5 shadow-lg shadow-blue-900/30 flex-shrink-0">
              <svg viewBox="0 0 512 512" className="w-full h-full drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]">
                <path d="M 256 65 L 375 110 C 375 220, 310 295, 256 325 C 202 295, 137 220, 137 110 Z" fill="#091024" stroke="#38bdf8" strokeWidth="18" />
                <path d="M 175 210 Q 200 160, 256 160 Q 312 160, 337 210" fill="none" stroke="#ffffff" strokeWidth="24" strokeLinecap="round" />
                <path d="M 165 210 L 200 235 L 312 235 L 347 210" fill="none" stroke="#60a5fa" strokeWidth="14" strokeLinecap="round" />
                <circle cx="195" cy="225" r="14" fill="#38bdf8" />
                <circle cx="317" cy="225" r="14" fill="#38bdf8" />
              </svg>
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base tracking-tight text-white">NEXO<span className="text-cyan-400">CAR</span></span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">PRO</span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium truncate">Orlando Cars &amp; Loewe</span>
              </div>
            )}
          </div>

          {/* Collapse / Expand Toggle Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all flex-shrink-0"
            title={collapsed ? "Expandir menú lateral" : "Plegar menú para ganar pantalla"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Company Switcher */}
        {!collapsed ? (
          <div className="mt-3 relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all text-left text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Building2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-slate-200 truncate">{currentCompany}</p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {currentCompany === "Orlando Cars" ? "Grupo Orlando" : "División Alta Gama"}
                  </p>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-1" />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1.5 rounded-lg bg-slate-900 border border-slate-800 shadow-2xl py-1 z-50">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Cambiar Concesionario
                </div>
                {companies.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setCurrentCompany(c.name);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800/80 transition-colors ${
                      currentCompany === c.name ? "bg-blue-600/15 text-blue-400" : "text-slate-300"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-medium">{c.name}</p>
                      <p className="text-[10px] text-slate-400">{c.label}</p>
                    </div>
                    {currentCompany === c.name && <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-2 flex justify-center">
            <button
              onClick={() => {
                const next = currentCompany === "Orlando Cars" ? "Loewe Cars" : "Orlando Cars";
                setCurrentCompany(next);
              }}
              title={`Activo: ${currentCompany}. Clic para alternar.`}
              className="w-10 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 font-bold text-[10px] flex items-center justify-center hover:bg-blue-600/30 transition-colors"
            >
              {currentCompany === "Orlando Cars" ? "OC" : "LC"}
            </button>
          </div>
        )}
      </div>

      {/* Navigation Scroll */}
      <nav className={`flex-1 overflow-y-auto ${collapsed ? "px-2 py-3" : "px-3 py-3"} space-y-1`}>
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href) && item.href !== "/vehicles/new");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? `${item.name}${item.badge ? ` (${item.badge})` : ""}` : undefined}
              className={`flex items-center ${
                collapsed ? "justify-center p-2.5" : "justify-between px-3 py-2.5"
              } rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? "bg-gradient-to-r from-blue-600/20 to-blue-500/10 text-white font-semibold border-l-2 border-blue-500"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-300"
                  }`}
                />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </div>
              {!collapsed && item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                    item.badgeColor || "bg-slate-800 text-slate-300"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Live AI Status Pill */}
      {!collapsed ? (
        <div className="p-3 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-gradient-to-b from-slate-900 to-[#0c1424] border border-blue-900/30">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-semibold text-slate-200 flex items-center gap-1">
                Copiloto Automotriz
                <Sparkles className="w-3 h-3 text-purple-400" />
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              6 vehículos analizados. 1 alerta de stock parado (&gt;40 días).
            </p>
          </div>
        </div>
      ) : (
        <div className="p-2 border-t border-slate-800/80 flex justify-center">
          <span className="relative flex h-3 w-3" title="Copiloto Activo">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>
      )}
    </aside>
  );
}
