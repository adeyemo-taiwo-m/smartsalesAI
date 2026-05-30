"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Zap,
  BarChart3,
  Check,
  ArrowRight,
  Play,
  Clock,
  Sparkles,
  Users,
  Send,
  Menu,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatWidget } from "@/components/chat/ChatWidget";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [heroMessages, setHeroMessages] = useState([
    { sender: "customer", text: "Hello! Do you have the Premium Ankara bundles in stock?" },
    { sender: "ai", text: "Yes! 👋 We have the Premium Ankara 6-yard bundles in stock for ₦35,000. Would you like to view our pattern catalog?" }
  ]);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setHeroMessages(prev => [
        ...prev,
        { sender: "customer", text: "Yes please. Also, how much is shipping to Lekki?" }
      ]);
    }, 4000);

    const timer2 = setTimeout(() => {
      setHeroMessages(prev => [
        ...prev,
        { sender: "ai", text: "Catalog sent! Shipping to Lekki is ₦2,500 via express delivery (24 hrs). I can book your order now if you are ready! 🚚" }
      ]);
    }, 7000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-dark text-text-primary relative selection:bg-brand-green/30 selection:text-white">
      {/* Hero radial glow — green per v1.1 §13.1 */}
      <div
        className="absolute top-0 left-0 right-0 h-[700px] pointer-events-none -z-10"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(29,107,74,0.25) 0%, transparent 70%)"
        }}
      />

      {/* STICKY GLASS NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-dark-border bg-dark-card/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green group-hover:scale-110 duration-200 transition-transform">
              <Zap size={18} className="fill-brand-green" />
            </div>
            {/* v1.1 §2.3 — green-to-purple gradient for logo */}
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent">
              SmartSales AI
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 text-sm font-medium text-text-muted">
            <Link href="#features" className="hover:text-text-primary transition-colors">Features</Link>
            <Link href="#testimonials" className="hover:text-text-primary transition-colors">Reviews</Link>
            <Link href="#pricing" className="hover:text-text-primary transition-colors">Pricing</Link>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-text-muted hover:text-text-primary hover:bg-dark text-xs font-semibold">
                Log In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-brand-green hover:bg-brand-green/80 text-white font-semibold rounded-full shadow-green hover:-translate-y-0.5 transition-all duration-200 text-xs px-5 py-2.5">
                Start Free Trial
              </Button>
            </Link>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text-muted hover:text-text-primary focus:outline-none"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-dark-border bg-dark-card p-4 space-y-3 transition-all duration-300">
            <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-text-muted hover:text-text-primary hover:bg-dark rounded-lg text-sm">Features</Link>
            <Link href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-text-muted hover:text-text-primary hover:bg-dark rounded-lg text-sm">Reviews</Link>
            <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-text-muted hover:text-text-primary hover:bg-dark rounded-lg text-sm">Pricing</Link>
            <div className="h-px bg-dark-border my-2" />
            <div className="flex items-center justify-between pt-1">
              <Link href="/dashboard" className="w-1/2 mr-2">
                <Button variant="outline" className="w-full !bg-transparent text-text-muted border-dark-border text-xs py-2">Log In</Button>
              </Link>
              <Link href="/dashboard" className="w-1/2">
                <Button className="w-full bg-brand-green hover:bg-brand-green/80 text-white font-semibold text-xs py-2">Start Trial</Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center space-y-8 max-w-5xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-green/30 bg-brand-green/10 text-green-400 text-xs font-semibold tracking-wide animate-pulse">
              <Sparkles size={12} className="fill-green-400" />
              <span>Trusted by 5,000+ African SMEs</span>
            </div>

            {/* Headline — v1.1 §2.3 gradient */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-primary leading-[1.1] text-balance">
              Turn Chats Into{" "}
              <span className="bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent">Sales</span>{" "}
              Automatically
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-lg text-text-muted leading-relaxed text-balance">
              AI-powered WhatsApp, Instagram &amp; Web Sales Assistant for businesses.
              Qualifies leads, handles pricing, and collects orders 24/7 in local currencies.
            </p>

            {/* Channel Pills — v1.1 §13.4 */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-medium">
                <MessageCircle size={14} className="fill-green-400/20" /> WhatsApp Business
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400" /> Instagram DM
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                <Globe size={14} /> Website Widget
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-sm font-bold bg-gradient-to-r from-brand-green to-purple-600 hover:from-brand-green/80 hover:to-purple-500 text-white rounded-full shadow-green hover:-translate-y-0.5 transition-all duration-200">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-sm font-semibold !bg-transparent border-dark-border text-text-muted hover:text-text-primary hover:bg-dark-card rounded-full">
                <Play className="mr-2 h-4 w-4" /> Watch Live Demo
              </Button>
            </div>
            <p className="text-xs text-text-muted">No credit card required • Instant setup in 5 minutes</p>

            {/* HERO CHAT MOCKUP */}
            <div className="mt-16 relative mx-auto max-w-4xl rounded-2xl bg-dark-card/80 p-2 border border-dark-border shadow-widget overflow-hidden">
              <div className="aspect-[16/9] rounded-xl bg-dark overflow-hidden flex flex-col md:flex-row text-left">
                {/* Sidebar */}
                <div className="w-64 border-r border-dark-border bg-dark-card p-4 hidden md:flex flex-col justify-between select-none">
                  <div>
                    <div className="h-3 w-16 bg-dark-border rounded-full mb-6 animate-pulse" />
                    <div className="space-y-3">
                      <div className="bg-brand-green/10 border border-brand-green/20 p-2.5 rounded-lg flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-xs font-bold text-white">CO</div>
                        <div>
                          <div className="h-2.5 w-24 bg-text-primary/30 rounded mb-1.5" />
                          <div className="h-2 w-16 bg-text-muted/30 rounded" />
                        </div>
                      </div>
                      <div className="bg-dark/30 p-2.5 rounded-lg flex items-center gap-3 opacity-60">
                        <div className="w-8 h-8 rounded-full bg-dark-border flex items-center justify-center text-xs font-bold text-text-muted">BA</div>
                        <div>
                          <div className="h-2.5 w-20 bg-dark-border rounded mb-1.5" />
                          <div className="h-2 w-12 bg-dark-border rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-dark/40 border border-dark-border p-3 rounded-lg flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">AI Agent Aria Active</span>
                  </div>
                </div>

                {/* Chat pane */}
                <div className="flex-1 flex flex-col justify-between p-4 bg-dark min-h-[250px]">
                  <div className="border-b border-dark-border pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-green flex items-center justify-center text-white font-bold">CO</div>
                      <div>
                        <h4 className="text-sm font-semibold text-text-primary">Chinelo Obi</h4>
                        <span className="flex items-center gap-1 text-[10px] text-green-400 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Active WhatsApp Chat
                        </span>
                      </div>
                    </div>
                    <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      🤖 AI Auto-Responding
                    </span>
                  </div>

                  <div className="flex-1 py-4 space-y-4 overflow-y-auto text-xs">
                    {heroMessages.map((msg, index) => (
                      <div key={index} className={`flex ${msg.sender === "customer" ? "justify-start" : "justify-end"}`}>
                        <div className={`max-w-[80%] rounded-lg px-3.5 py-2.5 ${
                          msg.sender === "customer"
                            ? "bg-slate-700/50 text-slate-100 rounded-tl-sm"
                            : "bg-gradient-to-br from-brand-green to-brand-green/70 text-white rounded-tr-sm shadow-green"
                        }`}>
                          {msg.sender === "ai" && (
                            <span className="block text-[8px] font-bold text-green-200 uppercase tracking-wider mb-1">🤖 AI Sales Agent</span>
                          )}
                          <p>{msg.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-dark-border pt-3 flex items-center gap-2 bg-dark">
                    <div className="flex-1 bg-dark-card border border-dark-border rounded-full px-4 py-2 text-xs text-text-muted">
                      AI is auto-responding...
                    </div>
                    <Button size="icon" className="h-8 w-8 rounded-full bg-brand-green text-white">
                      <Send size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION — v1.1 §13.5 */}
        <section id="features" className="py-24 bg-dark-card/30 border-y border-dark-border relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                Everything you need to sell on autopilot
              </h2>
              <p className="text-text-muted text-sm sm:text-base leading-relaxed">
                Supercharge your conversions, eliminate manual chats delay, and log all payment records automatically.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "AI Sales Agent",    icon: Sparkles,       desc: "Instantly handles pricing queries, customer inquiries, and products catalog deliveries 24/7 without delays.",                                              color: "purple" },
                { title: "Omnichannel CRM",   icon: MessageCircle,  desc: "Connect your WhatsApp Business lines, Instagram DMs, and Website widgets into one coordinated team inbox.",                                               color: "green"  },
                { title: "Automated Ledgers", icon: BarChart3,      desc: "Simultaneously records product purchases, logs transactions, and calculates margins in local Nigerian Naira (₦).",                                         color: "lime"   },
                { title: "Smart Follow-ups",  icon: Clock,          desc: "Never lose a customer. Auto-reminders send gentle notifications when a shopper goes cold on a checkout link.",                                             color: "orange" },
              ].map((feature, i) => {
                const iconStyles: Record<string, string> = {
                  green:  "bg-brand-green/10 text-brand-green border-brand-green/20",
                  purple: "bg-purple-600/10 text-purple-400 border-purple-500/20",
                  lime:   "bg-green-500/10 text-green-400 border-green-500/20",
                  orange: "bg-orange-600/10 text-orange-400 border-orange-500/20",
                };
                return (
                  <div key={i} className="p-6 bg-dark-card rounded-2xl border border-dark-border shadow-card hover:border-brand-green/30 hover:shadow-card-hover transition-all duration-200 group hover:-translate-y-1 cursor-default">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center border mb-6 group-hover:scale-110 duration-200 transition-transform ${iconStyles[feature.color]}`}>
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold mb-2 text-text-primary tracking-tight">{feature.title}</h3>
                    <p className="text-xs text-text-muted leading-relaxed">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest">High-converting sales hubs</h3>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">Trusted by 5,000+ businesses across Africa</h2>
              <div className="flex flex-wrap items-center justify-center gap-10 opacity-30 grayscale hover:opacity-50 transition-opacity duration-300 pt-6 select-none">
                <span className="text-lg font-extrabold tracking-widest text-slate-400">KENE CLOTHINGS</span>
                <span className="text-lg font-bold tracking-widest text-slate-400">HAIR-SPA NG</span>
                <span className="text-lg font-black tracking-widest text-slate-400">LAGOS HUB</span>
                <span className="text-lg font-semibold tracking-widest text-slate-400">ABUJA LIFESTYLE</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                { quote: "Before SmartSales AI, I spent my entire night responding to Instagram and WhatsApp prices. Now, Aria handles pricing catalogs automatically. Our monthly sales jumped by ₦450,000 in just 30 days! 🚀", author: "Kenechi Nnamdi", role: "Creative Director", company: "Kene Fashion Hub", avatarSeed: "Kene" },
                { quote: "Automating customer support checkouts has been a game-changer. Chinelo's payment of ₦175,000 was captured completely on WhatsApp without me sending a single text message. Phenomenal product!", author: "Fatima Yusuf", role: "Founder", company: "Organic Glow Spa", avatarSeed: "Fatima" },
              ].map((test, i) => (
                <div key={i} className="bg-dark-card border border-dark-border shadow-card p-6 rounded-xl hover:border-brand-green/20 transition-colors flex flex-col justify-between">
                  <p className="text-xs text-text-primary/90 italic leading-relaxed mb-6">"{test.quote}"</p>
                  <div className="flex items-center gap-3">
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(test.avatarSeed)}`} alt={test.author} className="w-10 h-10 rounded-full border border-dark-border bg-dark-card" />
                    <div>
                      <h5 className="text-xs font-bold text-text-primary">{test.author}</h5>
                      <span className="text-[10px] text-text-muted font-medium">{test.role}, {test.company}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING — v1.1 §7.18 */}
        <section id="pricing" className="py-24 bg-dark-card/30 border-t border-dark-border px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold text-text-primary">Simple, transparent pricing</h2>
              <p className="text-text-muted text-xs sm:text-sm">Start automating conversations and watch your revenue grow.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Starter */}
              <div className="bg-dark-card border border-dark-border shadow-card rounded-2xl p-6 flex flex-col justify-between relative group hover:border-slate-600 duration-200 transition-colors">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-sm text-text-muted uppercase tracking-wider">Starter</h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-3xl font-extrabold tracking-tight text-text-primary">₦0</span>
                      <span className="ml-1 text-text-muted text-xs">/month</span>
                    </div>
                    <p className="mt-3 text-xs text-text-muted">Perfect for trying out SmartSales automation features.</p>
                  </div>
                  <ul className="space-y-3.5 text-xs text-text-primary/90">
                    {["200 AI chats/month", "Website widget integration", "Basic analytics dashboard", "1 human takeover user"].map(f => (
                      <li key={f} className="flex gap-2.5 items-start">
                        <Check className="h-4 w-4 text-brand-green shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/dashboard" className="w-full mt-8">
                  <Button variant="outline" className="w-full !bg-transparent border-dark-border text-xs font-semibold text-text-primary rounded-lg">Get Started Free</Button>
                </Link>
              </div>

              {/* Growth — recommended, v1.1 §7.18 green border */}
              <div className="bg-dark-card border-2 border-brand-green shadow-pricing-glow rounded-2xl p-6 flex flex-col justify-between relative scale-105 z-10">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-brand-green to-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-sm text-brand-green uppercase tracking-wider">Growth</h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-3xl font-extrabold tracking-tight text-text-primary">₦25,000</span>
                      <span className="ml-1 text-text-muted text-xs">/month</span>
                    </div>
                    <p className="mt-3 text-xs text-text-primary/95">Supercharge your scaling with WhatsApp automated orders.</p>
                  </div>
                  <ul className="space-y-3.5 text-xs text-text-primary/95">
                    {["Unlimited AI conversations", "WhatsApp Business connection", "Instagram DM automation", "Auto follow-ups on abandoned carts", "Detailed sales and payment analytics", "3 team members logins"].map(f => (
                      <li key={f} className="flex gap-2.5 items-start">
                        <Check className="h-4 w-4 text-brand-green shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/dashboard" className="w-full mt-8">
                  <Button className="w-full bg-brand-green hover:bg-brand-green/80 text-white font-bold rounded-lg shadow-green hover:-translate-y-0.5 transition-all duration-200 text-xs py-2.5">
                    Start 14-Day Free Trial
                  </Button>
                </Link>
              </div>

              {/* Business */}
              <div className="bg-dark-card border border-dark-border shadow-card rounded-2xl p-6 flex flex-col justify-between relative group hover:border-slate-600 duration-200 transition-colors">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-sm text-text-muted uppercase tracking-wider">Business</h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-3xl font-extrabold tracking-tight text-text-primary">Custom</span>
                    </div>
                    <p className="mt-3 text-xs text-text-muted">For high volume wholesale stores and massive teams.</p>
                  </div>
                  <ul className="space-y-3.5 text-xs text-text-primary/90">
                    {["Dedicated multi-agent custom LLMs", "Zapier & custom CRM integrations", "Priority 24/7 account manager", "Custom SMS integrations", "Unlimited team members"].map(f => (
                      <li key={f} className="flex gap-2.5 items-start">
                        <Check className="h-4 w-4 text-brand-green-light shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/dashboard" className="w-full mt-8">
                  <Button variant="outline" className="w-full !bg-transparent border-dark-border text-xs font-semibold text-text-primary rounded-lg">Contact Sales</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION — v1.1 §13.2 from-brand-green to-purple-700 */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-green to-purple-700 border-t border-brand-green/30 relative">
          <div className="container mx-auto max-w-4xl text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Start Selling Smarter Today</h2>
            <p className="text-green-100 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed opacity-90">
              Join 5,000+ businesses using SmartSales AI to convert chats into revenue, completely on autopilot.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-full shadow-lg">
                  Get Started Free
                </Button>
              </Link>
              <Link href="#pricing" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 !bg-transparent border-white/40 text-white hover:bg-white/10 rounded-full font-semibold">
                  View Pricing Plans
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER — v1.1 §13.3 bg #0A0F1E */}
      <footer style={{ backgroundColor: '#0A0F1E' }} className="border-t border-slate-700/30 py-16 px-4 sm:px-6 lg:px-8 select-none text-xs">
        <div className="container mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded bg-brand-green/10 flex items-center justify-center text-brand-green">
                <Zap size={15} className="fill-brand-green" />
              </div>
              <span className="font-extrabold text-sm text-slate-100 tracking-tight">SmartSales AI</span>
            </Link>
            <p className="text-slate-500 leading-relaxed">Automated sales, support, and payments collections for growing African retail businesses.</p>
          </div>

          <div className="space-y-3">
            <h5 className="font-semibold text-slate-400 uppercase tracking-widest text-[10px]">Product</h5>
            <ul className="space-y-2 text-slate-500">
              <li><Link href="#features" className="hover:text-slate-300 transition-colors">AI Agent</Link></li>
              <li><Link href="#features" className="hover:text-slate-300 transition-colors">Unified CRM</Link></li>
              <li><Link href="#pricing" className="hover:text-slate-300 transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-semibold text-slate-400 uppercase tracking-widest text-[10px]">Company</h5>
            <ul className="space-y-2 text-slate-500">
              <li><Link href="#" className="hover:text-slate-300 transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-slate-300 transition-colors">Contact Support</Link></li>
              <li><Link href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-semibold text-slate-400 uppercase tracking-widest text-[10px]">Office</h5>
            <p className="text-slate-500 leading-relaxed">Lagos, Nigeria 🇳🇬<br />hello@smartsales.ai</p>
          </div>
        </div>

        <div className="container mx-auto max-w-6xl border-t border-slate-700/30 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-600">
          <p>© 2026 SmartSales AI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
