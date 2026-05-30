# SmartSales AI – Full Frontend Implementation Plan

> **Instruction file for coding agent. Read top to bottom. Build in order.**

---

## OVERVIEW

You are building **SmartSales AI** – a sales automation platform for businesses.

**Stack:** React + Next.js 14 (App Router), Tailwind CSS, shadcn/ui, Zustand, TanStack Query, Socket.IO client, Recharts, Framer Motion.

**Design tokens:**

```
Primary Blue:   #2563EB
Accent Purple:  #7C3AED
Success Green:  #22C55E
Warning Orange: #F97316
Dark BG:        #0F172A
Card BG:        #1E293B
Border:         #334155
Text Primary:   #F8FAFC
Text Muted:     #94A3B8
Font:           Inter (Google Fonts)
```

---

## PART 1 – PROJECT SETUP

### 1.1 Initialize Project

```bash
npx create-next-app@latest smartsales-ai \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd smartsales-ai
```

### 1.2 Install Dependencies

```bash
npm install \
  @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu \
  @radix-ui/react-tabs \
  @radix-ui/react-badge \
  @radix-ui/react-avatar \
  @radix-ui/react-tooltip \
  @radix-ui/react-switch \
  @radix-ui/react-select \
  class-variance-authority \
  clsx \
  tailwind-merge \
  lucide-react \
  recharts \
  framer-motion \
  zustand \
  @tanstack/react-query \
  socket.io-client \
  date-fns \
  react-hot-toast
```

### 1.3 Add shadcn/ui

```bash
npx shadcn-ui@latest init
# Choose: Default style, Slate base color, CSS variables: yes
```

Add these components:

```bash
npx shadcn-ui@latest add button card badge avatar input textarea
npx shadcn-ui@latest add dialog dropdown-menu tabs select switch tooltip
npx shadcn-ui@latest add table skeleton progress separator
```

### 1.4 Tailwind Config

In `tailwind.config.ts`, extend the theme:

```ts
extend: {
  colors: {
    brand: {
      blue:   '#2563EB',
      purple: '#7C3AED',
      green:  '#22C55E',
      orange: '#F97316',
    },
    dark: {
      DEFAULT: '#0F172A',
      card:    '#1E293B',
      border:  '#334155',
    }
  },
  fontFamily: {
    sans: ['Inter', 'sans-serif'],
  },
}
```

### 1.5 Global CSS (`src/app/globals.css`)

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

body {
  background-color: #0f172a;
  color: #f8fafc;
  font-family: "Inter", sans-serif;
}
```

### 1.6 Folder Structure

Create this exact folder structure:

```
src/
├── app/
│   ├── (marketing)/          # Public pages
│   │   ├── page.tsx          # Landing page
│   │   └── layout.tsx
│   ├── (dashboard)/          # Protected app pages
│   │   ├── layout.tsx        # Sidebar + topbar shell
│   │   ├── overview/page.tsx
│   │   ├── conversations/page.tsx
│   │   ├── leads/page.tsx
│   │   ├── sales/page.tsx
│   │   ├── analytics/page.tsx
│   │   └── settings/page.tsx
│   ├── layout.tsx            # Root layout
│   └── globals.css
├── components/
│   ├── landing/              # Landing page sections
│   ├── dashboard/            # Dashboard components
│   ├── chat/                 # Chat components
│   ├── ui/                   # shadcn/ui components (auto-generated)
│   └── shared/               # Reusable across pages
├── lib/
│   ├── utils.ts
│   ├── mock-data.ts          # All mock/seed data
│   └── socket.ts             # Socket.IO client setup
├── store/
│   ├── chat-store.ts         # Zustand: chat state
│   └── dashboard-store.ts    # Zustand: dashboard state
└── types/
    └── index.ts              # All TypeScript interfaces
```

---

## PART 2 – TYPE DEFINITIONS

**File:** `src/types/index.ts`

Define all these interfaces before writing any components:

```ts
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
```

---

## PART 3 – MOCK DATA

**File:** `src/lib/mock-data.ts`

Create realistic mock data. Use Nigerian Naira (₦) for amounts. Include:

- `mockLeads`: Array of 12+ `Lead` objects with varied statuses and channels
- `mockMessages`: Array of `Message` objects for at least 3 conversations
- `mockSales`: Array of 15+ `Sale` objects
- `mockStats`: One `DashboardStats` object with realistic numbers
- `mockFunnelData`: Array of 4 `FunnelData` objects — `New Leads (248)`, `Interested (142)`, `Negotiating (67)`, `Converted (34)`
- `mockRevenueChart`: Array of 7 objects `{ day: string, revenue: number, leads: number }` for a weekly chart

---

## PART 4 – LANDING PAGE

**Route:** `/` → `src/app/(marketing)/page.tsx`

Build each section as a separate component in `src/components/landing/`.

---

### 4.1 `Navbar.tsx`

- Sticky top, blurred background (`backdrop-blur-md bg-dark/80`)
- Left: Logo — blue lightning bolt SVG icon + **SmartSales AI** text (gradient: blue → purple)
- Center: Nav links — Features · Pricing · Use Cases · Login
- Right: **Start Free Trial** button (solid blue, rounded-full)
- Mobile: hamburger menu with slide-down drawer
- Animate in on load with `framer-motion` (fade + slide from top)

---

### 4.2 `HeroSection.tsx`

- Full-height section, dark background with subtle radial gradient (blue glow top-center)
- Badge pill at top: "🚀 Trusted by 5,000+ businesses" (blue border, semi-transparent bg)
- Headline: **"Turn Chats Into Sales Automatically"** — large (text-5xl md:text-7xl), bold, white
- Subheadline: **"AI-powered WhatsApp & Web Sales Assistant for Businesses"** — text-xl, muted color
- Description text: 1 line, smaller, muted
- Channel badges row: WhatsApp (green) · Instagram (pink) · Website Chat (blue) — pill badges with icons
- Two CTA buttons:
  - Primary: **Get Started Free** — blue gradient, large, rounded-full, hover scale
  - Secondary: **Watch Demo** — ghost style with play icon, rounded-full
- Below CTAs: small text "No credit card required • Setup in 5 minutes"
- Hero graphic: a floating mockup of the chat widget / dashboard (can be a styled div with mock UI inside, use `framer-motion` for floating animation)
- Animate all elements in with staggered `framer-motion` fade-up

---

### 4.3 `FeaturesSection.tsx`

- Section heading: "Everything you need to sell on autopilot"
- 4 feature cards in a 2x2 grid (md: 4 columns):

  | Icon | Title           | Description                                                               |
  | ---- | --------------- | ------------------------------------------------------------------------- |
  | 🤖   | AI Sales Agent  | Handles inquiries, pricing, FAQs, and follow-ups 24/7 without human input |
  | 💬   | Omnichannel CRM | Manage WhatsApp, Web, and Instagram DMs from one unified inbox            |
  | 📈   | Sales Tracking  | Track leads, conversions, and revenue with real-time insights             |
  | 🔔   | Auto Follow-ups | Smart reminders ensure no lead goes cold ever again                       |

- Card style: dark card bg (`#1E293B`), border (`#334155`), rounded-2xl, hover: border turns blue + subtle scale
- Icon: large emoji or lucide icon in a colored circle badge
- Animate cards in with `framer-motion` scroll-triggered stagger

---

### 4.4 `SocialProofSection.tsx`

- "Trusted by 5,000+ businesses across Africa"
- Row of 6 placeholder company logo boxes (gray, blurred, grayscale)
- Below logos: 2 testimonial cards side by side
  - Card: avatar + name + role + company + star rating (5 stars) + quote text
  - Card style: dark card, border, rounded-2xl
- Animate in with fade-up on scroll

---

### 4.5 `PricingSection.tsx`

- Section heading: "Simple, transparent pricing"
- 3 pricing cards in a row (center card is "recommended", slightly larger with colored border glow):

  **Starter – Free**
  - 200 messages/month
  - Web chat only
  - Basic analytics
  - CTA: Get Started (outline button)

  **Growth – ₦25,000/mo** ← HIGHLIGHTED (blue/purple gradient border, "Most Popular" badge)
  - Unlimited chats
  - WhatsApp + Instagram
  - Sales analytics
  - Auto follow-ups
  - CTA: Start Free Trial (solid blue button)

  **Business – Custom**
  - Multi-agent AI
  - Team accounts
  - CRM integrations
  - Priority support
  - CTA: Contact Sales (outline button)

- Each feature listed with a green checkmark icon
- Card style: dark bg, rounded-2xl

---

### 4.6 `CTASection.tsx`

- Full-width section with blue-to-purple gradient background
- Big bold text: "Start Selling Smarter Today"
- Subtext: "Join 5,000+ businesses using SmartSales AI"
- Two buttons: **Get Started Free** (white, dark text) + **Watch Demo** (transparent, white border)

---

### 4.7 `Footer.tsx`

- Dark background (`#0A0F1E`)
- 4 columns: Brand (logo + tagline + social icons) | Product (links) | Company (links) | Legal (links)
- Bottom bar: "© 2025 SmartSales AI. All rights reserved."
- Divider line above bottom bar

---

### 4.8 Assemble Landing Page

In `src/app/(marketing)/page.tsx`, import and render all sections in order:

```tsx
<Navbar />
<HeroSection />
<FeaturesSection />
<SocialProofSection />
<PricingSection />
<CTASection />
<Footer />
```

---

## PART 5 – DASHBOARD SHELL

**Route:** `/overview` and all dashboard routes use a shared layout.

**File:** `src/app/(dashboard)/layout.tsx`

This layout wraps all dashboard pages. It renders:

- `<Sidebar />` on the left (fixed, full height)
- `<TopBar />` at the top of the main area
- `{children}` in the main content area

---

### 5.1 `Sidebar.tsx`

**File:** `src/components/dashboard/Sidebar.tsx`

- Fixed left sidebar, `w-64`, full viewport height, dark card bg (`#1E293B`), right border
- Top: Logo (same as navbar)
- Nav items — each is a link with icon + label. Active item: blue bg pill, blue text. Inactive: gray text, hover lightens:

  | Icon (lucide)     | Label         | Route            |
  | ----------------- | ------------- | ---------------- |
  | `LayoutDashboard` | Overview      | `/overview`      |
  | `MessageSquare`   | Conversations | `/conversations` |
  | `Users`           | Leads         | `/leads`         |
  | `DollarSign`      | Sales         | `/sales`         |
  | `BarChart2`       | Analytics     | `/analytics`     |
  | `Settings`        | Settings      | `/settings`      |

- Bottom: User avatar + name + "Pro Plan" badge + logout icon
- Use `usePathname()` from Next.js to determine active route

---

### 5.2 `TopBar.tsx`

**File:** `src/components/dashboard/TopBar.tsx`

- Full width top bar, `h-16`, dark bg with bottom border
- Left: Page title (dynamic based on route) + breadcrumb
- Right (flex row):
  - Search input (icon inside, rounded-full, dark bg)
  - Bell icon button with red dot badge showing "3"
  - Avatar with dropdown (Profile · Settings · Logout)
- Business name shown somewhere prominently: "Acme Store"

---

## PART 6 – OVERVIEW PAGE

**Route:** `/overview` → `src/app/(dashboard)/overview/page.tsx`

Build each widget as a component in `src/components/dashboard/`.

---

### 6.1 `StatsCards.tsx`

- 4 cards in a row (grid-cols-2 lg:grid-cols-4)
- Each card shows:
  - Icon (in colored circle)
  - Label
  - Big number
  - Change badge: e.g. "+12% vs yesterday" (green for positive, red for negative)

  | Icon            | Label             | Value    | Color  |
  | --------------- | ----------------- | -------- | ------ |
  | `MessageSquare` | Total Chats Today | 247      | Blue   |
  | `Users`         | New Leads         | 38       | Purple |
  | `CheckCircle`   | Sales Closed      | 12       | Green  |
  | `TrendingUp`    | Revenue Generated | ₦184,500 | Orange |

- Card style: dark card bg, border, rounded-2xl
- Animate in with stagger using `framer-motion`

---

### 6.2 `LiveConversationsPanel.tsx`

- Left column panel (takes ~35% of width in 2-column grid)
- Header: "Live Conversations" + green pulsing dot + count badge
- Scrollable list of conversation items, each showing:
  - Avatar (colored initials)
  - Customer name + phone number (smaller, muted)
  - Channel icon (WhatsApp = green, Instagram = pink, Web = blue) — small icon pill
  - Lead status badge: `New` (blue) | `Hot` (red/orange) | `Warm` (yellow) | `Closed` (green)
  - Last message preview (1 line, truncated, muted text)
  - Time (right-aligned, small)
  - Unread count badge (if > 0)
- Clicking a conversation selects it and shows it in the `ChatWindow`
- Selected conversation: highlighted with blue left border + slightly lighter bg
- Use data from `mockLeads`

---

### 6.3 `ChatWindow.tsx`

- Right column panel (takes ~65% of width)
- **Header:** Selected customer name + channel icon + status badge + "Human Takeover" toggle button (right side)
- **Messages area:** Scrollable, flex-col
  - Customer messages: left-aligned, dark bubble, muted text
  - AI messages: right-aligned, blue gradient bubble, white text, small "🤖 AI" label above
  - Each message: timestamp below, small
  - Intent tag on AI messages: small colored chip (e.g. `Pricing`, `Buying`)
- **Bottom input area:**
  - Text input (rounded-full, dark bg)
  - Emoji button, attach button, send button (blue)
  - Small note: "AI is handling this conversation" (gray, italic) — shown when AI mode is on
- When "Human Takeover" is toggled ON: note changes to "You are now in control", input becomes active with different style
- Show messages from `mockMessages` filtered by selected lead

---

### 6.4 `SalesFunnelWidget.tsx`

- Horizontal funnel visualization (or vertical bar chart)
- 4 stages with counts: **New Leads (248) → Interested (142) → Negotiating (67) → Converted (34)**
- Each stage is a bar segment with label, count, and color
- Show conversion rate between each stage (e.g. "57% →")
- Use `recharts` `FunnelChart` or custom styled divs
- Card wrapper: dark bg, rounded-2xl, border

---

### 6.5 `RecentSalesTable.tsx`

- Full-width table below the chat area
- Columns: Customer | Product | Amount | Channel | Status | Date
- Each row:
  - Customer: avatar + name
  - Channel: icon pill
  - Amount: formatted as ₦X,XXX
  - Status: colored badge (`Completed` = green, `Pending` = orange, `Refunded` = red)
- Use `mockSales` data (show last 8)
- Add a "View All" link top-right of the card

---

### 6.6 Assemble Overview Page

```tsx
// overview/page.tsx
<div className="space-y-6">
  <StatsCards />
  <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-6">
    <LiveConversationsPanel />
    <ChatWindow />
  </div>
  <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-6">
    <SalesFunnelWidget />
    <RecentSalesTable />
  </div>
</div>
```

---

## PART 7 – CONVERSATIONS PAGE

**Route:** `/conversations` → `src/app/(dashboard)/conversations/page.tsx`

Full-screen conversation view (similar to WhatsApp Web layout):

- Left panel (fixed width `320px`): full list of all conversations with search + filter tabs
  - Tabs: All | New | Hot | Closed
  - Search bar at top
  - Same conversation item style as `LiveConversationsPanel`
- Right panel (flex-grow): `ChatWindow` for selected conversation (full height)
- No selection state: show empty state illustration + "Select a conversation to start"
- Add a "New Chat" button at top of left panel

---

## PART 8 – LEADS PAGE

**Route:** `/leads` → `src/app/(dashboard)/leads/page.tsx`

- Top: Page header + **"Add Lead"** button (blue, right side)
- Filter row: Search input | Channel filter (All/WhatsApp/Instagram/Web) | Status filter | Date range
- Kanban board view with 4 columns:
  - **New** (blue header)
  - **Interested** (purple header)
  - **Negotiating** (orange header)
  - **Converted** (green header)
- Each lead card in the column:
  - Name + phone
  - Channel icon
  - Last message preview
  - Time since last contact
  - Action buttons: View Chat | Edit
- Alternatively: togglable Table view (toggle button top-right: "Kanban / Table")
- In table view: standard table with all lead fields + action column

---

## PART 9 – SALES PAGE

**Route:** `/sales` → `src/app/(dashboard)/sales/page.tsx`

- Top stats row: 4 mini stat cards (Total Sales This Month, Total Revenue, Avg Order Value, Refund Rate)
- Below: Full-width `RecentSalesTable` with all 15+ entries + pagination
- Add filter bar: Search | Status filter | Channel filter | Date range picker
- "Export CSV" button top-right

---

## PART 10 – ANALYTICS PAGE

**Route:** `/analytics` → `src/app/(dashboard)/analytics/page.tsx`

Build these chart components using `recharts`:

### 10.1 `RevenueChart.tsx`

- `AreaChart` with gradient fill
- X-axis: days of week (Mon-Sun)
- Two lines: Revenue (blue) + Leads (purple)
- Custom tooltip showing both values
- Time range selector: 7D | 30D | 90D (tabs, changes mock data displayed)

### 10.2 `ConversionFunnelChart.tsx`

- Horizontal `BarChart`
- Shows each funnel stage with percentage of total
- Color-coded bars

### 10.3 `ChannelBreakdownChart.tsx`

- `PieChart` or `RadialBarChart`
- Shows split: WhatsApp / Instagram / Web
- Legend with count + percentage

### 10.4 `TopProductsTable.tsx`

- Table: Product Name | Sales Count | Revenue | Growth %
- Growth % shows green up arrow or red down arrow

### Assemble Analytics Page:

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <RevenueChart className="lg:col-span-2" />
  <ChannelBreakdownChart />
  <ConversionFunnelChart />
  <TopProductsTable className="lg:col-span-2" />
</div>
```

---

## PART 11 – SETTINGS PAGE

**Route:** `/settings` → `src/app/(dashboard)/settings/page.tsx`

Tabbed layout with these tabs:

### Tab 1: Business Profile

- Business name (input)
- Logo upload (drag + drop zone)
- Industry (select dropdown)
- Contact info fields
- Save button

### Tab 2: AI Agent

- AI Persona Name (input) — e.g. "Aria"
- Tone selector (Friendly / Professional / Casual) — radio pills
- Knowledge base text area ("Paste your product info here")
- Toggle: Auto follow-up (on/off switch)
- Toggle: Human handoff trigger (on/off)
- Save button

### Tab 3: Channels

- WhatsApp: connect button + status indicator (Connected / Not connected)
- Instagram: same
- Website Widget: embed code snippet in a dark code box + copy button

### Tab 4: Notifications

- Email notifications toggle
- Slack notifications toggle
- Push notifications toggle
- Each with description text

---

## PART 12 – CHAT WIDGET (EMBEDDABLE)

**File:** `src/components/chat/ChatWidget.tsx`

This is a floating chat bubble + popup panel for embedding on any website.

### Widget Bubble

- Fixed bottom-right (`bottom-6 right-6`)
- Blue circle button with chat icon
- On hover: scale up, show tooltip "Chat with us"
- Unread badge (red dot) when there are unread messages

### Chat Panel (opens when bubble is clicked)

- Positioned above the bubble, `w-80 h-[500px]`
- Rounded-2xl, shadow-2xl
- **Header:** Business name + "Online" green dot + minimize (−) and close (×) buttons
- **Body:**
  - Welcome message from AI: "👋 Hi! I'm Aria, your sales assistant. How can I help you today?"
  - Quick reply buttons row: **"View Prices"** | **"Talk to Sales"** | **"Place Order"**
  - Messages area (scrollable)
  - Customer messages: right-aligned, blue bubbles
  - AI messages: left-aligned, dark bubbles with small robot avatar
- **Lead capture form** (shown before first message if no lead captured):
  - "What's your name?" input
  - "Phone number" input
  - Submit button: "Start Chat"
- **Footer:** Text input + send button
- Animate open/close with `framer-motion` slide-up + fade

---

## PART 13 – GLOBAL STATE (ZUSTAND)

### `src/store/chat-store.ts`

```ts
interface ChatStore {
  selectedLeadId: string | null;
  conversations: Record<string, Message[]>;
  leads: Lead[];
  isAIMode: boolean;
  setSelectedLead: (id: string) => void;
  sendMessage: (leadId: string, content: string) => void;
  toggleAIMode: () => void;
  addIncomingMessage: (message: Message) => void;
}
```

### `src/store/dashboard-store.ts`

```ts
interface DashboardStore {
  stats: DashboardStats;
  isLoading: boolean;
  refreshStats: () => void;
}
```

---

## PART 14 – SOCKET.IO INTEGRATION (SIMULATED)

**File:** `src/lib/socket.ts`

Since there is no live backend yet, simulate real-time with `setInterval`.

```ts
// Simulate incoming messages every 15-30 seconds
// Simulate lead status updates every 30 seconds
// Simulate stat number changes every 60 seconds
// Export a mock socket object with .on() and .off() methods
```

In the `ChatWindow`, use this to simulate new incoming messages from customers, update the unread count badges, and show toast notifications using `react-hot-toast`.

---

## PART 15 – SHARED COMPONENTS

Build these reusable pieces first — they are used everywhere:

### `src/components/shared/`

| Component             | Description                                                              |
| --------------------- | ------------------------------------------------------------------------ |
| `StatusBadge.tsx`     | Takes `status: LeadStatus`, renders colored pill badge                   |
| `ChannelIcon.tsx`     | Takes `channel: Channel`, renders WhatsApp/Instagram/Web icon with color |
| `Avatar.tsx`          | Colored initials avatar, accepts `name` and optional `src`               |
| `StatCard.tsx`        | Reusable stat card with icon, label, value, change%                      |
| `EmptyState.tsx`      | Illustration + heading + subtext + optional CTA button                   |
| `LoadingSkeleton.tsx` | Animated skeleton placeholder matching each card shape                   |
| `PageHeader.tsx`      | Page title + subtitle + optional right-side actions slot                 |

---

## PART 16 – ANIMATIONS & POLISH

Apply these globally:

1. **Page transitions:** Wrap page content in a `motion.div` with `initial={{ opacity: 0, y: 10 }}` and `animate={{ opacity: 1, y: 0 }}` and `transition={{ duration: 0.3 }}`

2. **Hover states:** All cards get `hover:scale-[1.01] transition-transform duration-200`

3. **Loading states:** Show `LoadingSkeleton` components while data loads (simulate 800ms delay with `setTimeout`)

4. **Toast notifications:** Use `react-hot-toast` for:
   - "New message from {name}" (when simulated message arrives)
   - "Lead status updated"
   - "Settings saved"

5. **Pulsing indicators:**
   - Live conversations panel heading: pulsing green dot
   - Online status in chat widget: pulsing green dot
   - Use: `animate-pulse` Tailwind class

---

## PART 17 – MOBILE RESPONSIVENESS

All dashboard pages must work on mobile (≥ 375px):

- **Sidebar:** Hidden on mobile. Replace with a bottom navigation bar (`fixed bottom-0`) with icons only
  - Bottom nav items: Home | Chats | Leads | Sales | Settings
- **StatsCards:** `grid-cols-2` on mobile (stacked 2x2)
- **Overview grid:** Stack vertically on mobile (conversations panel on top, chat window below — full width)
- **ChatWindow on mobile:** Full screen overlay when conversation is selected, back button top-left
- **Tables:** Horizontal scroll on mobile, or collapse to card list view
- **TopBar on mobile:** Show only hamburger + logo + avatar (no search input — move to dedicated page)
- **Landing page:** All sections stack vertically, font sizes reduce, nav collapses to hamburger

---

## PART 18 – BUILD ORDER CHECKLIST

Follow this exact order:

- [ ] 1. Project setup + dependencies + folder structure
- [ ] 2. Type definitions (`src/types/index.ts`)
- [ ] 3. Mock data (`src/lib/mock-data.ts`)
- [ ] 4. Shared components (StatusBadge, ChannelIcon, Avatar, StatCard, EmptyState)
- [ ] 5. Design tokens in Tailwind config
- [ ] 6. Landing page — Navbar
- [ ] 7. Landing page — HeroSection
- [ ] 8. Landing page — FeaturesSection
- [ ] 9. Landing page — PricingSection
- [ ] 10. Landing page — SocialProof + CTA + Footer
- [ ] 11. Dashboard shell — Sidebar + TopBar + layout
- [ ] 12. Dashboard — StatsCards
- [ ] 13. Dashboard — LiveConversationsPanel
- [ ] 14. Dashboard — ChatWindow
- [ ] 15. Dashboard — SalesFunnelWidget
- [ ] 16. Dashboard — RecentSalesTable
- [ ] 17. Assemble Overview page
- [ ] 18. Conversations full page
- [ ] 19. Leads page (Kanban)
- [ ] 20. Sales page
- [ ] 21. Analytics page (all charts)
- [ ] 22. Settings page (all tabs)
- [ ] 23. Chat Widget (embeddable bubble)
- [ ] 24. Zustand stores
- [ ] 25. Socket.IO simulation
- [ ] 26. Mobile responsiveness pass
- [ ] 27. Animation + polish pass
- [ ] 28. Final QA pass

---

## PART 19 – DEMO ROUTES (No Auth Required)

For the MVP, skip authentication. All dashboard routes are publicly accessible at:

| URL              | Page               |
| ---------------- | ------------------ |
| `/`              | Landing Page       |
| `/overview`      | Dashboard Overview |
| `/conversations` | Conversations      |
| `/leads`         | Leads (Kanban)     |
| `/sales`         | Sales              |
| `/analytics`     | Analytics          |
| `/settings`      | Settings           |

Add a visible banner on dashboard pages: **"Demo Mode – No real data"** (subtle gray bar at very top)

---

## PART 20 – PERFORMANCE NOTES

- Use `next/image` for all images
- Use `React.memo` on conversation list items (re-render only on change)
- Use `dynamic()` import with `ssr: false` for charts (Recharts does not support SSR)
- Use `loading.tsx` files for each dashboard route (show skeletons)
- Keep bundle size in check: no moment.js (use `date-fns`), no lodash (use native)

---

## NOTES FOR THE CODING AGENT

- Do NOT skip any section. Build everything described.
- Every component should be in its own file.
- Use TypeScript throughout — no `any` types.
- All currency values displayed as Nigerian Naira: `₦` symbol.
- Dark theme only — no light mode toggle needed for MVP.
- The chat widget (`ChatWidget.tsx`) should also be exportable as a standalone script later — build it in isolation so it has no dependencies on the dashboard layout.
- When in doubt about design: refer to the color tokens in Part 1. Dark backgrounds, blue accents, clean minimal UI.
- Placeholder images: use `https://api.dicebear.com/7.x/initials/svg?seed={name}` for avatars.

---

_SmartSales AI — Built to Sell While You Sleep. 🚀_
