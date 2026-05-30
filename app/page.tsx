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
  CheckCircle,
  Users,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  X,
  Send,
  HelpCircle,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatWidget } from "@/components/chat/ChatWidget";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Floating mockup message script simulation
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
    <div className="flex min-h-screen flex-col bg-dark text-slate-50 relative selection:bg-brand-blue/30 selection:text-white">
      {/* Radial Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-600/15 via-purple-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* STICKY GLASS NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-dark/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-500 group-hover:scale-110 duration-200 transition-transform">
              <Zap size={18} className="fill-blue-500" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              SmartSales AI
            </span>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <Link href="#features" className="hover:text-slate-100 transition-colors">
              Features
            </Link>
            <Link href="#testimonials" className="hover:text-slate-100 transition-colors">
              Reviews
            </Link>
            <Link href="#pricing" className="hover:text-slate-100 transition-colors">
              Pricing
            </Link>
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 text-xs font-semibold"
              >
                Log In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-brand-blue hover:bg-blue-500 text-white font-semibold rounded-full shadow-blue hover:-translate-y-0.5 transition-all duration-200 text-xs px-5 py-2.5">
                Start Free Trial
              </Button>
            </Link>
          </div>

          {/* Hamburger Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-slate-100 focus:outline-none"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-700/50 bg-dark-card p-4 space-y-3 transition-all duration-300">
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-slate-300 hover:text-slate-50 hover:bg-slate-800/40 rounded-lg text-sm"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-slate-300 hover:text-slate-50 hover:bg-slate-800/40 rounded-lg text-sm"
            >
              Reviews
            </Link>
            <Link
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-slate-300 hover:text-slate-50 hover:bg-slate-800/40 rounded-lg text-sm"
            >
              Pricing
            </Link>
            <div className="h-px bg-slate-700/50 my-2" />
            <div className="flex items-center justify-between pt-1">
              <Link href="/dashboard" className="w-1/2 mr-2">
                <Button variant="outline" className="w-full text-slate-300 border-slate-700 text-xs py-2">
                  Log In
                </Button>
              </Link>
              <Link href="/dashboard" className="w-1/2">
                <Button className="w-full bg-brand-blue hover:bg-blue-500 text-white font-semibold text-xs py-2">
                  Start Trial
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center space-y-8 max-w-5xl">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-wide animate-pulse">
              <Sparkles size={12} className="fill-blue-400" />
              <span>Trusted by 5,000+ African SMEs</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-50 leading-[1.1] text-balance">
              Turn Chats Into <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Sales</span> Automatically
            </h1>

            {/* Subheadline */}
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed text-balance">
              AI-powered WhatsApp, Instagram & Web Sales Assistant for businesses. 
              qualifies leads, handles pricing, and collects orders 24/7 in local currencies.
            </p>

            {/* Channels Pills Row */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-medium">
                <MessageCircle size={14} className="fill-green-400/20" /> WhatsApp Business
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400" /> Instagram DM
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium">
                <Globe size={14} /> Website Widget
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-full shadow-blue hover:-translate-y-0.5 transition-all duration-200">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-sm font-semibold border-slate-700 text-slate-300 hover:text-slate-50 hover:bg-slate-800/40 rounded-full">
                <Play className="mr-2 h-4 w-4 fill-slate-300" /> Watch Live Demo
              </Button>
            </div>
            <p className="text-xs text-slate-500">No credit card required • Instant setup in 5 minutes</p>

            {/* FLOATING MOCKUP OF THE CHAT WINDOW */}
            <div className="mt-16 relative mx-auto max-w-4xl rounded-2xl bg-slate-900/50 p-2 border border-slate-700/50 shadow-widget overflow-hidden">
              <div className="aspect-[16/9] rounded-xl bg-[#0F172A] overflow-hidden flex flex-col md:flex-row text-left">
                {/* Simulated Lead info sidebar */}
                <div className="w-64 border-r border-slate-800 bg-[#1E293B] p-4 hidden md:flex flex-col justify-between select-none">
                  <div>
                    <div className="h-3 w-16 bg-slate-700 rounded-full mb-6 animate-pulse" />
                    <div className="space-y-3">
                      <div className="bg-slate-800/80 border border-blue-500/20 p-2.5 rounded-lg flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">CO</div>
                        <div>
                          <div className="h-2.5 w-24 bg-slate-200 rounded mb-1.5" />
                          <div className="h-2 w-16 bg-slate-500 rounded" />
                        </div>
                      </div>
                      <div className="bg-slate-800/30 p-2.5 rounded-lg flex items-center gap-3 opacity-60">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">BA</div>
                        <div>
                          <div className="h-2.5 w-20 bg-slate-700 rounded mb-1.5" />
                          <div className="h-2 w-12 bg-slate-700 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-800/40 border border-slate-700/50 p-3 rounded-lg flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">AI Agent Aria Active</span>
                  </div>
                </div>

                {/* Message display pane */}
                <div className="flex-1 flex flex-col justify-between p-4 bg-[#0F172A] min-h-[250px]">
                  {/* Mock Window Header */}
                  <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">CO</div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-100">Chinelo Obi</h4>
                        <span className="flex items-center gap-1 text-[10px] text-green-400 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Active WhatsApp Chat
                        </span>
                      </div>
                    </div>
                    <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      🤖 AI Auto-Responding
                    </span>
                  </div>

                  {/* Messages list */}
                  <div className="flex-1 py-4 space-y-4 overflow-y-auto text-xs">
                    {heroMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.sender === "customer" ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-3.5 py-2 ${
                            msg.sender === "customer"
                              ? "bg-slate-800 text-slate-100 rounded-tl-sm border border-slate-700/30"
                              : "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm shadow-blue"
                          }`}
                        >
                          {msg.sender === "ai" && (
                            <span className="block text-[8px] font-bold text-blue-200 uppercase tracking-wider mb-1">🤖 AI Sales Agent</span>
                          )}
                          <p>{msg.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mock message input */}
                  <div className="border-t border-slate-800 pt-3 flex items-center gap-2 bg-[#0F172A]">
                    <div className="flex-1 bg-slate-900 border border-slate-800 rounded-full px-4 py-2 text-xs text-slate-600">
                      AI is auto-responding...
                    </div>
                    <Button size="icon" className="h-8 w-8 rounded-full bg-blue-600 text-white">
                      <Send size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID SECTION */}
        <section id="features" className="py-24 bg-dark-card/30 border-y border-slate-700/40 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
                Everything you need to sell on autopilot
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Supercharge your conversions, eliminate manual chats delay, and log all payment records automatically.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "AI Sales Agent",
                  icon: Sparkles,
                  desc: "Instantly handles pricing queries, customer inquiries, and products catalog deliveries 24/7 without delays.",
                  color: "purple",
                },
                {
                  title: "Omnichannel CRM",
                  icon: MessageCircle,
                  desc: "Connect your WhatsApp Business lines, Instagram DMs, and Website widgets into one coordinated team inbox.",
                  color: "blue",
                },
                {
                  title: "Automated Ledgers",
                  icon: BarChart3,
                  desc: "Simultaneously records product purchases, logs transactions, and calculates margins in local Nigerian Naira (₦).",
                  color: "green",
                },
                {
                  title: "Smart Follow-ups",
                  icon: Clock,
                  desc: "Never lose a customer. Auto-reminders send gentle notifications when a shopper goes cold on a checkout link.",
                  color: "orange",
                },
              ].map((feature, i) => {
                const colors = {
                  blue: "bg-blue-600/10 text-blue-400 border-blue-500/20",
                  purple: "bg-purple-600/10 text-purple-400 border-purple-500/20",
                  green: "bg-green-600/10 text-green-400 border-green-500/20",
                  orange: "bg-orange-600/10 text-orange-400 border-orange-500/20",
                };
                return (
                  <div
                    key={i}
                    className="p-6 bg-dark-card rounded-xl border border-slate-700/50 shadow-card hover:border-blue-500/30 hover:shadow-card-hover transition-all duration-200 group hover:-translate-y-1"
                  >
                    <div className={`h-11 w-11 rounded-lg flex items-center justify-center border mb-6 group-hover:scale-110 duration-200 transition-transform ${colors[feature.color as "blue" | "purple" | "green" | "orange"]}`}>
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold mb-2 text-slate-100 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF SECTION & TESTIMONIALS */}
        <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                High-converting sales hubs
              </h3>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
                Trusted by 5,000+ businesses across Africa
              </h2>
              {/* Grayscale local SME logo list */}
              <div className="flex flex-wrap items-center justify-center gap-10 opacity-30 grayscale hover:opacity-50 transition-opacity duration-300 pt-6 select-none">
                <span className="text-lg font-extrabold tracking-widest text-slate-400">KENE CLOTHINGS</span>
                <span className="text-lg font-bold tracking-widest text-slate-400">HAIR-SPA NG</span>
                <span className="text-lg font-black tracking-widest text-slate-400">LAGOS HUB</span>
                <span className="text-lg font-semibold tracking-widest text-slate-400">ABUJA LIFESTYLE</span>
              </div>
            </div>

            {/* Testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  quote: "Before SmartSales AI, I spent my entire night responding to Instagram and WhatsApp prices. Now, Aria handles pricing catalogs automatically. Our monthly sales jumped by ₦450,000 in just 30 days! 🚀",
                  author: "Kenechi Nnamdi",
                  role: "Creative Director",
                  company: "Kene Fashion Hub",
                  avatarSeed: "Kene",
                },
                {
                  quote: "Automating customer support checkouts has been a game-changer. Chinelo's payment of ₦175,000 was captured completely on WhatsApp without me sending a single text message. Phenomenal product!",
                  author: "Fatima Yusuf",
                  role: "Founder",
                  company: "Organic Glow Spa",
                  avatarSeed: "Fatima",
                },
              ].map((test, i) => (
                <div key={i} className="bg-dark-card border border-slate-700/50 shadow-card p-6 rounded-xl hover:border-slate-600 transition-colors flex flex-col justify-between">
                  <p className="text-xs text-slate-300 italic leading-relaxed mb-6">
                    "{test.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(test.avatarSeed)}`}
                      alt={test.author}
                      className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-slate-100">{test.author}</h5>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {test.role}, {test.company}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING PLANS */}
        <section id="pricing" className="py-24 bg-dark-card/30 border-t border-slate-700/40 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold text-slate-50">Simple, transparent pricing</h2>
              <p className="text-slate-400 text-xs sm:text-sm">Start automating conversations and watch your revenue grow.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Starter Plan */}
              <div className="bg-dark-card border border-slate-700/50 shadow-card rounded-xl p-6 flex flex-col justify-between relative group hover:border-slate-600 duration-200 transition-colors">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-sm text-slate-400 uppercase tracking-wider">Starter</h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-3xl font-extrabold tracking-tight text-slate-50">₦0</span>
                      <span className="ml-1 text-slate-500 text-xs">/month</span>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">Perfect for trying out SmartSales automation features.</p>
                  </div>
                  <ul className="space-y-3.5 text-xs text-slate-300">
                    {["200 AI chats/month", "Website widget integration", "Basic analytics dashboard", "1 human takeover user"].map(f => (
                      <li key={f} className="flex gap-2.5 items-start">
                        <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/dashboard" className="w-full mt-8">
                  <Button variant="outline" className="w-full border-slate-700 text-xs font-semibold text-slate-300 hover:text-white rounded-lg">
                    Get Started Free
                  </Button>
                </Link>
              </div>

              {/* RECOMMENDED Growth Plan */}
              <div className="bg-dark-card border-2 border-brand-blue shadow-pricing-glow rounded-xl p-6 flex flex-col justify-between relative scale-105 z-10">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-sm text-blue-400 uppercase tracking-wider">Growth</h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-3xl font-extrabold tracking-tight text-slate-50">₦25,000</span>
                      <span className="ml-1 text-slate-500 text-xs">/month</span>
                    </div>
                    <p className="mt-3 text-xs text-slate-300">Supercharge your scaling with WhatsApp automated orders.</p>
                  </div>
                  <ul className="space-y-3.5 text-xs text-slate-200">
                    {[
                      "Unlimited AI conversations",
                      "WhatsApp Business connection",
                      "Instagram DM automation",
                      "Auto follow-ups on abandoned carts",
                      "Detailed sales and payment analytics",
                      "3 team members logins",
                    ].map(f => (
                      <li key={f} className="flex gap-2.5 items-start">
                        <Check className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/dashboard" className="w-full mt-8">
                  <Button className="w-full bg-brand-blue hover:bg-blue-500 text-white font-bold rounded-lg shadow-blue hover:-translate-y-0.5 transition-all duration-200 text-xs py-2.5">
                    Start 14-Day Free Trial
                  </Button>
                </Link>
              </div>

              {/* Custom Plan */}
              <div className="bg-dark-card border border-slate-700/50 shadow-card rounded-xl p-6 flex flex-col justify-between relative group hover:border-slate-600 duration-200 transition-colors">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-sm text-slate-400 uppercase tracking-wider">Business</h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-3xl font-extrabold tracking-tight text-slate-50">Custom</span>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">For high volume wholesale stores and massive teams.</p>
                  </div>
                  <ul className="space-y-3.5 text-xs text-slate-300">
                    {[
                      "Dedicated multi-agent custom LLMs",
                      "Zapier & custom CRM integrations",
                      "Priority 24/7 account manager",
                      "Custom SMS integrations",
                      "Unlimited team members",
                    ].map(f => (
                      <li key={f} className="flex gap-2.5 items-start">
                        <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/dashboard" className="w-full mt-8">
                  <Button variant="outline" className="w-full border-slate-700 text-xs font-semibold text-slate-300 hover:text-white rounded-lg">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA ACTION CONSOLE */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-700 border-t border-slate-700/40 relative">
          <div className="container mx-auto max-w-4xl text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Start Selling Smarter Today
            </h2>
            <p className="text-slate-100 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed opacity-90">
              Join 5,000+ businesses using SmartSales AI to convert chats into revenue, completely on autopilot.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-full shadow-lg">
                  Get Started Free
                </Button>
              </Link>
              <Link href="#pricing" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 border-white/40 text-white hover:bg-white/10 rounded-full font-semibold">
                  View Pricing Plans
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0A0F1E] border-t border-slate-800/80 py-16 px-4 sm:px-6 lg:px-8 select-none text-xs">
        <div className="container mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Slogan Column */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded bg-blue-600/10 flex items-center justify-center text-blue-500">
                <Zap size={15} className="fill-blue-500" />
              </div>
              <span className="font-extrabold text-sm text-slate-100 tracking-tight">SmartSales AI</span>
            </Link>
            <p className="text-slate-500 leading-relaxed">
              Automated sales, support, and payments collections for growing African retail businesses.
            </p>
          </div>

          {/* Product links */}
          <div className="space-y-3">
            <h5 className="font-semibold text-slate-400 uppercase tracking-widest text-[10px]">Product</h5>
            <ul className="space-y-2 text-slate-500">
              <li><Link href="#features" className="hover:text-slate-300">AI Agent</Link></li>
              <li><Link href="#features" className="hover:text-slate-300">Unified CRM</Link></li>
              <li><Link href="#pricing" className="hover:text-slate-300">Pricing</Link></li>
            </ul>
          </div>

          {/* Company links */}
          <div className="space-y-3">
            <h5 className="font-semibold text-slate-400 uppercase tracking-widest text-[10px]">Company</h5>
            <ul className="space-y-2 text-slate-500">
              <li><Link href="#" className="hover:text-slate-300">About Us</Link></li>
              <li><Link href="#" className="hover:text-slate-300">Contact Support</Link></li>
              <li><Link href="#" className="hover:text-slate-300">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-3">
            <h5 className="font-semibold text-slate-400 uppercase tracking-widest text-[10px]">Office</h5>
            <p className="text-slate-500 leading-relaxed">
              Lagos, Nigeria 🇳🇬<br />
              hello@smartsales.ai
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="container mx-auto max-w-6xl border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-600">
          <p>© 2026 SmartSales AI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-slate-400">Terms of Service</Link>
            <Link href="#" className="hover:text-slate-400">Privacy Policy</Link>
          </div>
        </div>
      </footer>

      {/* FLOAT EMBEDDABLE CHAT WIDGET */}
      <ChatWidget />
    </div>
  );
}
