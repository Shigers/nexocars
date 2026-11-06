"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicCatalog = pathname?.startsWith("/catalog");

  if (isPublicCatalog) {
    return <div className="min-h-screen bg-[#070b13] w-full">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex overflow-x-hidden w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-[#090d14]">
        <Header />
        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 overflow-y-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
