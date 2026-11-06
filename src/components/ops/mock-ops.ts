import { BotStatus, OperationalLog, NetworkNode, SocialDraft, PendingIngestion } from "./types";

export const INITIAL_BOTS: BotStatus[] = [
  {
    id: "chief",
    name: "Nexo-Chief",
    tagline: "Jefe Supervisor & Coordinador General",
    avatar: "👔",
    role: "Orquestación, SLAs y Resumen Ejecutivo",
    color: "from-indigo-600 via-purple-600 to-pink-600",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    status: "ONLINE",
    activeTasks: 2,
    completedTasks: 48,
    accuracyRate: "99.8%",
    lastAction: "Generando briefing matinal para Shigeru"
  },
  {
    id: "stock",
    name: "Stock-Ingestor",
    tagline: "Gestor de Ingesta & Multi-Plataformas",
    avatar: "🚗",
    role: "OCR Fichas, Validaciones & Feeds XML",
    color: "from-blue-600 via-cyan-600 to-teal-500",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    status: "ONLINE",
    activeTasks: 3,
    completedTasks: 134,
    accuracyRate: "100%",
    lastAction: "Sincronizado Feed Coches.net y Wallapop"
  },
  {
    id: "social",
    name: "Social-Copilot",
    tagline: "Marketing, Reels & Copywriting",
    avatar: "📱",
    role: "Guiones TikTok/Reels, Facebook Ads & Stories",
    color: "from-pink-600 via-rose-600 to-amber-500",
    badgeColor: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    status: "STANDBY",
    activeTasks: 1,
    completedTasks: 92,
    accuracyRate: "98.5%",
    lastAction: "Borrador de Reel para Mercedes Vito Camper"
  },
  {
    id: "network",
    name: "Net-Sentinel",
    tagline: "Monitor LAN, Web & Infraestructura",
    avatar: "📡",
    role: "Ping 24/7, Impresoras, Router & Wi-Fi Campa",
    color: "from-emerald-600 via-teal-600 to-cyan-500",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    status: "ONLINE",
    activeTasks: 5,
    completedTasks: 840,
    accuracyRate: "100%",
    lastAction: "Escaneo de latencia en Pol. Ind. Fuente del Jarro"
  }
];

export const INITIAL_NODES: NetworkNode[] = [
  {
    id: "node-1",
    name: "Router Fibra Movistar Pro (Oficinas)",
    ip: "192.168.1.1",
    category: "router",
    status: "up",
    latency: 2,
    lastChecked: "Hace 10 seg"
  },
  {
    id: "node-2",
    name: "Impresora Contratos HP LaserJet (Ventas)",
    ip: "192.168.1.45",
    category: "printer",
    status: "up",
    latency: 5,
    lastChecked: "Hace 30 seg"
  },
  {
    id: "node-3",
    name: "Terminal TPV Bancario (Caja Paterna)",
    ip: "192.168.1.80",
    category: "workstation",
    status: "up",
    latency: 8,
    lastChecked: "Hace 1 min"
  },
  {
    id: "node-4",
    name: "Punto de Acceso Wi-Fi Campa Exterior (Coches)",
    ip: "192.168.1.120",
    category: "wifi_campa",
    status: "up",
    latency: 18,
    lastChecked: "Hace 15 seg"
  },
  {
    id: "node-5",
    name: "Web Producción Vercel Edge (nexocars.vercel.app)",
    ip: "76.76.21.21",
    category: "server",
    status: "up",
    latency: 22,
    lastChecked: "Hace 5 seg"
  },
  {
    id: "node-6",
    name: "Web Oficial Orlando Cars (orlandocars.es)",
    ip: "185.166.212.44",
    category: "server",
    status: "up",
    latency: 28,
    lastChecked: "Hace 15 seg"
  }
];

export const INITIAL_DRAFTS: SocialDraft[] = [
  {
    id: "soc-1",
    vehicle: "Seat León 2.0 TDI 150CV DSG (2020)",
    platform: "instagram",
    type: "reel",
    hook: "¿Buscando coche fiable por menos de 220€ al mes? Mira esta unidad que acaba de entrar en Paterna 🔥",
    body: "Acabado Style Plus con cambio automático DSG7, pantalla táctil con Full Link (Apple CarPlay / Android Auto), control de crucero adaptativo y solo 94.000 km certificados con historial sellado.\n\n✅ 1 Año de Garantía Oro incluida.\n✅ Revisión de 150 puntos en nuestro taller propio.\n✅ Financiación a medida sin entrada.",
    hashtags: ["#OrlandoCars", "#ValenciaCoches", "#Paterna", "#SeatLeon", "#CochesOcasión", "#SeatDSG"],
    cta: "Escríbenos por WhatsApp al 658 803 533 o ven a probarlo a Carrer de la Ciutat de Llíria 61, Paterna.",
    status: "ready" as any,
    division: "orlando"
  },
  {
    id: "soc-2",
    vehicle: "Audi Q5 40 TDI quattro S-Line (2021)",
    platform: "tiktok",
    type: "reel",
    hook: "La elegancia del SUV premium definitivo con tracción quattro. Te mostramos cada detalle del Audi Q5 S-Line ✨",
    body: "Toma 1: Apertura de puerta y vista del volante achatado S-Line.\nToma 2: Encendido de Virtual Cockpit en cuadro digital.\nToma 3: Sonido de motor 204CV Mild-Hybrid con etiqueta ECO.\nToma 4: Vista de llantas de 20 pulgadas y faros Matrix LED.",
    hashtags: ["#LoeweCars", "#AudiQ5", "#SUVdeLujo", "#CochesValencia", "#AudiSLine", "#EtiquetaECO"],
    cta: "Reserva cita VIP para prueba dinámica en Loewe Cars (Paterna). Link en bio.",
    status: "approved",
    division: "loewe"
  }
];

export const INITIAL_INGESTIONS: PendingIngestion[] = [
  {
    id: "ing-1",
    plate: "3491-KXZ",
    brand: "Seat",
    model: "León 2.0 TDI 150CV DSG",
    year: 2020,
    fuel: "Diésel (C)",
    photosCount: 16,
    status: "ready",
    portals: ["Web Orlando", "Coches.net", "Wallapop", "Milanuncios", "Autocasión"]
  },
  {
    id: "ing-2",
    plate: "5582-LPM",
    brand: "Mercedes-Benz",
    model: "Vito 111 CDI Larga 9 Plazas",
    year: 2019,
    fuel: "Diésel (C)",
    photosCount: 8,
    status: "missing_photos",
    portals: ["Web Orlando", "Wallapop", "Motor.es"]
  },
  {
    id: "ing-3",
    plate: "9134-MBN",
    brand: "Audi",
    model: "Q5 40 TDI quattro S-Line",
    year: 2021,
    fuel: "Híbrido MHEV (ECO)",
    photosCount: 22,
    status: "syndicated",
    portals: ["Web Loewe Cars", "Coches.net", "Wallapop", "Autocasión", "Facebook"]
  }
];
