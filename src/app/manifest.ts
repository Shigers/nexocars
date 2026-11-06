import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NEXOCAR • Orlando Cars & Loewe",
    short_name: "NEXOCAR",
    description: "Plataforma integral de gestión de stock, tasaciones, publicaciones y CRM para Orlando Cars y Loewe Cars",
    start_url: "/",
    display: "standalone",
    background_color: "#070b13",
    theme_color: "#090d14",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
