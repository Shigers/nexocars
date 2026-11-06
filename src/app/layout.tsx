import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "Nexo-Car | Software ERP & CRM para Compraventas de Vehículos",
  description: "Plataforma integral de gestión de stock, tasaciones, márgenes REBU, publicaciones multi-portal y CRM para Orlando Cars y Loewe Cars.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-[#070b13] text-slate-100 flex overflow-x-hidden">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
