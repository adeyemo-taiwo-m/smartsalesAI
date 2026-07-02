import { create } from "zustand";
import { User, Lead, Message, Sale, DashboardStats, LeadStatus, Channel, IntentTag } from "@/lib/types";
import { api } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { MOCK_LEADS, MOCK_SALES, MOCK_STATS, MOCK_MESSAGES } from "@/lib/mock-data";

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
  login: (credentials: any) => Promise<void>;
  signup: (signupData: any) => Promise<void>;
  logout: () => Promise<void>;

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
  sendMessage: (leadId: string, content: string) => Promise<void>;
  toggleAIMode: () => Promise<void>;
  addLead: (lead: Omit<Lead, "id" | "lastMessageTime" | "lastMessage" | "unreadCount" | "intentTags"> & { intentTags?: IntentTag[] }) => Promise<void>;
  updateLeadStatus: (leadId: string, status: LeadStatus) => Promise<void>;
  addSale: (sale: Omit<Sale, "id" | "date">) => Promise<void>;
  clearUnreadCount: (leadId: string) => Promise<void>;

  // Fetch Actions
  loadInitialData: () => Promise<void>;
  loadConversations: (leadId: string) => Promise<void>;

  // WebSockets Event Handlers
  handleSocketNewMessage: (data: any) => void;
  handleSocketLeadUpdated: (data: any) => void;
  handleSocketStatsUpdated: (data: any) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Auth & UI Defaults
  user: typeof window !== "undefined" && localStorage.getItem("user") 
    ? JSON.parse(localStorage.getItem("user")!) 
    : null,
  sidebarOpen: true,
  theme: "dark", // Locked to dark mode by default
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),

  login: async (credentials) => {
    const data = await api.auth.login(credentials);
    const mappedUser: User = {
      id: data.business.id,
      name: data.business.business_owner_name,
      email: data.business.business_email,
      role: "admin", // Default role
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", data.tokens.access_token);
      localStorage.setItem("refreshToken", data.tokens.refresh_token);
      localStorage.setItem("user", JSON.stringify(mappedUser));
    }
    set({ user: mappedUser });
    
    // Connect Socket.IO client
    const socket = getSocket();
    if (!socket.connected) {
      socket.connect();
    }
  },

  signup: async (signupData) => {
    const data = await api.auth.signup(signupData);
    const mappedUser: User = {
      id: data.business.id,
      name: data.business.business_owner_name,
      email: data.business.business_email,
      role: "admin",
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", data.tokens.access_token);
      localStorage.setItem("refreshToken", data.tokens.refresh_token);
      localStorage.setItem("user", JSON.stringify(mappedUser));
    }
    set({ user: mappedUser });
    
    // Connect Socket.IO client
    const socket = getSocket();
    if (!socket.connected) {
      socket.connect();
    }
  },

  logout: async () => {
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
    if (refreshToken) {
      await api.auth.logout(refreshToken).catch(console.error);
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
    set({ user: null, leads: [], conversations: {}, selectedLeadId: null });
    
    // Disconnect Socket.IO client
    const socket = getSocket();
    if (socket.connected) {
      socket.disconnect();
    }
  },

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
  leads: [],
  conversations: {},
  selectedLeadId: null,
  isAIMode: true,
  sales: [],
  stats: {
    totalChatsToday: 0,
    newLeads: 0,
    salesClosed: 0,
    revenueGenerated: 0,
    chatsChange: 0,
    leadsChange: 0,
    salesChange: 0,
    revenueChange: 0,
  },

  // Set Selected Lead
  setSelectedLeadId: (id) => {
    set({ selectedLeadId: id });
    if (id) {
      get().clearUnreadCount(id);
      get().loadConversations(id);
      
      // Update isAIMode switch based on selected lead's isHumanMode
      const lead = get().leads.find((l) => l.id === id);
      if (lead) {
        set({ isAIMode: !lead.isHumanMode });
      }
    }
  },

  // Clear Unread Count
  clearUnreadCount: async (leadId) => {
    set((state) => ({
      leads: state.leads.map((l) =>
        l.id === leadId ? { ...l, unreadCount: 0 } : l
      ),
    }));

    const user = get().user;
    if (user?.email === "demo@smartsales.ai") return;

    try {
      await api.leads.update(leadId, { unreadCount: 0 });
    } catch (error) {
      console.error("Failed to clear unread count on server", error);
    }
  },

  // Send Agent Reply Message
  sendMessage: async (leadId, content) => {
    const user = get().user;
    const isDemo = user?.email === "demo@smartsales.ai";

    if (isDemo) {
      const timestamp = new Date().toISOString();
      const newMessage: Message = {
        id: `mock-msg-${Date.now()}`,
        leadId,
        sender: "agent",
        content,
        timestamp,
      };

      set((state) => {
        const previousMessages = state.conversations[leadId] || [];
        const updatedMessages = [...previousMessages, newMessage];

        // Update lead preview details
        const updatedLeads = state.leads.map((l) => {
          if (l.id === leadId) {
            return {
              ...l,
              lastMessage: content,
              lastMessageTime: timestamp,
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

      // Simulate a customer reply after 2 seconds
      setTimeout(() => {
        const currentSelectedLead = get().selectedLeadId;
        if (currentSelectedLead !== leadId) return;

        const customerReplies = [
          "Alright, that works for me. How do I make the payment?",
          "Can you send the invoice? I want to finalize this.",
          "Perfect! Please ship it to my office address in Lagos.",
          "Awesome service, thanks for the quick response! 👍",
          "Okay, let me check with my partner and get back to you.",
        ];
        const randomReply = customerReplies[Math.floor(Math.random() * customerReplies.length)];
        const custTimestamp = new Date().toISOString();
        const customerMsg: Message = {
          id: `mock-msg-${Date.now()}-cust`,
          leadId,
          sender: "customer",
          content: randomReply,
          timestamp: custTimestamp,
        };

        set((state) => {
          const previousMessages = state.conversations[leadId] || [];
          return {
            conversations: {
              ...state.conversations,
              [leadId]: [...previousMessages, customerMsg],
            },
            leads: state.leads.map((l) =>
              l.id === leadId
                ? {
                    ...l,
                    lastMessage: randomReply,
                    lastMessageTime: custTimestamp,
                  }
                : l
            ),
          };
        });

        const lead = get().leads.find((l) => l.id === leadId);
        get().addToast(
          "info",
          `Reply from ${lead?.name || "Client"}`,
          `"${randomReply}"`
        );
      }, 2000);

      return;
    }

    try {
      const newMessage = await api.messages.sendAgentReply(leadId, content);
      
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
    } catch (error) {
      get().addToast("error", "Message send failure", String(error));
    }
  },

  // Toggle AI Mode / Human Takeover
  toggleAIMode: async () => {
    const leadId = get().selectedLeadId;
    if (!leadId) return;

    const nextMode = !get().isAIMode;
    const isHuman = !nextMode;

    const user = get().user;
    if (user?.email === "demo@smartsales.ai") {
      set({ isAIMode: nextMode });
      set((state) => ({
        leads: state.leads.map((l) =>
          l.id === leadId ? { ...l, isHumanMode: isHuman } : l
        )
      }));

      get().addToast(
        "info",
        nextMode ? "🤖 AI Mode Activated" : "🧑‍💼 Human Takeover Mode",
        nextMode ? "Aria will now automatically reply to incoming messages." : "You have full control of all replies now."
      );
      return;
    }

    try {
      await api.messages.toggleHandoff(leadId, isHuman);
      
      set({ isAIMode: nextMode });
      set((state) => ({
        leads: state.leads.map((l) =>
          l.id === leadId ? { ...l, isHumanMode: isHuman } : l
        )
      }));

      get().addToast(
        "info",
        nextMode ? "🤖 AI Mode Activated" : "🧑‍💼 Human Takeover Mode",
        nextMode ? "Aria will now automatically reply to incoming messages." : "You have full control of all replies now."
      );
    } catch (error) {
      get().addToast("error", "Takeover transition failed", String(error));
    }
  },

  // Add Lead (Local implementation for demo/sandbox fallback)
  addLead: async (lead) => {
    const newLead: Lead = {
      ...lead,
      id: `l-${Date.now()}`,
      lastMessage: "Lead added to pipeline",
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      intentTags: lead.intentTags || ["Inquiry"],
      isHumanMode: true,
    };

    set((state) => ({
      leads: [newLead, ...state.leads],
      stats: {
        ...state.stats,
        newLeads: state.stats.newLeads + 1,
      },
    }));

    get().addToast("success", "Demo Lead Added Pipeline", `${lead.name} has been successfully recorded locally.`);
  },

  // Update Lead Status (Kanban transition)
  updateLeadStatus: async (leadId, status) => {
    const lead = get().leads.find((l) => l.id === leadId);
    
    // Update local state immediately (optimistic UI update)
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

    const user = get().user;
    if (user?.email === "demo@smartsales.ai") {
      if (lead) {
        get().addToast("success", "Stage Moved", `${lead.name} updated to ${status.toUpperCase()} stage.`);
      }
      return;
    }

    try {
      await api.leads.update(leadId, { status });
      if (lead) {
        get().addToast("success", "Stage Moved", `${lead.name} updated to ${status.toUpperCase()} stage.`);
      }
    } catch (error) {
      get().addToast("error", "Pipeline stage update failed", String(error));
    }
  },

  // Add Sale (Local implementation)
  addSale: async (sale) => {
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

  // Fetch leads, sales, and stats summary on dashboard load
  loadInitialData: async () => {
    const user = get().user;
    const isDemo = user?.email === "demo@smartsales.ai";

    if (isDemo) {
      if (get().leads.length === 0) {
        set({
          leads: MOCK_LEADS,
          sales: MOCK_SALES,
          stats: MOCK_STATS,
          conversations: MOCK_MESSAGES,
        });

        if (MOCK_LEADS.length > 0 && !get().selectedLeadId) {
          const firstLead = MOCK_LEADS[0];
          set({ selectedLeadId: firstLead.id, isAIMode: !firstLead.isHumanMode });
          get().loadConversations(firstLead.id);
        }
      }

      // Start real-time WhatsApp message simulator for demo mode (if not already started)
      if (typeof window !== "undefined" && !(window as any).demoSimulatorActive) {
        (window as any).demoSimulatorActive = true;
        
        setInterval(() => {
          const currentUser = get().user;
          if (currentUser?.email !== "demo@smartsales.ai") return;

          const randomLead = MOCK_LEADS[Math.floor(Math.random() * MOCK_LEADS.length)];
          const customerMessages = [
            "Hi, is this product still available?",
            "Do you have a physical shop in Lagos?",
            "What is the price of the wholesale bundle?",
            "Can you deliver to Ibadan today?",
            "I would like to order one skincare set."
          ];
          const randomMsg = customerMessages[Math.floor(Math.random() * customerMessages.length)];
          
          const aiReplies: Record<string, string> = {
            "Hi, is this product still available?": "Hello! Yes, all items are currently in stock! We have direct delivery. What product are you interested in? 😊",
            "Do you have a physical shop in Lagos?": "We operate primarily online with fast courier delivery to Lagos! We also offer pickup at our central hub in Surulere. 📍",
            "What is the price of the wholesale bundle?": "Our wholesale bundles start at ₦150,000 with a minimum of 10 items. Would you like us to send the price list? 📈",
            "Can you deliver to Ibadan today?": "Standard delivery to Ibadan takes 24-48 hours. However, we can arrange same-day interstate transport if you order before 10 AM! 🚚",
            "I would like to order one skincare set.": "Excellent choice! The skincare set is ₦27,000. Let me get your details for delivery. 🧴"
          };
          
          const currentLeadState = get().leads.find(l => l.id === randomLead.id);
          const isAIModeForLead = currentLeadState ? !currentLeadState.isHumanMode : true;
          const aiReply = isAIModeForLead ? aiReplies[randomMsg] : undefined;

          get().handleSocketNewMessage({
            leadId: randomLead.id,
            customerMessage: randomMsg,
            aiReply,
            leadName: randomLead.name
          });
        }, 45000);
      }
      return;
    }

    try {
      const leadsRes = await api.leads.list();
      const salesRes = await api.sales.list();
      const summaryRes = await api.sales.summary();

      set({
        leads: leadsRes.items,
        sales: salesRes.items,
        stats: {
          totalChatsToday: summaryRes.total_orders || 0,
          newLeads: summaryRes.pending_orders || 0,
          salesClosed: summaryRes.completed_orders || 0,
          revenueGenerated: summaryRes.total_revenue || 0,
          chatsChange: 8, // Static changes for visual polish
          leadsChange: 12,
          salesChange: 4,
          revenueChange: 15,
        },
      });

      if (leadsRes.items.length > 0 && !get().selectedLeadId) {
        const firstLead = leadsRes.items[0];
        set({ selectedLeadId: firstLead.id, isAIMode: !firstLead.isHumanMode });
        get().loadConversations(firstLead.id);
      }
    } catch (error) {
      console.error("[useStore] Initial data load failed:", error);
    }
  },

  // Load conversation messages for a selected lead
  loadConversations: async (leadId) => {
    const user = get().user;
    if (user?.email === "demo@smartsales.ai") {
      set((state) => {
        if (!state.conversations[leadId]) {
          return {
            conversations: {
              ...state.conversations,
              [leadId]: [],
            },
          };
        }
        return {};
      });
      return;
    }

    try {
      const messages = await api.messages.list(leadId);
      set((state) => ({
        conversations: {
          ...state.conversations,
          [leadId]: messages,
        },
      }));
    } catch (error) {
      console.error(`[useStore] Failed to load messages for lead ${leadId}:`, error);
    }
  },

  // Socket.IO event handler for new messages
  handleSocketNewMessage: (data) => {
    const { leadId, customerMessage, aiReply, leadName } = data;

    const timestamp = new Date().toISOString();
    const customerMsg: Message = {
      id: `socket-msg-${Date.now()}-cust`,
      leadId,
      sender: "customer",
      content: customerMessage,
      timestamp,
    };

    const newMessages = [customerMsg];

    if (aiReply) {
      newMessages.push({
        id: `socket-msg-${Date.now()}-ai`,
        leadId,
        sender: "ai",
        content: aiReply,
        timestamp,
        intentTag: "Inquiry", // Default fallback
      });
    }

    set((state) => {
      const previousMessages = state.conversations[leadId] || [];
      const updatedMessages = [...previousMessages, ...newMessages];
      const isSelected = state.selectedLeadId === leadId;

      const updatedLeads = state.leads.map((l) => {
        if (l.id === leadId) {
          return {
            ...l,
            lastMessage: aiReply || customerMessage,
            lastMessageTime: timestamp,
            unreadCount: !isSelected ? l.unreadCount + 1 : l.unreadCount,
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

    // Notify user if it's arriving in the background
    if (get().selectedLeadId !== leadId) {
      get().addToast(
        "info",
        "New WhatsApp Inquiry",
        `"${customerMessage.substring(0, 35)}${customerMessage.length > 35 ? "..." : ""}" from ${leadName}`
      );
    }
  },

  // Socket.IO event handler for lead updates (e.g. status or AI classification)
  handleSocketLeadUpdated: (data) => {
    const { leadId, status, name } = data;
    set((state) => ({
      leads: state.leads.map((l) =>
        l.id === leadId ? { ...l, status } : l
      )
    }));
    get().addToast("info", "Lead Pipeline Updated", `${name} status updated to ${status.toUpperCase()} stage.`);
  },

  // Socket.IO event handler for stats updates
  handleSocketStatsUpdated: (data) => {
    set((state) => ({
      stats: {
        ...state.stats,
        totalChatsToday: data.total_orders || state.stats.totalChatsToday,
        newLeads: data.pending_orders || state.stats.newLeads,
        salesClosed: data.completed_orders || state.stats.salesClosed,
        revenueGenerated: data.total_revenue || state.stats.revenueGenerated,
      }
    }));
  },
}));
