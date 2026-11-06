"use client";

import { useState } from "react";
import { Users, Plus, Search, Phone, Mail, MapPin, Car } from "lucide-react";
import { mockLeads } from "@/lib/mock-data";

export default function CustomersPage() {
  const customers = [
    {
      id: "c-1",
      name: "Carlos Mendoza Silva",
      dni: "51982301K",
      phone: "+34 620 441 298",
      email: "carlos.mendoza@gmail.com",
      city: "Madrid",
      type: "Particular",
      vehicleInterest: "Mercedes-Benz Clase A 200d",
      totalPurchases: 0,
    },
    {
      id: "c-2",
      name: "Beatriz Fernández Morales",
      dni: "02918234L",
      phone: "+34 644 112 334",
      email: "b.fernandez@outlook.es",
      city: "Pozuelo de Alarcón",
      type: "Particular",
      vehicleInterest: "Audi Q5 quattro S-Line",
      totalPurchases: 0,
    },
    {
      id: "c-3",
      name: "Raúl Benítez Gómez",
      dni: "53892104M",
      phone: "+34 655 432 109",
      email: "raul.benitez@empresa.com",
      city: "Alcalá de Henares",
      type: "Autónomo",
      vehicleInterest: "Volkswagen Golf 8 (Comprado)",
      totalPurchases: 1,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Directorio de Clientes</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Base de datos de compradores, particulares, autónomos y empresas con historial de compras
          </p>
        </div>

        <button
          onClick={() => alert("Alta de nuevo cliente...")}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Nombre / Empresa</th>
              <th className="py-3 px-3">DNI / CIF</th>
              <th className="py-3 px-3">Contacto</th>
              <th className="py-3 px-3">Ubicación</th>
              <th className="py-3 px-3">Tipo</th>
              <th className="py-3 px-4">Interés / Coche Comprado</th>
              <th className="py-3 px-4 text-right">Compras</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 font-bold text-white">{c.name}</td>
                <td className="py-3 px-3 font-mono text-slate-400">{c.dni}</td>
                <td className="py-3 px-3">
                  <p className="text-slate-200">{c.phone}</p>
                  <p className="text-[10px] text-slate-400">{c.email}</p>
                </td>
                <td className="py-3 px-3 text-slate-300">{c.city}</td>
                <td className="py-3 px-3">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {c.type}
                  </span>
                </td>
                <td className="py-3 px-4 text-blue-400">{c.vehicleInterest}</td>
                <td className="py-3 px-4 text-right font-bold text-white">
                  {c.totalPurchases}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
