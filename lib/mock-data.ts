import {
  AnalyticsData,
  Conversation,
  Lead,
  Message,
  Sale,
  User,
} from "./types";

// Mock Users
export const MOCK_USERS: User[] = [
  {
    id: "u1",
    name: "Alex Johnson",
    email: "alex@smartsales.ai",
    role: "sales",
    avatar: "https://i.pravatar.cc/150?u=alex",
  },
  {
    id: "u2",
    name: "Sarah Smith",
    email: "sarah@smartsales.ai",
    role: "admin",
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
];

// Mock Leads
export const MOCK_LEADS: Lead[] = [
  {
    id: "l1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 555-0101",
    company: "Tech Corp",
    status: "Hot",
    source: "Website",
    lastContacted: new Date().toISOString(),
    value: 5000,
  },
  {
    id: "l2",
    name: "Jane Smith",
    email: "jane@design.co",
    phone: "+1 555-0102",
    company: "Design Co",
    status: "New",
    source: "LinkedIn",
    lastContacted: new Date(Date.now() - 86400000).toISOString(),
    value: 2500,
  },
  {
    id: "l3",
    name: "Robert Brown",
    email: "bob@enterprise.inc",
    phone: "+1 555-0103",
    company: "Enterprise Inc",
    status: "Closed",
    source: "Referral",
    lastContacted: new Date(Date.now() - 172800000).toISOString(),
    value: 12000,
  },
  {
    id: "l4",
    name: "Alice Williams",
    email: "alice@start.up",
    phone: "+1 555-0104",
    company: "Start Up",
    status: "Follow Up",
    source: "Twitter",
    lastContacted: new Date(Date.now() - 259200000).toISOString(),
    value: 1500,
  },
  {
    id: "l5",
    name: "Michael Davis",
    email: "mike@bigcorp.com",
    phone: "+1 555-0105",
    company: "Big Corp",
    status: "New",
    source: "Website",
    lastContacted: new Date(Date.now() - 400000).toISOString(),
    value: 8000,
  },
];

// Mock Conversations
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    leadId: "l1",
    leadName: "John Doe",
    lastMessage: "I am interested in the pricing for the enterprise plan.",
    unreadCount: 2,
    intent: "Pricing",
    status: "active",
    timestamp: new Date().toISOString(),
    platform: "web",
  },
  {
    id: "c2",
    leadId: "l2",
    leadName: "Jane Smith",
    lastMessage: "Can you help me with the integration?",
    unreadCount: 0,
    intent: "Support",
    status: "active",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    platform: "whatsapp",
  },
  {
    id: "c3",
    leadId: "l5",
    leadName: "Michael Davis",
    lastMessage: "Is this AI really automated?",
    unreadCount: 1,
    intent: "Buying",
    status: "active",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    platform: "web",
  },
];

// Mock Messages
export const MOCK_MESSAGES: Record<string, Message[]> = {
  c1: [
    {
      id: "m1",
      conversationId: "c1",
      senderId: "ai",
      senderType: "ai",
      content: "Hello! How can I help you today?",
      timestamp: new Date(Date.now() - 1000000).toISOString(),
    },
    {
      id: "m2",
      conversationId: "c1",
      senderId: "l1",
      senderType: "customer",
      content: "I am interested in the pricing for the enterprise plan.",
      timestamp: new Date(Date.now() - 500000).toISOString(),
    },
  ],
  c2: [
    {
      id: "m3",
      conversationId: "c2",
      senderId: "ai",
      senderType: "ai",
      content: "Hi Jane, welcome back!",
      timestamp: new Date(Date.now() - 4000000).toISOString(),
    },
    {
      id: "m4",
      conversationId: "c2",
      senderId: "l2",
      senderType: "customer",
      content: "Can you help me with the integration?",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
};

// Mock Sales
export const MOCK_SALES: Sale[] = [
  {
    id: "s1",
    leadId: "l3",
    amount: 12000,
    productName: "Enterprise License",
    date: new Date(Date.now() - 172800000).toISOString(),
    status: "completed",
  },
  {
    id: "s2",
    leadId: "l1",
    amount: 5000,
    productName: "Growth Plan",
    date: new Date(Date.now() - 86400000).toISOString(),
    status: "pending",
  },
];

// Mock Analytics
export const MOCK_ANALYTICS: AnalyticsData = {
  totalChats: 12450,
  newLeads: 843,
  salesClosed: 128,
  revenue: 452000,
  revenueByDay: [
    { date: "Mon", value: 4000 },
    { date: "Tue", value: 3000 },
    { date: "Wed", value: 2000 },
    { date: "Thu", value: 2780 },
    { date: "Fri", value: 1890 },
    { date: "Sat", value: 2390 },
    { date: "Sun", value: 3490 },
  ],
  salesOverTime: [
    { date: "Jan", value: 4000 },
    { date: "Feb", value: 3000 },
    { date: "Mar", value: 2000 },
    { date: "Apr", value: 2780 },
    { date: "May", value: 1890 },
    { date: "Jun", value: 2390 },
    { date: "Jul", value: 3490 },
  ],
  leadSources: [
    { name: "Website", value: 400 },
    { name: "LinkedIn", value: 300 },
    { name: "Referral", value: 300 },
    { name: "Ads", value: 200 },
  ],
  conversionRate: [
    { date: "Week 1", value: 2.5 },
    { date: "Week 2", value: 2.8 },
    { date: "Week 3", value: 3.2 },
    { date: "Week 4", value: 3.5 },
  ],
};
