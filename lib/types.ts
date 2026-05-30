export type UserRole = "admin" | "sales" | "support";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type Channel = "whatsapp" | "instagram" | "web";
export type LeadStatus = "new" | "hot" | "warm" | "closed" | "lost";
export type MessageSender = "customer" | "ai" | "agent";
export type IntentTag =
  | "Buying"
  | "Pricing"
  | "Support"
  | "Inquiry"
  | "Complaint";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  channel: Channel;
  status: LeadStatus;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  intentTags: IntentTag[];
}

export interface Message {
  id: string;
  leadId: string;
  sender: MessageSender;
  content: string;
  timestamp: string;
  intentTag?: IntentTag;
}

export interface Sale {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: "completed" | "pending" | "refunded";
  date: string;
  channel: Channel;
}

export interface DashboardStats {
  totalChatsToday: number;
  newLeads: number;
  salesClosed: number;
  revenueGenerated: number;
  chatsChange: number; // % vs yesterday
  leadsChange: number;
  salesChange: number;
  revenueChange: number;
}

export interface FunnelData {
  stage: string;
  count: number;
  color: string;
}

export interface RevenueChartData {
  day: string;
  revenue: number;
  leads: number;
}
