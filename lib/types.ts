export type UserRole = "admin" | "sales" | "support";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type LeadStatus = "New" | "Hot" | "Closed" | "Follow Up";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: LeadStatus;
  source: string;
  lastContacted: string;
  value: number;
}

export type ConversationIntent = "Buying" | "Pricing" | "Support" | "General";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string; // 'system' | 'ai' | 'customer' | userId
  senderType: "user" | "customer" | "ai" | "system";
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  leadId: string;
  leadName: string;
  lastMessage: string;
  unreadCount: number;
  intent: ConversationIntent;
  status: "active" | "archived";
  timestamp: string;
  platform: "whatsapp" | "web" | "sms";
}

export interface Sale {
  id: string;
  leadId: string;
  amount: number;
  productName: string;
  date: string;
  status: "completed" | "pending" | "cancelled";
}

export interface AnalyticsData {
  totalChats: number;
  newLeads: number;
  salesClosed: number;
  revenue: number;
  revenueByDay: { date: string; value: number }[];
  salesOverTime: { date: string; value: number }[];
  leadSources: { name: string; value: number }[];
  conversionRate: { date: string; value: number }[];
}
