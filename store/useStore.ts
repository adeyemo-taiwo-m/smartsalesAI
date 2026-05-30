import { create } from "zustand";
import { User, Lead, Message, Sale, DashboardStats, LeadStatus, Channel, IntentTag } from "@/lib/types";
import { MOCK_USERS, MOCK_LEADS, MOCK_MESSAGES, MOCK_SALES, MOCK_STATS } from "@/lib/mock-data";

export interface ToastItem {
  id: string;
  type: "success" | "info" | "error";
  title: string;
  description: string;
}

interface AppState {
  // Auth & UI state
  user: User | null;
  sidebarOpen: boolean;
  theme: "light" | "dark";
  toggleSidebar: () => void;
  setUser: (user: User | null) => void;
  setTheme: (theme: "light" | "dark") => void;
  login: () => void;
  logout: () => void;

  // Custom Toast State
  toasts: ToastItem[];
  addToast: (type: "success" | "info" | "error", title: string, description: string) => void;
  removeToast: (id: string) => void;

  // SmartSales AI State
  leads: Lead[];
  conversations: Record<string, Message[]>; // Keyed by leadId
  selectedLeadId: string | null;
  isAIMode: boolean;
  sales: Sale[];
  stats: DashboardStats;

  // Actions
  setSelectedLeadId: (id: string | null) => void;
  sendMessage: (leadId: string, content: string, sender: "customer" | "ai" | "agent", intentTag?: IntentTag) => void;
  toggleAIMode: () => void;
  addLead: (lead: Omit<Lead, "id" | "lastMessageTime" | "lastMessage" | "unreadCount" | "intentTags"> & { intentTags?: IntentTag[] }) => void;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  addSale: (sale: Omit<Sale, "id" | "date">) => void;
  clearUnreadCount: (leadId: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Auth & UI Defaults
  user: MOCK_USERS[0],
  sidebarOpen: true,
  theme: "dark", // Locked to dark mode by default
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
  login: () => set({ user: MOCK_USERS[0] }),
  logout: () => set({ user: null }),

  // Custom Toasts Logic
  toasts: [],
  addToast: (type, title, description) => {
    const id = `toast-${Date.now()}`;
    const newToast = { id, type, title, description };
    set((state) => ({ toasts: [...state.toasts, newToast] }));
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  // SmartSales State Initialization
  leads: MOCK_LEADS,
  conversations: MOCK_MESSAGES,
  selectedLeadId: MOCK_LEADS[0]?.id || null,
  isAIMode: true,
  sales: MOCK_SALES,
  stats: MOCK_STATS,

  // Set Selected Lead
  setSelectedLeadId: (id) => {
    set({ selectedLeadId: id });
    if (id) {
      get().clearUnreadCount(id);
    }
  },

  // Clear Unread Count
  clearUnreadCount: (leadId) => {
    set((state) => ({
      leads: state.leads.map((l) =>
        l.id === leadId ? { ...l, unreadCount: 0 } : l
      ),
    }));
  },

  // Send Message
  sendMessage: (leadId, content, sender, intentTag) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      leadId,
      sender,
      content,
      timestamp: new Date().toISOString(),
      intentTag,
    };

    const targetLead = get().leads.find((l) => l.id === leadId);

    set((state) => {
      const previousMessages = state.conversations[leadId] || [];
      const updatedMessages = [...previousMessages, newMessage];

      // Update lead preview details
      const updatedLeads = state.leads.map((l) => {
        if (l.id === leadId) {
          return {
            ...l,
            lastMessage: content,
            lastMessageTime: newMessage.timestamp,
            unreadCount: sender === "customer" && state.selectedLeadId !== leadId ? l.unreadCount + 1 : l.unreadCount,
          };
        }
        return l;
      });

      return {
        conversations: {
          ...state.conversations,
          [leadId]: updatedMessages,
        },
        leads: updatedLeads,
      };
    });

    // Fire unread message notifications when arriving in the background!
    if (sender === "customer" && get().selectedLeadId !== leadId && targetLead) {
      get().addToast(
        "info",
        `New ${targetLead.channel === "whatsapp" ? "WhatsApp" : targetLead.channel === "instagram" ? "Instagram" : "Web"} Inquiry`,
        `"${content.substring(0, 35)}${content.length > 35 ? "..." : ""}" from ${targetLead.name}`
      );
    }

    // Auto-Simulate AI Responses when customer sends a message and AI mode is active
    if (sender === "customer" && get().isAIMode) {
      setTimeout(() => {
        const intents: IntentTag[] = ["Pricing", "Buying", "Support", "Inquiry", "Complaint"];
        const randomIntent = intents[Math.floor(Math.random() * intents.length)];
        
        let aiReply = "Thank you for reaching out! I am Aria, your AI Sales Assistant. Let me look up that information for you. ⚡";
        if (content.toLowerCase().includes("pricing") || content.toLowerCase().includes("price") || content.toLowerCase().includes("cost")) {
          aiReply = "Our Premium Ankara bundles are priced at ₦35,000, and our Skincare Glow Kits go for ₦27,000. We ship nationwide! Would you like me to process an order for you? 📦";
        } else if (content.toLowerCase().includes("buy") || content.toLowerCase().includes("order") || content.toLowerCase().includes("purchase")) {
          aiReply = "Excellent choice! I can create an invoice for you right away. Delivery inside Lagos is ₦2,500 and takes 24 hours. Please confirm your delivery address! 🛍️";
        } else if (content.toLowerCase().includes("error") || content.toLowerCase().includes("fail") || content.toLowerCase().includes("not working")) {
          aiReply = "I am sorry to hear you are experiencing an error. I have alerted our technical support agent to take a look immediately, and they will join the chat. 🛠️";
        }

        get().sendMessage(leadId, aiReply, "ai", randomIntent);
      }, 1800);
    }
  },

  // Toggle AI Mode
  toggleAIMode: () => {
    const nextMode = !get().isAIMode;
    set({ isAIMode: nextMode });
    get().addToast(
      "info",
      nextMode ? "🤖 AI Mode Activated" : "🧑‍💼 Human Takeover Mode",
      nextMode ? "Aria will now automatically reply to incoming messages." : "You have full control of all replies now."
    );
  },

  // Add Lead
  addLead: (lead) => {
    const newLead: Lead = {
      ...lead,
      id: `l-${Date.now()}`,
      lastMessage: "Lead added to pipeline",
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      intentTags: lead.intentTags || ["Inquiry"],
    };

    set((state) => ({
      leads: [newLead, ...state.leads],
      stats: {
        ...state.stats,
        newLeads: state.stats.newLeads + 1,
      },
    }));

    get().addToast("success", "Lead Added Pipeline", `${lead.name} has been successfully recorded.`);
  },

  // Update Lead Status
  updateLeadStatus: (leadId, status) => {
    const lead = get().leads.find((l) => l.id === leadId);
    
    set((state) => {
      const updatedLeads = state.leads.map((l) =>
        l.id === leadId ? { ...l, status } : l
      );

      const isNewlyClosed = status === "closed" && state.leads.find((l) => l.id === leadId)?.status !== "closed";
      
      return {
        leads: updatedLeads,
        stats: {
          ...state.stats,
          salesClosed: isNewlyClosed ? state.stats.salesClosed + 1 : state.stats.salesClosed,
        },
      };
    });

    if (lead) {
      get().addToast("success", "Stage Moved", `${lead.name} updated to ${status.toUpperCase()} stage.`);
    }
  },

  // Add Sale
  addSale: (sale) => {
    const newSale: Sale = {
      ...sale,
      id: `s-${Date.now()}`,
      date: new Date().toISOString(),
    };

    set((state) => ({
      sales: [newSale, ...state.sales],
      stats: {
        ...state.stats,
        salesClosed: sale.status === "completed" ? state.stats.salesClosed + 1 : state.stats.salesClosed,
        revenueGenerated: sale.status === "completed" ? state.stats.revenueGenerated + sale.amount : state.stats.revenueGenerated,
      },
    }));

    get().addToast("success", "Payment Captured Ledger", `₦${sale.amount.toLocaleString()} received from ${sale.customer}! 💰`);
  },
}));
