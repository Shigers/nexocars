"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Plus,
  Moon,
  Sun,
  Car,
  UserCheck,
  TrendingUp,
  X,
} from "lucide-react";
import { mockVehicles, mockLeads } from "@/lib/mock-data";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Sync state with DOM & localStorage on mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const willBeDark = !isDarkMode;
    setIsDarkMode(willBeDark);
    if (willBeDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      try {
        localStorage.setItem("nexocar_theme", "dark");
      } catch (e) {}
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      try {
        localStorage.setItem("nexocar_theme", "light");
      } catch (e) {}
    }
  };

  const filteredVehicles = searchQuery
    ? mockVehicles.filter(
        (v) =>
          v.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.vin.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredLeads = searchQuery
    ? mockLeads.filter(
        (l) =>
          l.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.customer_phone.includes(searchQuery)
      )
    : [];

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#090d14]/90 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between transition-colors duration-200">
      {/* Omnibox Global Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por matrícula (ej. 4821-LXZ), bastidor, modelo o cliente..."
            value={searchQuery}
            onFocus={() => setSearchOpen(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-12 py-2 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm dark:shadow-none"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Global Search Dropdown Results */}
        {searchOpen && searchQuery.length > 0 && (
          <div className="absolute left-6 right-6 top-16 max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Resultados instantáneos
              </span>
              <button
                onClick={() => setSearchOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {filteredVehicles.length === 0 && filteredLeads.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-3 text-center">
                No se encontraron vehículos ni clientes con &ldquo;{searchQuery}&rdquo;
              </p>
            ) : (
              <div className="space-y-3">
                {filteredVehicles.length > 0 && (
                  <div>
                    <div className="text-[10px] uppercase font-bold text-blue-500 dark:text-blue-400 mb-1">
                      Vehículos en Inventario
                    </div>
                    {filteredVehicles.map((v) => (
                      <Link
                        key={v.id}
                        href={`/vehicles/${v.id}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Car className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                          <div>
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                              {v.brand} {v.model}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                              Matrícula: {v.plate} • VIN: {v.vin.slice(0, 10)}...
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {v.selling_price.toLocaleString("es-ES")} €
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                {filteredLeads.length > 0 && (
                  <div>
                    <div className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 mb-1">
                      Clientes / Leads Activos
                    </div>
                    {filteredLeads.map((l) => (
                      <Link
                        key={l.id}
                        href="/crm"
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <UserCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <div>
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                              {l.customer_name}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                              {l.customer_phone} • Interés: {l.vehicle_title || "General"}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-600 dark:text-blue-300 capitalize">
                          {l.stage.replace("_", " ")}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Add CTA */}
        <Link
          href="/vehicles/new"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Añadir Vehículo</span>
        </Link>

        {/* Dark/Light Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm dark:shadow-none"
          title={isDarkMode ? "Cambiar a Modo Claro (Día)" : "Cambiar a Modo Oscuro (Noche)"}
          aria-label="Alternar tema de interfaz"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm dark:shadow-none relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-xs text-white shadow-md">
            OC
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Orlando Cars</span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Informático / Gerencia</span>
          </div>
        </div>
      </div>
    </header>
  );
}
