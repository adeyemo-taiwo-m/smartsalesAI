"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Sparkles, Key, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/store/useStore";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();
  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("demo@smartsales.ai");
  const [password, setPassword] = useState("password");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login API call
    setTimeout(() => {
      login(); // Set user in global store
      setLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  const handleDemoClick = () => {
    setLoading(true);
    setTimeout(() => {
      login(); // Automatically pre-qualifies and stores admin credentials
      setLoading(false);
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark text-text-primary relative selection:bg-brand-green/30 selection:text-white px-4">
      {/* Background Radial Glow */}
      <div
        className="absolute top-0 left-0 right-0 h-[700px] pointer-events-none -z-10"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(29,107,74,0.25) 0%, transparent 70%)"
        }}
      />

      {/* Glassmorphic Login Card */}
      <div className="w-full max-w-md bg-dark-card/85 border border-dark-border p-6 sm:p-8 rounded-2xl shadow-widget backdrop-blur-md space-y-6 hover:border-brand-green/20 duration-200 transition-colors z-10 select-none">
        
        {/* Logo and Titles */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green group-hover:scale-110 duration-200 transition-transform">
              <Zap size={20} className="fill-brand-green" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              SmartSales AI
            </span>
          </Link>
          <h2 className="text-base sm:text-lg font-bold text-text-primary tracking-tight mt-4">
            Welcome back!
          </h2>
          <p className="text-xs text-text-muted max-w-xs leading-relaxed">
            Sign in to qualify chats, track invoices, and configure Aria pre-sales autopilot.
          </p>
        </div>

        {/* Form Details */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Mail size={12} className="text-text-muted" /> Email Address
            </label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@smartsales.ai"
              className="h-9.5 text-xs bg-dark border-slate-800 text-slate-100 placeholder:text-slate-600 rounded-lg focus:border-brand-green/60 focus:ring-2 focus:ring-brand-green/15 transition-colors duration-150"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Key size={12} className="text-text-muted" /> Password
              </label>
              <Link href="#" className="text-[10px] font-semibold text-brand-green hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              className="h-9.5 text-xs bg-dark border-slate-800 text-slate-100 placeholder:text-slate-600 rounded-lg focus:border-brand-green/60 focus:ring-2 focus:ring-brand-green/15 transition-colors duration-150"
            />
          </div>

          {/* Sign In CTA */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/50 rounded-lg shadow-sm flex items-center justify-center gap-1 mt-6"
          >
            {loading ? "Authenticating..." : "Sign In to Workspace"}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center text-xs">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dark-border" />
          </div>
          <span className="relative px-3 bg-dark-card text-[9px] uppercase font-bold text-slate-500">
            Or experience the app
          </span>
        </div>

        {/* Instant Demo Sandbox Button */}
        <Button
          type="button"
          onClick={handleDemoClick}
          disabled={loading}
          className="w-full h-10 text-xs font-bold bg-brand-green hover:bg-brand-green/80 text-white rounded-lg shadow-green hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-1.5"
        >
          <Sparkles size={14} className="fill-white/20 animate-pulse text-white" />
          Start Instant Live Demo ⚡
        </Button>

        {/* Footnotes */}
        <p className="text-center text-xs text-text-muted pt-2 border-t border-dark-border/40">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-brand-green hover:underline">
            Register store
          </Link>
        </p>

      </div>
    </div>
  );
}
