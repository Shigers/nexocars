export type BotId = string;

export interface BotStatus {
  id: string;
  name: string;
  tagline: string;
  avatar: string;
  role: string;
  color: string;
  badgeColor: string;
  status: "ONLINE" | "BUSY" | "STANDBY" | "ALERT";
  activeTasks: number;
  completedTasks: number;
  accuracyRate: string;
  lastAction: string;
  isCustom?: boolean;
  promptInstructions?: string;
}

export interface OperationalLog {
  id: string;
  timestamp: string;
  botId: BotId;
  botName: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
  details?: string;
}

export interface NetworkNode {
  id: string;
  name: string;
  ip: string;
  category: "router" | "printer" | "workstation" | "server" | "wifi_campa";
  status: "up" | "degraded" | "down";
  latency: number;
  lastChecked: string;
}

export interface SocialDraft {
  id: string;
  vehicle: string;
  platform: "instagram" | "tiktok" | "facebook";
  type: "reel" | "post" | "story";
  hook: string;
  body: string;
  hashtags: string[];
  cta: string;
  status: "draft" | "approved" | "published";
  division: "orlando" | "loewe";
}

export interface PendingIngestion {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  fuel: string;
  photosCount: number;
  status: "ready" | "missing_photos" | "syndicating" | "syndicated";
  portals: string[];
}
