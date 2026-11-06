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
  { name: "Inventario", href: "/vehicles", icon: Car, badge: "6 Activos" },
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

  const companies = [
    { name: "Orlando Cars", label: "Sede Central (Alcalá)", icon: "OC" },
    { name: "Loewe Cars", label: "Showroom Premium (Pozuelo)", icon: "LC" },
  ];

  return (
    <aside className="w-64 bg-[#070b13] border-r border-slate-800/80 flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/30">
            <span className="text-xl tracking-tighter">N</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">NEXO-CAR</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">PRO</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">AutoPilot CRM & ERP</span>
          </div>
        </div>

        {/* Company Switcher */}
        <div className="mt-4 relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all text-left text-xs"
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              <div>
                <p className="font-semibold text-slate-200">{currentCompany}</p>
                <p className="text-[10px] text-slate-400">
                  {currentCompany === "Orlando Cars" ? "Grupo Orlando" : "División Alta Gama"}
                </p>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
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
      </div>

      {/* Navigation Scroll */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href) && item.href !== "/vehicles/new");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? "bg-gradient-to-r from-blue-600/20 to-blue-500/10 text-white font-semibold border-l-2 border-blue-500"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-300"
                  }`}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
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
    </aside>
  );
}
