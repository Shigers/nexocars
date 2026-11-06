import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

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
        {/* Persistent Global Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#090d14]">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
