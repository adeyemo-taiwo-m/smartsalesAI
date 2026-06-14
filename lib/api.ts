import { Lead, Message, Sale, DashboardStats, Channel, LeadStatus, IntentTag } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://178.62.40.106:8000";

// Standard api fetch with interceptor for 401 (token refresh)
export async function apiFetch(path: string, options: RequestInit = {}): Promise<any> {
  const url = `${API_URL}${path}`;
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  options.headers = headers;

  let response = await fetch(url, options);

  // If unauthorized, attempt to refresh token
  if (response.status === 401 && path !== "/api/auth/login" && path !== "/api/auth/signup") {
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshResponse.ok) {
          const tokenData = await refreshResponse.json();
          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", tokenData.access_token);
            localStorage.setItem("refreshToken", tokenData.refresh_token);
          }
          // Retry the request with new token
          headers.set("Authorization", `Bearer ${tokenData.access_token}`);
          response = await fetch(url, options);
        } else {
          // Token refresh failed - clean storage and redirect to login
          if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }
        }
      } catch (error) {
        console.error("Failed to refresh auth token", error);
      }
    }
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: "Unknown server error" }));
    throw new Error(err.detail || "Request failed");
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("text/csv")) {
    return response.text();
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Data conversion helpers
export function mapBackendLead(lead: any): Lead {
  return {
    id: lead.id,
    name: lead.name || "Unknown Client",
    phone: lead.phone,
    channel: lead.channel,
    status: lead.status,
    lastMessage: lead.last_message || "No messages yet",
    lastMessageTime: lead.last_customer_message_at || lead.updated_at || lead.created_at,
    unreadCount: lead.unread_count || 0,
    intentTags: lead.intent_tags || [],
  };
}

export function mapBackendMessage(msg: any): Message {
  return {
    id: msg.id,
    leadId: msg.lead_id,
    sender: msg.sender,
    content: msg.content,
    timestamp: msg.created_at,
    intentTag: msg.intent_tag,
  };
}

export function mapBackendSale(sale: any): Sale {
  return {
    id: sale.id,
    customer: sale.customer,
    product: sale.product,
    amount: Number(sale.amount),
    status: sale.status,
    date: sale.date || sale.created_at,
    channel: sale.channel,
  };
}

// API endpoint methods
export const api = {
  auth: {
    signup: async (signupData: any) => {
      const data = await apiFetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(signupData),
      });
      return data;
    },
    login: async (loginData: any) => {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(loginData),
      });
      return data;
    },
    logout: async (refreshToken: string) => {
      return apiFetch("/api/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    },
  },

  leads: {
    list: async (filters: { status?: LeadStatus; channel?: Channel; search?: string } = {}) => {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.channel) params.append("channel", filters.channel);
      if (filters.search) params.append("search", filters.search);

      const res = await apiFetch(`/api/leads/?${params.toString()}`);
      return {
        items: res.items.map(mapBackendLead),
        total: res.total,
      };
    },
    get: async (leadId: string) => {
      const res = await apiFetch(`/api/leads/${leadId}`);
      return mapBackendLead(res);
    },
    update: async (leadId: string, updateData: any) => {
      // Map update fields if they are camelCase
      const payload: any = {};
      if (updateData.name !== undefined) payload.name = updateData.name;
      if (updateData.status !== undefined) payload.status = updateData.status;
      if (updateData.unreadCount !== undefined) payload.unread_count = updateData.unreadCount;
      if (updateData.leadScore !== undefined) payload.lead_score = updateData.leadScore;
      if (updateData.isHumanMode !== undefined) payload.is_human_mode = updateData.isHumanMode;
      if (updateData.humanAssignedTo !== undefined) payload.human_assigned_to = updateData.humanAssignedTo;

      const res = await apiFetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      return mapBackendLead(res);
    },
  },

  messages: {
    list: async (leadId: string, limit = 100, offset = 0) => {
      const res = await apiFetch(`/api/messages/${leadId}?limit=${limit}&offset=${offset}`);
      return res.map(mapBackendMessage);
    },
    sendAgentReply: async (leadId: string, content: string) => {
      const res = await apiFetch(`/api/messages/${leadId}/agent-reply`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });
      return mapBackendMessage(res);
    },
    toggleHandoff: async (leadId: string, isHuman: boolean, assignedTo?: string) => {
      const res = await apiFetch(`/api/messages/${leadId}/handoff`, {
        method: "POST",
        body: JSON.stringify({ isHuman, assignedTo }),
      });
      return res; // returns { lead_id, isHuman, assignedTo }
    },
  },

  sales: {
    list: async (filters: { status?: string; channel?: Channel; search?: string } = {}) => {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.channel) params.append("channel", filters.channel);
      if (filters.search) params.append("search", filters.search);

      const res = await apiFetch(`/api/sales/?${params.toString()}`);
      return {
        items: res.items.map(mapBackendSale),
        total: res.total,
      };
    },
    summary: async () => {
      const res = await apiFetch("/api/sales/summary");
      // Map to frontend stats shape if necessary, or pass through
      return res;
    },
    export: async (filters: { status?: string; channel?: Channel; search?: string } = {}) => {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.channel) params.append("channel", filters.channel);
      if (filters.search) params.append("search", filters.search);

      return apiFetch(`/api/sales/export?${params.toString()}`);
    },
  },

  settings: {
    get: async () => {
      const res = await apiFetch("/api/settings/");
      return res; // returns BusinessSettingsRead
    },
    update: async (settingsData: any) => {
      const res = await apiFetch("/api/settings/", {
        method: "PUT",
        body: JSON.stringify(settingsData),
      });
      return res;
    },
  },

  whatsapp: {
    connect: async (connectData: { authorization_code: string; whatsapp_business_account_id: string; phone_number_id: string }) => {
      const res = await apiFetch("/api/whatsapp/connect", {
        method: "POST",
        body: JSON.stringify(connectData),
      });
      return res;
    },
  },
};
