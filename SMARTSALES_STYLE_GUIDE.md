# SmartSales AI — Frontend Style Guide
### The single source of truth for all visual decisions in the SmartSales AI platform
**Version:** 1.0 | **Stack:** React + Next.js 14 (App Router) + Tailwind CSS + shadcn/ui | **Theme:** Dark Only

> **For AI assistants and developers:** Read this entire file before touching any component. Every styling decision — color, spacing, typography, radius, shadow, state, animation — is defined here. Never hardcode values that exist as tokens. Never invent styles not in this guide. When in doubt, reference the token system below.

---

## 0 — CORE PRINCIPLE

SmartSales AI is a **sales automation platform for businesses** — primarily used by SME owners, sales managers, and growth teams across Africa. The aesthetic is **modern dark SaaS** — energetic but professional. Not a dev tool. Not a crypto dashboard. The goal is *trust + speed + intelligence* — every design decision should reinforce that this product works hard so the user doesn't have to.

**Three rules above all:**

1. **Use the token system.** Never hardcode hex colors, arbitrary spacing, or font families in JSX.
2. **Dark only.** There is no light mode in the MVP. Every surface must observe the layering hierarchy below.
3. **Naira first.** All monetary values are displayed with the ₦ symbol, formatted through the `formatCurrency()` utility. Never render raw numbers for financial figures.

---

## 1 — COLOR SYSTEM

### 1.1 Background Layers (deepest → shallowest)

| Token Name | Hex | Tailwind Class | Used For |
|---|---|---|---|
| `bg-dark` | `#0F172A` | `bg-dark` | Page background, outermost shell |
| `bg-dark-card` | `#1E293B` | `bg-dark-card` | All cards, sidebar, panels, sub-surfaces |
| `bg-dark-border` | `#334155` | `bg-dark-border` / `border-dark-border` | All borders, dividers, separators |

**Layering rule:** Surfaces must be stacked correctly. A card (`#1E293B`) sits on the page background (`#0F172A`). Never place a card directly on another card without a perceptible depth change. For nested panels inside cards, use `bg-dark` as the inner background to create inversion depth.

### 1.2 Brand & Accent Colors

| Token Name | Hex | Tailwind Class | Used For |
|---|---|---|---|
| `brand-blue` | `#2563EB` | `bg-brand-blue` / `text-brand-blue` | Primary CTAs, active nav, links, primary buttons, focus rings |
| `brand-purple` | `#7C3AED` | `bg-brand-purple` / `text-brand-purple` | AI indicators, secondary accents, gradient pair with blue |
| `brand-green` | `#22C55E` | `bg-brand-green` / `text-brand-green` | Success states, completed sales, WhatsApp channel, positive trends |
| `brand-orange` | `#F97316` | `bg-brand-orange` / `text-brand-orange` | Warning states, pending items, revenue highlight, warm leads |

### 1.3 Semantic Colors

These are not brand colors — they carry universal meaning. Use them strictly for their defined purpose.

| Purpose | Hex | Tailwind Class | Used For |
|---|---|---|---|
| Success | `#22C55E` | `text-green-500` / `bg-green-500` | Completed, converted, online, positive % change |
| Warning | `#F97316` | `text-orange-500` / `bg-orange-500` | Pending, warm, needs attention |
| Danger | `#EF4444` | `text-red-500` / `bg-red-500` | Lost, refunded, critical, negative % change |
| Info | `#3B82F6` | `text-blue-500` / `bg-blue-500` | New lead status, informational banners |
| AI Purple | `#7C3AED` | `text-purple-600` / `bg-purple-600` | AI agent messages, AI mode indicators |

### 1.4 Text Colors

| Token | Hex | Tailwind Class | Used For |
|---|---|---|---|
| Text Primary | `#F8FAFC` | `text-slate-50` | All headings, stat values, primary content |
| Text Muted | `#94A3B8` | `text-slate-400` | Labels, timestamps, secondary descriptions, metadata |
| Text Dim | `#475569` | `text-slate-600` | Placeholder text, tertiary content, disabled text |

### 1.5 Channel Colors

Each channel has a fixed color identity. Never swap these.

```typescript
// src/lib/constants.ts
export const CHANNEL_COLORS = {
  whatsapp:  { bg: 'bg-green-500/10',  text: 'text-green-400',  border: 'border-green-500/20',  hex: '#22C55E' },
  instagram: { bg: 'bg-pink-500/10',   text: 'text-pink-400',   border: 'border-pink-500/20',   hex: '#EC4899' },
  web:       { bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/20',   hex: '#3B82F6' },
};
```

### 1.6 Lead Status Colors

```typescript
export const LEAD_STATUS_COLORS = {
  new:    { bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/20'   },
  hot:    { bg: 'bg-red-500/10',    text: 'text-red-400',    border: 'border-red-500/20'    },
  warm:   { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  closed: { bg: 'bg-green-500/10',  text: 'text-green-400',  border: 'border-green-500/20'  },
  lost:   { bg: 'bg-slate-500/10',  text: 'text-slate-400',  border: 'border-slate-500/20'  },
};
```

### 1.7 Sale Status Colors

```typescript
export const SALE_STATUS_COLORS = {
  completed: { bg: 'bg-green-500/10',  text: 'text-green-400',  border: 'border-green-500/20'  },
  pending:   { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  refunded:  { bg: 'bg-red-500/10',    text: 'text-red-400',    border: 'border-red-500/20'    },
};
```

### 1.8 Trend / Change Indicator Colors

```typescript
export const TREND_COLOR = (change: number) => {
  if (change > 0)  return { text: 'text-green-400', icon: 'TrendingUp'  };
  if (change < 0)  return { text: 'text-red-400',   icon: 'TrendingDown' };
  return { text: 'text-slate-400', icon: 'Minus' };
};
```

---

## 2 — TYPOGRAPHY

### 2.1 Font Stack

```css
/* src/app/globals.css */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

body {
  font-family: 'Inter', sans-serif;
  background-color: #0F172A;
  color: #F8FAFC;
}
```

**Tailwind Config:**
```ts
fontFamily: {
  sans: ['Inter', 'sans-serif'],
}
```

> SmartSales AI uses a single font family — **Inter** at various weights. This is intentional: Inter at weight 400–800 covers every hierarchy need cleanly without cognitive load from font switching. The visual hierarchy is built through weight, size, and color — not font-family changes.

### 2.2 Type Scale

| Element | Size | Weight | Line Height | Class |
|---|---|---|---|---|
| Hero headline | 60–72px | 800 | 1.1 | `text-6xl lg:text-7xl font-extrabold` |
| Page section heading | 36px | 700 | 1.2 | `text-4xl font-bold` |
| Card title | 14px | 600 | 1.4 | `text-sm font-semibold` |
| Stat value (hero) | 28–32px | 700 | 1 | `text-3xl font-bold tabular-nums` |
| Stat value (card) | 22–24px | 700 | 1 | `text-2xl font-bold tabular-nums` |
| Nav label | 13px | 500 | 1.4 | `text-sm font-medium` |
| Body text | 14px | 400 | 1.6 | `text-sm` |
| Badge / pill label | 11px | 500 | 1 | `text-xs font-medium` |
| Table header | 11px | 600 | 1 | `text-xs font-semibold uppercase tracking-wider` |
| Table cell | 13–14px | 400 | 1.4 | `text-sm` |
| Timestamp / meta | 11px | 400 | 1 | `text-xs text-slate-400` |
| Section label | 11px | 600 | 1 | `text-xs font-semibold uppercase tracking-widest` |
| Button text | 13–14px | 600 | 1 | `text-sm font-semibold` |
| Input text | 14px | 400 | 1.4 | `text-sm` |
| Placeholder | 14px | 400 | 1.4 | `text-sm text-slate-600` |

**Critical rule:** Always add `tabular-nums` to any numeric display value (revenue, chat count, lead count, etc.). This prevents layout shift as numbers animate or update.

### 2.3 Gradient Text (Brand Headlines)

The primary logo and hero headline use a blue-to-purple gradient:

```tsx
// Logo text / headline gradient
<span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-bold">
  SmartSales AI
</span>
```

Use gradient text **only** for:
- The brand logo wordmark
- The hero section primary headline
- Feature section headings on the landing page

**Never** use gradient text in the dashboard body UI — it loses legibility at small sizes.

---

## 3 — SPACING SYSTEM

**Rule:** Only use values from this scale. Never write `style={{ padding: '13px' }}` or `mt-[17px]`.

| Token | Value | Tailwind | Used For |
|---|---|---|---|
| space-1 | 4px | `p-1` / `gap-1` | Icon dot margins, minimal separators |
| space-2 | 8px | `p-2` / `gap-2` | Inline icon-text gaps, badge padding-x |
| space-3 | 12px | `p-3` / `gap-3` | Nav item padding, tight chip rows |
| space-4 | 16px | `p-4` / `gap-4` | Card body (compact), grid gap (tight) |
| space-5 | 20px | `p-5` / `gap-5` | Card body (standard) |
| space-6 | 24px | `p-6` / `gap-6` | Main content padding, section gaps |
| space-8 | 32px | `p-8` / `gap-8` | Large section separation |
| space-10 | 40px | `p-10` | — |
| space-12 | 48px | `p-12` | Landing section vertical padding |
| space-16 | 64px | `p-16` | — |
| space-20 | 80px | `py-20` | Landing section vertical rhythm |
| space-24 | 96px | `py-24` | Hero section vertical padding |

### 3.1 Layout Constants

| Zone | Property | Value |
|---|---|---|
| Sidebar | `width` | `256px` (`w-64`) |
| TopBar | `height` | `64px` (`h-16`) |
| Main content `margin-left` | | `256px` (`ml-64`) |
| Main content `margin-top` | | `64px` (`mt-16`) |
| Main content `padding` | | `24px` (`p-6`) |
| Card body padding | | `20–24px` (`p-5` or `p-6`) |
| Card header padding | | `16px 20px` (`px-5 py-4`) |
| Conversation item padding | | `12px 16px` (`px-4 py-3`) |
| Nav item padding | | `10px 12px` (`px-3 py-2.5`) |
| Badge padding | | `2px 8px` (`px-2 py-0.5`) |
| Button sm padding | | `6px 12px` (`px-3 py-1.5`) |
| Button md padding | | `8px 16px` (`px-4 py-2`) |
| Button lg padding | | `12px 24px` (`px-6 py-3`) |
| Table cell padding | | `12px 16px` (`px-4 py-3`) |
| Chat message bubble padding | | `10px 14px` (`px-3.5 py-2.5`) |

---

## 4 — BORDER RADIUS

| Name | Value | Tailwind | Used For |
|---|---|---|---|
| `xs` | 4px | `rounded` | — |
| `sm` | 6px | `rounded-md` | Small inner elements, chip accents |
| `md` | 8px | `rounded-lg` | Buttons, inputs, nav items, small cards, icon containers, message bubbles |
| `lg` | 12px | `rounded-xl` | Main cards, panels, stat cards, chart containers, dropdowns |
| `xl` | 16px | `rounded-2xl` | Feature cards, pricing cards, chat widget panel, modal dialogs |
| `2xl` | 24px | `rounded-3xl` | Landing hero card mockup, large promotional elements |
| `full` | 9999px | `rounded-full` | All badges/pills, avatar circles, floating action buttons, toggle switches |

---

## 5 — BORDERS

All standard borders use a single color: `#334155` (`border-dark-border` / `border-slate-700`).

| Context | Style |
|---|---|
| Card default | `border border-slate-700/50` |
| Card hover | `border-blue-500/50` (transition on hover) |
| Sidebar active nav item | `bg-blue-600/10 text-blue-400` (no left-border; full bg highlight instead) |
| Input default | `border border-slate-700` |
| Input focus | `border-blue-500/60 ring-2 ring-blue-500/15` |
| Section divider | `border-b border-slate-700/50` |
| CardHeader bottom | `border-b border-slate-700/50` |
| Conversation list item separator | `border-b border-slate-700/30 last:border-0` |
| Table row separator | `border-b border-slate-700/30 last:border-0` |
| Chat message: customer | no border |
| Chat message: AI | no border |

**Semantic badge borders:**
```
new / info:     border border-blue-500/20
hot:            border border-red-500/20
warm:           border border-orange-500/20
closed:         border border-green-500/20
lost:           border border-slate-500/20
pending:        border border-orange-500/20
refunded:       border border-red-500/20
completed:      border border-green-500/20
```

**Pricing card highlighted border:**
```tsx
// Growth / recommended tier only
className="border-2 border-blue-500 shadow-lg shadow-blue-500/20"
```

---

## 6 — SHADOWS

```ts
// tailwind.config.ts
boxShadow: {
  'card':        '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(51,65,85,0.5)',
  'card-hover':  '0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(37,99,235,0.15)',
  'blue':        '0 0 20px rgba(37,99,235,0.2)',
  'purple':      '0 0 20px rgba(124,58,237,0.2)',
  'green':       '0 0 20px rgba(34,197,94,0.15)',
  'widget':      '0 25px 60px rgba(0,0,0,0.7)',
  'pricing-glow':'0 8px 40px rgba(37,99,235,0.25)',
}
```

| Shadow | When to Use |
|---|---|
| `shadow-card` | Default on all `<Card>` components |
| `shadow-card-hover` | On card hover state |
| `shadow-blue` | Primary button hover; highlighted pricing card |
| `shadow-purple` | AI message bubbles, AI indicator glow |
| `shadow-green` | Success confirmation banners |
| `shadow-widget` | Chat widget floating panel |
| `shadow-pricing-glow` | Recommended pricing card |

---

## 7 — COMPONENT SPECIFICATIONS

### 7.1 Card

```tsx
// Standard card
<div className="bg-dark-card rounded-xl border border-slate-700/50 shadow-card
                hover:border-blue-500/30 hover:shadow-card-hover
                transition-all duration-200">
  {/* content */}
</div>
```

- Default: `bg-dark-card`, `border-slate-700/50`, `shadow-card`
- Hover: `border-blue-500/30`, `shadow-card-hover`, subtle `translateY(-2px)` (via framer-motion or `hover:-translate-y-0.5`)
- Never add a colored left border to standard cards
- Pricing highlighted card only: `border-2 border-blue-500 shadow-pricing-glow`

### 7.2 CardHeader

```tsx
<div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
  <div className="flex items-center gap-3">
    {/* Icon container */}
    <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-400">
      <IconComponent size={16} />
    </div>
    <div>
      <h3 className="text-sm font-semibold text-slate-50">{title}</h3>
      {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  </div>
  {action && <div>{action}</div>}
</div>
```

### 7.3 Badge / Status Pill

```tsx
// Base structure — always this pattern
<span className={cn(
  "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
  variantClasses
)}>
  {withDot && <span className={cn("w-1.5 h-1.5 rounded-full", dotColor)} />}
  {label}
</span>

// Variant classes
// Success / closed / completed:
"bg-green-500/10 text-green-400 border border-green-500/20"

// Warning / warm / pending:
"bg-orange-500/10 text-orange-400 border border-orange-500/20"

// Danger / hot / refunded:
"bg-red-500/10 text-red-400 border border-red-500/20"

// Info / new:
"bg-blue-500/10 text-blue-400 border border-blue-500/20"

// Neutral / lost:
"bg-slate-500/10 text-slate-400 border border-slate-500/20"

// AI / purple:
"bg-purple-500/10 text-purple-400 border border-purple-500/20"
```

Always include the animated dot for live status indicators (conversations panel, widget online status):

```tsx
<span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
```

### 7.4 Button

```tsx
// Primary (main CTA — blue)
"bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg
 shadow-blue hover:-translate-y-0.5
 focus:outline-none focus:ring-2 focus:ring-blue-500/50
 transition-all duration-200
 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"

// Primary gradient (landing CTAs only)
"bg-gradient-to-r from-blue-600 to-purple-600
 hover:from-blue-500 hover:to-purple-500
 text-white font-semibold rounded-full
 shadow-blue hover:-translate-y-0.5
 transition-all duration-200"

// Secondary / outline
"bg-transparent border border-slate-600 hover:border-blue-500/50
 text-slate-300 hover:text-slate-50 font-semibold rounded-lg
 transition-all duration-200"

// Ghost
"bg-transparent text-slate-400 hover:text-slate-50 hover:bg-slate-700/50
 font-medium rounded-lg transition-all duration-200"

// Danger
"bg-red-500/10 text-red-400 border border-red-500/20
 hover:bg-red-500/20 font-semibold rounded-lg
 transition-all duration-200"

// Size: sm
"px-3 py-1.5 text-xs"

// Size: md (default)
"px-4 py-2 text-sm"

// Size: lg
"px-6 py-3 text-base"
```

**Always include:**
```tsx
"inline-flex items-center justify-center gap-2"
```

### 7.5 Input / Form Field

```tsx
// Standard input
<input className="
  w-full bg-dark-card border border-slate-700 rounded-lg
  px-4 py-2.5 text-sm text-slate-50
  placeholder:text-slate-600
  focus:outline-none focus:border-blue-500/60
  focus:ring-2 focus:ring-blue-500/15
  transition-colors duration-150
" />

// Search input (with left icon)
<div className="relative">
  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
  <input className="
    w-full bg-dark-card border border-slate-700 rounded-full
    pl-9 pr-4 py-2 text-sm text-slate-50
    placeholder:text-slate-600
    focus:outline-none focus:border-blue-500/60
    focus:ring-2 focus:ring-blue-500/15
    transition-colors duration-150
  " />
</div>

// Label
<label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
  Field Label
</label>
```

### 7.6 Sidebar Navigation

```tsx
// Sidebar wrapper
<aside className="fixed left-0 top-0 h-screen w-64 bg-dark-card border-r border-slate-700/50 flex flex-col z-40">
  {/* Logo */}
  {/* Nav list */}
  {/* Bottom user section */}
</aside>

// Nav item
<Link
  href={href}
  className={cn(
    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
    isActive
      ? "bg-blue-600/10 text-blue-400"
      : "text-slate-400 hover:text-slate-50 hover:bg-slate-700/50"
  )}
>
  <Icon size={16} />
  {label}
</Link>
```

No left-border on the active nav item — the background highlight alone carries the active state.

### 7.7 TopBar

```tsx
<header className="fixed top-0 left-64 right-0 h-16 bg-dark/80 backdrop-blur-md
                   border-b border-slate-700/50 flex items-center px-6 z-30">
  {/* Left: page title */}
  {/* Right: search, bell, avatar */}
</header>
```

### 7.8 Stat Card

```tsx
<div className="bg-dark-card rounded-xl border border-slate-700/50 shadow-card p-5">
  <div className="flex items-start justify-between">
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-slate-50 tabular-nums mt-1">{value}</p>
      <div className={cn("flex items-center gap-1 text-xs mt-1.5", trendColor)}>
        <TrendIcon size={12} />
        <span>{change}% vs yesterday</span>
      </div>
    </div>
    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", iconBg)}>
      <StatIcon size={18} className={iconColor} />
    </div>
  </div>
</div>

// Icon backgrounds per stat:
// Chats:   bg-blue-600/10    icon: text-blue-400
// Leads:   bg-purple-600/10  icon: text-purple-400
// Sales:   bg-green-500/10   icon: text-green-400
// Revenue: bg-orange-500/10  icon: text-orange-400
```

### 7.9 Conversation List Item

```tsx
<div
  onClick={() => setSelected(lead.id)}
  className={cn(
    "flex items-start gap-3 px-4 py-3 cursor-pointer transition-all duration-150",
    "border-b border-slate-700/30 last:border-0",
    isSelected
      ? "bg-blue-600/10 border-l-2 border-l-blue-500"
      : "hover:bg-slate-700/30"
  )}
>
  {/* Avatar */}
  {/* Content: name, phone, preview */}
  {/* Right: time, unread badge */}
</div>
```

- Selected state: `bg-blue-600/10` + `border-l-2 border-l-blue-500`
- Unread badge: solid red pill (`bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5`)

### 7.10 Chat Message Bubble

```tsx
// Customer message (left)
<div className="flex justify-start mb-3">
  <div className="max-w-[75%] bg-slate-700/50 text-slate-100 rounded-lg rounded-tl-sm px-3.5 py-2.5 text-sm">
    {content}
    <span className="block text-xs text-slate-500 mt-1 text-right">{time}</span>
  </div>
</div>

// AI message (right)
<div className="flex justify-end mb-3">
  <div className="max-w-[75%]">
    <div className="flex items-center justify-end gap-1.5 mb-1">
      <span className="text-xs text-purple-400 font-medium">🤖 AI</span>
      {intentTag && (
        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-1.5 py-0.5 rounded-full">
          {intentTag}
        </span>
      )}
    </div>
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg rounded-tr-sm px-3.5 py-2.5 text-sm shadow-blue">
      {content}
      <span className="block text-xs text-blue-200/70 mt-1 text-right">{time}</span>
    </div>
  </div>
</div>

// Agent message (right, human takeover active)
<div className="flex justify-end mb-3">
  <div className="max-w-[75%] bg-gradient-to-br from-slate-600 to-slate-700 text-white rounded-lg rounded-tr-sm px-3.5 py-2.5 text-sm">
    {content}
    <span className="block text-xs text-slate-300/70 mt-1 text-right">{time}</span>
  </div>
</div>
```

### 7.11 Avatar (Initials)

```tsx
// Standard (32px)
<div
  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
  style={{ backgroundColor: getAvatarColor(name) }}
>
  {name.charAt(0).toUpperCase()}
</div>

// Large (40px — sidebar user)
<div
  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
  style={{ backgroundColor: getAvatarColor(name) }}
>
  {name.charAt(0).toUpperCase()}
</div>

// Avatar color utility
const AVATAR_COLORS = [
  '#2563EB', '#7C3AED', '#059669', '#D97706',
  '#DC2626', '#0891B2', '#7C3AED', '#BE185D',
];

export const getAvatarColor = (name: string): string => {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};
```

For dicebear avatars, use: `https://api.dicebear.com/7.x/initials/svg?seed={encodeURIComponent(name)}`

### 7.12 Icon Container (CardHeader / Stat)

```tsx
// Blue (default)
<div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-400">
  <IconComponent size={16} />
</div>

// Purple (AI / leads)
<div className="w-8 h-8 rounded-lg bg-purple-600/10 flex items-center justify-center text-purple-400">
  <IconComponent size={16} />
</div>

// Green (sales / success)
<div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
  <IconComponent size={16} />
</div>

// Orange (revenue / warning)
<div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
  <IconComponent size={16} />
</div>
```

### 7.13 Table

```tsx
// Table wrapper card
<div className="bg-dark-card rounded-xl border border-slate-700/50 shadow-card overflow-hidden">
  {/* CardHeader */}
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-slate-700/50 bg-dark/30">
          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Column
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-slate-700/30 last:border-0 hover:bg-slate-700/20 transition-colors">
          <td className="px-4 py-3 text-sm text-slate-200">
            Value
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

- Header background: `bg-dark/30` (slightly darker than card)
- Row hover: `hover:bg-slate-700/20`
- All column header text: uppercase, tracked, `text-xs font-semibold text-slate-400`

### 7.14 Filter Tab Bar

```tsx
<div className="flex items-center gap-1 bg-dark rounded-xl border border-slate-700/50 p-1">
  {tabs.map(tab => (
    <button
      key={tab.value}
      onClick={() => setActive(tab.value)}
      className={cn(
        "px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150",
        active === tab.value
          ? "bg-dark-card text-slate-50 shadow-sm"
          : "text-slate-400 hover:text-slate-200"
      )}
    >
      {tab.label}
    </button>
  ))}
</div>
```

### 7.15 Live / Online Indicator

```tsx
// Active conversations panel heading dot
<span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

// Widget online status
<span className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
  Online
</span>

// Demo mode banner (top of all dashboard pages)
<div className="w-full bg-slate-800/50 border-b border-slate-700/30 text-center py-1.5">
  <p className="text-xs text-slate-500 font-medium">
    Demo Mode — No real data
  </p>
</div>
```

### 7.16 Sales Funnel Stage

```tsx
// Stage bar (horizontal funnel)
<div className="space-y-3">
  {stages.map((stage, i) => (
    <div key={stage.stage} className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-300 font-medium">{stage.stage}</span>
        <span className="text-slate-50 font-bold tabular-nums">{stage.count.toLocaleString()}</span>
      </div>
      <div className="w-full bg-dark rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${(stage.count / stages[0].count) * 100}%`,
            background: stage.color
          }}
        />
      </div>
      {i < stages.length - 1 && (
        <p className="text-xs text-slate-500 text-right">
          {Math.round((stages[i + 1].count / stage.count) * 100)}% conversion →
        </p>
      )}
    </div>
  ))}
</div>
```

### 7.17 Toast Notifications

```tsx
// react-hot-toast config in root layout
import { Toaster } from 'react-hot-toast';

<Toaster
  position="top-right"
  toastOptions={{
    style: {
      background: '#1E293B',
      color: '#F8FAFC',
      border: '1px solid #334155',
      borderRadius: '12px',
      fontFamily: 'Inter, sans-serif',
      fontSize: '13px',
      padding: '12px 16px',
    },
    success: {
      style: { borderLeft: '3px solid #22C55E' },
      iconTheme: { primary: '#22C55E', secondary: '#1E293B' },
    },
    error: {
      style: { borderLeft: '3px solid #EF4444' },
      iconTheme: { primary: '#EF4444', secondary: '#1E293B' },
    },
  }}
/>
```

### 7.18 Pricing Card

```tsx
// Standard tier
<div className="bg-dark-card rounded-2xl border border-slate-700/50 shadow-card p-6 flex flex-col">
  {/* Tier name, price, features, CTA */}
</div>

// Recommended tier (Growth)
<div className="bg-dark-card rounded-2xl border-2 border-blue-500 shadow-pricing-glow
                p-6 flex flex-col relative scale-105">
  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold
                     px-3 py-1 rounded-full">
      Most Popular
    </span>
  </div>
  {/* Tier name, price, features, CTA */}
</div>
```

### 7.19 Chat Widget (Embeddable Bubble)

```tsx
// Floating bubble
<button
  className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600
             flex items-center justify-center shadow-widget text-white z-[9999]
             hover:scale-110 transition-transform duration-200"
>
  <MessageCircle size={24} />
  {unreadCount > 0 && (
    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs
                     flex items-center justify-center font-bold">
      {unreadCount}
    </span>
  )}
</button>

// Chat panel
<div className="fixed bottom-24 right-6 w-80 h-[500px] bg-dark-card rounded-2xl shadow-widget
                border border-slate-700/50 flex flex-col overflow-hidden z-[9999]">
  {/* Header: name + online + controls */}
  {/* Body: messages */}
  {/* Footer: input */}
</div>
```

### 7.20 Empty State

```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  {/* Icon in circle */}
  <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mb-4">
    <EmptyIcon size={28} className="text-slate-500" />
  </div>
  <h3 className="text-slate-300 font-semibold text-base">{heading}</h3>
  <p className="text-slate-500 text-sm mt-1 max-w-xs">{subtext}</p>
  {cta && (
    <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors">
      {cta}
    </button>
  )}
</div>
```

### 7.21 Skeleton Loader

```tsx
// Generic skeleton block
<div className="animate-pulse bg-slate-700/50 rounded-lg" style={{ height, width }} />

// Stat card skeleton
<div className="bg-dark-card rounded-xl border border-slate-700/50 shadow-card p-5 animate-pulse">
  <div className="flex items-start justify-between">
    <div className="space-y-2 flex-1">
      <div className="h-3 bg-slate-700/50 rounded w-24" />
      <div className="h-7 bg-slate-700/50 rounded w-32" />
      <div className="h-3 bg-slate-700/50 rounded w-20" />
    </div>
    <div className="w-10 h-10 bg-slate-700/50 rounded-lg" />
  </div>
</div>

// Conversation item skeleton
<div className="flex items-start gap-3 px-4 py-3 animate-pulse">
  <div className="w-8 h-8 rounded-full bg-slate-700/50 shrink-0" />
  <div className="flex-1 space-y-1.5">
    <div className="h-3.5 bg-slate-700/50 rounded w-28" />
    <div className="h-3 bg-slate-700/50 rounded w-44" />
  </div>
</div>
```

---

## 8 — INTERACTIVE STATES

Every interactive element must have visible hover and focus states. No exceptions.

| Element | Default | Hover | Focus / Active |
|---|---|---|---|
| Card | `border-slate-700/50` | `border-blue-500/30` + `translateY(-2px)` | — |
| Nav item | `text-slate-400`, transparent | `text-slate-50 bg-slate-700/50` | `bg-blue-600/10 text-blue-400` |
| Input | `border-slate-700` | same (no change) | `border-blue-500/60 ring-2 ring-blue-500/15` |
| Button primary | `bg-blue-600` | `bg-blue-500 translateY(-1px)` | `ring-2 ring-blue-500/50` |
| Button secondary | `border-slate-600` | `border-blue-500/50 text-slate-50` | `ring-2 ring-blue-500/50` |
| Conversation item | transparent | `bg-slate-700/30` | `bg-blue-600/10 border-l-2 border-l-blue-500` |
| Table row | transparent | `bg-slate-700/20` | — |
| Tab / filter | `text-slate-400` | `text-slate-200` | `bg-dark-card text-slate-50` |
| Sidebar item | `text-slate-400` | `text-slate-50 bg-slate-700/50` | `bg-blue-600/10 text-blue-400` |
| Chat bubble (widget) | — | subtle scale-[1.01] | — |

**All transitions:** `transition-all duration-150` or `transition-colors duration-200`. Never `duration-0`. Buttons get `transition-all duration-200`.

---

## 9 — ANIMATIONS

### 9.1 Global Animation CSS

```css
/* src/app/globals.css */

/* Custom scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: #0F172A; }
::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #475569; }

/* Floating animation for hero mockup */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}
.animate-float { animation: float 4s ease-in-out infinite; }

/* Pulsing for live dots */
/* Uses Tailwind's built-in animate-pulse */

/* Slide up for chat widget panel */
@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
.animate-slide-up { animation: slide-up 0.25s ease-out; }
```

### 9.2 Framer Motion Patterns

```tsx
// Page entrance (wrap all page content)
const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

// Staggered card grid entrance
const containerVariants = {
  animate: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// Landing section scroll-triggered fade-up
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
};

// Chat widget open/close
const widgetVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit:    { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.15 } },
};

// Navbar entrance
const navVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};
```

### 9.3 Animation Usage Table

| Animation | Applied To |
|---|---|
| `animate-float` | Hero section mockup graphic |
| `animate-pulse` | Live conversation dot, widget online dot, skeleton loaders |
| `staggerChildren: 0.08` | Stats cards grid, feature cards grid, conversation list load |
| `fadeUp` + `whileInView` | All landing page sections (scroll-triggered) |
| `widgetVariants` | Chat widget panel open/close |
| `transition: stroke-dasharray 0.7s ease` | Any SVG progress rings |
| `hover:-translate-y-0.5` | All cards on hover |
| `hover:-translate-y-px` | All primary buttons on hover |
| Page `opacity: 0 → 1, y: 10 → 0` | Every dashboard page mount |

---

## 10 — PAGE LAYOUTS

### 10.1 Dashboard Overview
```
[Demo banner — full width, subtle, top]
[StatsCards — grid-cols-2 lg:grid-cols-4, gap-4, mb-6]
[grid grid-cols-1 lg:grid-cols-[35%_65%] gap-6, mb-6]
  [LiveConversationsPanel]
  [ChatWindow]
[grid grid-cols-1 lg:grid-cols-[40%_60%] gap-6]
  [SalesFunnelWidget]
  [RecentSalesTable]
```

### 10.2 Conversations Page
```
[Full height: calc(100vh - 64px - 32px)]
[flex h-full gap-0]
  [Left panel: w-80 shrink-0 — search + filter tabs + conversation list]
  [Divider: border-r border-slate-700/50]
  [Right panel: flex-1 — ChatWindow full height or empty state]
```

### 10.3 Leads Page
```
[PageHeader + Add Lead button, mb-6]
[Filter row: search + channel filter + status filter + date, mb-6]
[Toggle: Kanban / Table (top-right)]

// Kanban view
[grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4]
  [Column: New (blue)]
  [Column: Interested (purple)]
  [Column: Negotiating (orange)]
  [Column: Converted (green)]

// Table view
[Full-width table card]
```

### 10.4 Sales Page
```
[grid grid-cols-2 lg:grid-cols-4 gap-4, mb-6]
  [Mini stat cards × 4]
[Filter row + Export CSV button, mb-4]
[Full-width RecentSalesTable with pagination]
```

### 10.5 Analytics Page
```
[grid grid-cols-1 lg:grid-cols-2 gap-6]
  [RevenueChart — lg:col-span-2]
  [ChannelBreakdownChart]
  [ConversionFunnelChart]
  [TopProductsTable — lg:col-span-2]
```

### 10.6 Settings Page
```
[PageHeader, mb-6]
[Tabs: Business Profile | AI Agent | Channels | Notifications]
[Tab content card — bg-dark-card rounded-xl border border-slate-700/50 p-6]
```

### 10.7 Landing Page
```
[Navbar — sticky, backdrop-blur-md]
[HeroSection — min-h-screen, centered]
[FeaturesSection — py-24]
[SocialProofSection — py-20]
[PricingSection — py-24]
[CTASection — py-20, gradient bg]
[Footer — bg-[#0A0F1E]]
```

---

## 11 — RECHARTS CHART STYLES

All charts must use these styles. Never use Recharts default colors.

### 11.1 Chart Color Palette

```ts
// src/lib/constants.ts
export const CHART_COLORS = {
  blue:   '#2563EB',
  purple: '#7C3AED',
  green:  '#22C55E',
  orange: '#F97316',
  pink:   '#EC4899',
};
```

### 11.2 Common Chart Props

```tsx
// Area/Line Chart
<CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
<XAxis dataKey="day" stroke="#475569" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
<YAxis stroke="#475569" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
<Tooltip
  contentStyle={{
    background: '#1E293B',
    border: '1px solid #334155',
    borderRadius: '8px',
    color: '#F8FAFC',
    fontSize: '12px',
    padding: '8px 12px',
  }}
  cursor={{ stroke: '#334155' }}
/>

// Area gradient definition
<defs>
  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%"  stopColor="#2563EB" stopOpacity={0.3} />
    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
  </linearGradient>
  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%"  stopColor="#7C3AED" stopOpacity={0.3} />
    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
  </linearGradient>
</defs>

// Legend
<Legend
  iconType="circle"
  iconSize={8}
  wrapperStyle={{ fontSize: '12px', color: '#94A3B8', paddingTop: '16px' }}
/>
```

### 11.3 Pie / Radial Chart Colors

```ts
const PIE_COLORS = ['#2563EB', '#EC4899', '#22C55E'];
// whatsapp → blue, instagram → pink, web → green
```

---

## 12 — FORMATTING UTILITIES

Always use these formatters. Never format inline.

```typescript
// src/lib/utils.ts

// Currency
export const formatCurrency = (amount: number): string => {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000)     return `₦${(amount / 1_000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  return `₦${amount.toLocaleString()}`;
};
// formatCurrency(184500) → '₦184,500'
// formatCurrency(1250000) → '₦1.3M'

// Relative time
export const formatRelativeTime = (dateString: string): string => {
  // Use date-fns formatDistanceToNow
  // e.g. '3 mins ago', '2 hrs ago', 'Yesterday'
};

// Short date
export const formatDate = (dateString: string): string => {
  // e.g. 'May 14, 2025'
};

// Short time
export const formatTime = (dateString: string): string => {
  // e.g. '11:43 AM'
};

// Number with commas
export const formatNumber = (n: number): string => n.toLocaleString();
// 2473 → '2,473'

// Change percentage display
export const formatChange = (change: number): string =>
  `${change > 0 ? '+' : ''}${change}%`;
```

**Naira display rules:**
- Positive/neutral values: `₦` prefix, `text-slate-50`
- Revenue highlight / savings: `₦` prefix, `text-orange-400` or `text-green-400`
- Negative/loss: `-₦` prefix, `text-red-400`
- Never render raw numbers for financial figures

---

## 13 — LANDING PAGE SPECIFIC TOKENS

### 13.1 Hero Background

```tsx
// Hero radial glow
<section
  className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
  style={{
    background: `
      radial-gradient(ellipse 80% 50% at 50% -10%, rgba(37,99,235,0.25) 0%, transparent 70%),
      #0F172A
    `
  }}
>
```

### 13.2 CTA Section Background

```tsx
// Full-width blue-to-purple gradient section
<section className="bg-gradient-to-r from-blue-600 to-purple-700 py-20">
```

### 13.3 Footer Background

```tsx
// Slightly deeper than page bg
<footer style={{ backgroundColor: '#0A0F1E' }} className="border-t border-slate-700/30">
```

### 13.4 Channel Badges (Hero)

```tsx
const channelBadges = [
  { label: 'WhatsApp',     color: 'bg-green-500/10 text-green-400 border border-green-500/20' },
  { label: 'Instagram',    color: 'bg-pink-500/10 text-pink-400 border border-pink-500/20' },
  { label: 'Website Chat', color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
];
```

### 13.5 Feature Card (Landing)

```tsx
<div className="bg-dark-card rounded-2xl border border-slate-700/50 shadow-card p-6
                hover:border-blue-500/30 hover:shadow-card-hover hover:-translate-y-1
                transition-all duration-200 cursor-default">
  <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-2xl mb-4">
    {icon}
  </div>
  <h3 className="text-slate-50 font-semibold text-base mb-2">{title}</h3>
  <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
</div>
```

### 13.6 Pricing Feature List Item

```tsx
<li className="flex items-center gap-2.5 text-sm text-slate-300">
  <CheckCircle size={14} className="text-green-400 shrink-0" />
  {feature}
</li>
```

---

## 14 — MOBILE RESPONSIVENESS

### 14.1 Breakpoints

SmartSales AI uses Tailwind's default breakpoint scale:
- `sm`: 640px — stacked mobile layouts widen to 2 columns
- `md`: 768px — mid breakpoint, some sections reorganize
- `lg`: 1024px — dashboard grid activates, sidebar appears
- `xl`: 1280px — full desktop layout

### 14.2 Mobile-Specific Rules

| Zone | Mobile Behavior |
|---|---|
| **Sidebar** | Hidden (`hidden lg:flex`). Replaced by bottom nav bar |
| **TopBar** | Hamburger + logo + avatar only. No search input visible |
| **Stats cards** | `grid-cols-2` (2×2 layout) |
| **Overview grid** | `grid-cols-1` — panels stack vertically |
| **ChatWindow** | Full-screen overlay on conversation select. Back button top-left |
| **Tables** | `overflow-x-auto` wrapper. Or collapse to card list view |
| **Landing nav** | Hamburger menu → slide-down drawer |
| **Hero headline** | `text-4xl` on mobile vs `text-7xl` on desktop |
| **Pricing cards** | `grid-cols-1` on mobile, no scale-105 on recommended |

### 14.3 Bottom Navigation Bar (Mobile)

```tsx
// Fixed bottom nav — mobile only
<nav className="fixed bottom-0 left-0 right-0 h-16 bg-dark-card border-t border-slate-700/50
                flex items-center justify-around lg:hidden z-40 px-2">
  {[
    { icon: LayoutDashboard, label: 'Home',   href: '/overview'      },
    { icon: MessageSquare,   label: 'Chats',  href: '/conversations' },
    { icon: Users,           label: 'Leads',  href: '/leads'         },
    { icon: DollarSign,      label: 'Sales',  href: '/sales'         },
    { icon: Settings,        label: 'More',   href: '/settings'      },
  ].map(item => (
    <Link
      key={item.href}
      href={item.href}
      className={cn(
        "flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors",
        isActive ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
      )}
    >
      <item.icon size={20} />
      {item.label}
    </Link>
  ))}
</nav>
```

---

## 15 — ZUSTAND STORE SHAPE

Document the expected shape so component authors know what state is available.

### `chat-store.ts`

```ts
interface ChatStore {
  selectedLeadId:     string | null;
  conversations:      Record<string, Message[]>;
  leads:              Lead[];
  isAIMode:           boolean;
  setSelectedLead:    (id: string) => void;
  sendMessage:        (leadId: string, content: string, sender?: MessageSender) => void;
  toggleAIMode:       () => void;
  addIncomingMessage: (message: Message) => void;
}
```

### `dashboard-store.ts`

```ts
interface DashboardStore {
  stats:        DashboardStats;
  isLoading:    boolean;
  refreshStats: () => Promise<void>;
}
```

---

## 16 — DO / DON'T RULES

### ✅ DO

- Use `brand-*` and `dark-*` Tailwind tokens for every color reference
- Use `slate-*` utility classes for text hierarchy (`slate-50`, `slate-400`, `slate-600`)
- Add `tabular-nums` to every numeric display value
- Use `formatCurrency()` for every monetary figure — always ₦, never raw numbers
- Use `getAvatarColor(name)` for consistent, deterministic avatar colors
- Use `CHANNEL_COLORS`, `LEAD_STATUS_COLORS`, `SALE_STATUS_COLORS` from constants
- Add `transition-all duration-150` or `duration-200` to every interactive element
- Add `animate-pulse` to all live status dots
- Add `last:border-0` to remove the bottom border on the final list/table row
- Use `shrink-0` on icons and fixed-width elements inside flex rows
- Use `min-w-0 truncate` on flex children that could overflow with long text
- Use `dynamic(() => import(...), { ssr: false })` for all Recharts chart components
- Add `shadow-card` to every card, `shadow-card-hover` on hover
- Use `rounded-full` for all badges/pills — never `rounded-md`
- Use `bg-dark-card` as sidebar and panel background (not a lighter surface)
- Wrap all page content in a `motion.div` page entrance animation

### ❌ DON'T

- Never hardcode hex colors in TSX/JSX (only exception: chart `stroke`/`fill` using constants)
- Never use fonts other than Inter
- Never use `Inter`, `Roboto`, `Arial`, or `system-ui` explicitly in className or style props
- Never use arbitrary Tailwind values (`mt-[13px]`, `w-[193px]`) unless absolutely unavoidable for a pixel-perfect match
- Never render raw ₦ amounts — always use `formatCurrency()`
- Never set `transition-duration: 0ms` or omit transitions on interactive elements
- Never use `text-white` — always use `text-slate-50` or `text-slate-100`
- Never place a `bg-dark-card` element directly on another `bg-dark-card` without a border or depth signal
- Never add colored left-border accents to standard cards (only conversation list selected state has a left border)
- Never use `border-radius` on left-only borders (the border-left accent on conversation items has `rounded-none` on the left side, full radius on the right)
- Never use moment.js — use `date-fns` only
- Never use lodash — use native JavaScript array/object methods
- Never use `any` TypeScript type — define proper interfaces in `src/types/index.ts`
- Never skip skeleton loading states — every data-driven section needs a skeleton
- Never render Recharts on the server — always `dynamic()` import with `ssr: false`
- Never display a light background (`bg-white`, `bg-gray-100`, etc.) anywhere in the app

---

## 17 — TAILWIND CONFIG REFERENCE

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
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
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card':          '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(51,65,85,0.5)',
        'card-hover':    '0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(37,99,235,0.15)',
        'blue':          '0 0 20px rgba(37,99,235,0.2)',
        'purple':        '0 0 20px rgba(124,58,237,0.2)',
        'green':         '0 0 20px rgba(34,197,94,0.15)',
        'widget':        '0 25px 60px rgba(0,0,0,0.7)',
        'pricing-glow':  '0 8px 40px rgba(37,99,235,0.25)',
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(37,99,235,0.25) 0%, transparent 70%)',
        'brand-gradient': 'linear-gradient(to right, #2563EB, #7C3AED)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'slide-up': 'slide-up 0.25s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to:   { transform: 'translateY(0)',    opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 18 — QUICK COMPONENT CHECKLIST

When reviewing or building any component, verify every item:

**Colors & Theme**
- [ ] All colors use `dark-*`, `brand-*`, or `slate-*` tokens — no hex literals in JSX
- [ ] No `bg-white`, `text-white`, `bg-gray-*`, or `bg-gray-100` anywhere
- [ ] Dark background applied at every surface level
- [ ] Channel/status colors come from the constants file, not inline

**Typography**
- [ ] Inter is the only font family used
- [ ] Numeric values have `tabular-nums`
- [ ] Financial figures use `formatCurrency()` — never raw numbers
- [ ] Heading hierarchy is clear (size + weight contrast)
- [ ] Muted text (`text-slate-400`) used for labels, timestamps, secondary info

**Spacing**
- [ ] All spacing uses the token scale (4, 8, 12, 16, 20, 24, 32px)
- [ ] No arbitrary spacing values in className

**Interactivity**
- [ ] All interactive elements have hover + focus states
- [ ] Transitions present on all interactive elements (`duration-150` or `duration-200`)
- [ ] Button has `hover:-translate-y-px` or `hover:-translate-y-0.5`
- [ ] Card has `shadow-card` + `hover:shadow-card-hover`

**Layout**
- [ ] List rows have `border-b border-slate-700/30 last:border-0`
- [ ] Flex rows with potential overflow use `min-w-0 truncate` on text children
- [ ] `shrink-0` on all icons and fixed-width elements inside flex rows
- [ ] Skeleton loader matches the component shape

**Data**
- [ ] Currency uses `formatCurrency()` + ₦ symbol
- [ ] Relative times use `formatRelativeTime()`
- [ ] Charts use `dynamic()` import with `ssr: false`
- [ ] Status/channel colors come from `LEAD_STATUS_COLORS` / `CHANNEL_COLORS`

**Badges**
- [ ] All pills/badges are `rounded-full`, not `rounded-md`
- [ ] Badge uses correct semantic variant (color matches meaning)
- [ ] Live status badges include `animate-pulse` dot

**Mobile**
- [ ] Sidebar hidden on mobile (`hidden lg:flex`)
- [ ] Bottom nav present and functional on mobile
- [ ] Tables wrapped in `overflow-x-auto`
- [ ] Grid stacks to 1 column on mobile before splitting on `lg:`

---

_SmartSales AI Style Guide — v1.0_
_Reference this file before building or modifying any component in the SmartSales AI platform._
_Built to Sell While You Sleep. 🚀_
