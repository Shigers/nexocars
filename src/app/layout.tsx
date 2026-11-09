import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { SplashScreen } from "@/components/layout/splash-screen";

export const viewport: Viewport = {
  themeColor: "#090d14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Nexo-Car | Software ERP & CRM para Compraventas de Vehículos",
  description: "Plataforma integral de gestión de stock, tasaciones, márgenes REBU, publicaciones multi-portal y CRM para Orlando Cars y Loewe Cars.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Nexo-Car",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
              try {
                var theme = localStorage.getItem('nexocar_theme');
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                }
              } catch(e) {}
            })();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-[#070b13] text-slate-900 dark:text-slate-100 flex overflow-x-hidden transition-colors duration-200">
        <SplashScreen />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
