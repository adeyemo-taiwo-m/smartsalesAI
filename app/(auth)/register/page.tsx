"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Zap, 
  Sparkles, 
  User, 
  Key, 
  Mail, 
  Building, 
  Phone, 
  Globe, 
  Bot, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/store/useStore";

export default function RegisterPage() {
  const router = useRouter();
  const { signup, login, addToast } = useStore();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [error, setError] = useState("");

  // Step 1: Admin Profile
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2: Business Profile
  const [bizName, setBizName] = useState("");
  const [bizPhone, setBizPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [bizCategory, setBizCategory] = useState("Fashion & Apparel");

  // Step 3: Train Aria AI Agent
  const [aiName, setAiName] = useState("Aria");
  const [aiTone, setAiTone] = useState("friendly");
  const [aiKb, setAiKb] = useState("");

  // Step Validations
  const isStep1Valid = firstName.trim() && lastName.trim() && email.trim() && password.trim();
  const isStep2Valid = bizName.trim() && bizPhone.trim();
  const isStep3Valid = aiName.trim() && aiKb.trim();

  // Run Onboarding Registration
  const handleRegister = async () => {
    setLoading(true);
    setError("");

    const categoryMap: Record<string, string> = {
      "Fashion & Apparel": "fashion_apparel",
      "Skincare & Beauty": "skincare_beauty",
      "Groceries & Food": "groceries_food",
      "Electronics & Retail": "electronics_retail",
      "Real Estate": "real_estate",
      "Professional Services": "professional_services",
    };

    const signupData = {
      business: {
        business_owner_name: `${firstName} ${lastName}`,
        business_email: email,
        business_name: bizName,
        industry_category: categoryMap[bizCategory] || "professional_services",
        support_whatsapp: bizPhone,
        website_url: website || null,
        password: password,
        timezone: "Africa/Lagos",
      },
      settings: {
        business_name: bizName,
        ai_persona_name: aiName,
        ai_tone: aiTone,
        auto_followup: true,
        human_handoff_trigger: true,
      },
      whatsapp_connection: null
    };

    try {
      setLoadingText("Creating your store workspace...");
      await signup(signupData);
      
      addToast(
        "success",
        "Workspace Ready!",
        `Welcome to SmartSales AI, ${firstName}! Your sales agent ${aiName} is active.`
      );
      
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please check details.");
      setStep(1); // Return to first step to display the error banner
    } finally {
      setLoading(false);
    }
  };

  // Instant Live Demo Autofill & Bootstrap
  const handleDemoClick = async () => {
    setLoading(true);
    setError("");
    setLoadingText("Configuring Instant Live Demo Sandbox...");
    
    try {
      // Attempt demo login
      await login({ business_email: "demo@smartsales.ai", password: "password" });
      router.push("/dashboard");
    } catch (err) {
      // Create demo sandbox automatically
      try {
        await signup({
          business: {
            business_owner_name: "Tunde Bakare",
            business_email: "demo@smartsales.ai",
            business_name: "Kene Fashion Hub",
            industry_category: "fashion_apparel",
            support_whatsapp: "+2348031112222",
            website_url: "https://kenefashion.com.ng",
            password: "password",
            timezone: "Africa/Lagos"
          },
          settings: {
            business_name: "Kene Fashion Hub",
            ai_persona_name: "Aria",
            ai_tone: "Friendly",
            auto_followup: true,
            human_handoff_trigger: true
          },
          whatsapp_connection: {
            whatsapp_phone_number_id: "109283746501928",
            connected_at: new Date().toISOString()
          }
        });
        router.push("/dashboard");
      } catch (signupErr: any) {
        setError("Failed to initialize demo: " + (signupErr.message || "Unknown error"));
        setStep(1);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark text-text-primary relative selection:bg-brand-green/30 selection:text-white px-4 py-10">
      {/* Background Radial Glow */}
      <div
        className="absolute top-0 left-0 right-0 h-[750px] pointer-events-none -z-10 animate-pulse"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(29,107,74,0.25) 0%, transparent 70%)"
        }}
      />

      {/* Glassmorphic Onboarding Card */}
      <div className="w-full max-w-xl bg-dark-card/90 border border-dark-border p-6 sm:p-8 rounded-2xl shadow-widget backdrop-blur-md space-y-6 hover:border-brand-green/20 duration-200 transition-colors z-10 animate-slide-up">
        
        {/* Logo and Titles */}
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green group-hover:scale-110 duration-200 transition-transform">
              <Zap size={20} className="fill-brand-green text-brand-green" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-brand-green to-brand-green-light bg-clip-text text-transparent">
              SmartSales AI
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-text-primary tracking-tight mt-3">
            Onboard Your Store Pipeline
          </h2>
          <p className="text-xs text-text-muted max-w-xs leading-relaxed">
            Link WhatsApp numbers, train Aria AI prompts, and capture local SME payments.
          </p>
        </div>

        {/* Progress Tracker Banner */}
        <div className="py-2 border-y border-dark-border/40">
          <div className="flex items-center justify-between text-[10px] text-text-muted font-bold uppercase tracking-wider mb-2 px-1">
            <span>Step {step} of 3</span>
            <span>
              {step === 1 && "Account Credentials"}
              {step === 2 && "Business Settings"}
              {step === 3 && "AI Prompt Training"}
            </span>
          </div>
          {/* Progress Indicators */}
          <div className="grid grid-cols-3 gap-2 h-1.5 w-full bg-dark rounded-full overflow-hidden p-0.5 border border-dark-border/30">
            <div className={`h-full rounded-full transition-all duration-300 ${step >= 1 ? "bg-brand-green shadow-green" : "bg-dark-border/50"}`} />
            <div className={`h-full rounded-full transition-all duration-300 ${step >= 2 ? "bg-brand-green shadow-green" : "bg-dark-border/50"}`} />
            <div className={`h-full rounded-full transition-all duration-300 ${step >= 3 ? "bg-brand-green shadow-green" : "bg-dark-border/50"}`} />
          </div>
        </div>

        {/* Loader Screen */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-4 text-center select-none animate-pulse">
            <div className="w-12 h-12 rounded-full border-2 border-brand-green/30 border-t-brand-green animate-spin" />
            <p className="text-sm font-semibold text-text-primary mt-2">{loadingText}</p>
            <p className="text-xs text-text-muted">Please do not refresh this page.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-2.5 rounded-lg text-xs font-semibold text-center">
                {error}
              </div>
            )}
            {/* STEP 1: ADMIN ACCOUNT */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                      <User size={10} className="text-text-muted" /> First Name
                    </label>
                    <Input
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className="h-9.5 text-xs bg-dark border-dark-border text-text-primary placeholder:text-text-muted/40 rounded-lg focus:border-brand-green/60 focus:ring-brand-green/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                      <User size={10} className="text-text-muted" /> Last Name
                    </label>
                    <Input
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="h-9.5 text-xs bg-dark border-dark-border text-text-primary placeholder:text-text-muted/40 rounded-lg focus:border-brand-green/60 focus:ring-brand-green/20"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                    <Mail size={12} className="text-text-muted" /> Email Address
                  </label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@yourstore.com"
                    className="h-9.5 text-xs bg-dark border-dark-border text-text-primary placeholder:text-text-muted/40 rounded-lg focus:border-brand-green/60 focus:ring-brand-green/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                    <Key size={12} className="text-text-muted" /> Secure Password
                  </label>
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-9.5 text-xs bg-dark border-dark-border text-text-primary placeholder:text-text-muted/40 rounded-lg focus:border-brand-green/60 focus:ring-brand-green/20"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: BUSINESS DETAILS */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                      <Building size={12} className="text-text-muted" /> Business Name
                    </label>
                    <Input
                      required
                      value={bizName}
                      onChange={(e) => setBizName(e.target.value)}
                      placeholder="e.g. Kene Fashion Hub"
                      className="h-9.5 text-xs bg-dark border-dark-border text-text-primary placeholder:text-text-muted/40 rounded-lg focus:border-brand-green/60 focus:ring-brand-green/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                      <Briefcase size={12} className="text-text-muted" /> Industry Category
                    </label>
                    <select
                      value={bizCategory}
                      onChange={(e) => setBizCategory(e.target.value)}
                      className="w-full h-9.5 px-3 bg-dark border border-dark-border text-text-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-green"
                    >
                      <option value="Fashion & Apparel">Fashion & Apparel</option>
                      <option value="Skincare & Beauty">Skincare & Beauty</option>
                      <option value="Groceries & Food">Groceries & Food</option>
                      <option value="Electronics & Retail">Electronics & Retail</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Professional Services">Professional Services</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                    <Phone size={12} className="text-text-muted" /> Support Contact Phone (WhatsApp Format)
                  </label>
                  <Input
                    required
                    value={bizPhone}
                    onChange={(e) => setBizPhone(e.target.value)}
                    placeholder="e.g. +234 803 111 2222"
                    className="h-9.5 text-xs bg-dark border-dark-border text-text-primary placeholder:text-text-muted/40 rounded-lg focus:border-brand-green/60 focus:ring-brand-green/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                    <Globe size={12} className="text-text-muted" /> Store Website URL (Optional)
                  </label>
                  <Input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="e.g. https://yourstore.com"
                    className="h-9.5 text-xs bg-dark border-dark-border text-text-primary placeholder:text-text-muted/40 rounded-lg focus:border-brand-green/60 focus:ring-brand-green/20"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: TRAIN AI AGENT */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                      <Bot size={12} className="text-text-muted" /> AI Persona Name
                    </label>
                    <Input
                      required
                      value={aiName}
                      onChange={(e) => setAiName(e.target.value)}
                      placeholder="e.g. Aria"
                      className="h-9.5 text-xs bg-dark border-dark-border text-text-primary placeholder:text-text-muted/40 rounded-lg focus:border-brand-green/60 focus:ring-brand-green/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={12} className="text-text-muted" /> Tonal Tone
                    </label>
                    <select
                      value={aiTone}
                      onChange={(e) => setAiTone(e.target.value)}
                      className="w-full h-9.5 px-3 bg-dark border border-dark-border text-text-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-green"
                    >
                      <option value="friendly">Friendly & Energetic</option>
                      <option value="professional">Strictly Professional</option>
                      <option value="casual">Casual & Relaxed</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                    Catalogs & Store Knowledge Base
                  </label>
                  <textarea
                    required
                    value={aiKb}
                    onChange={(e) => setAiKb(e.target.value)}
                    rows={4}
                    className="w-full p-2.5 bg-dark border border-dark-border rounded-lg text-xs text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:ring-1 focus:ring-brand-green font-sans leading-relaxed"
                    placeholder="Type details of your products, items list, prices, shipping rates, and return policies here. Aria uses this to talk with WhatsApp leads..."
                  />
                  <span className="text-[9px] text-text-muted block leading-tight font-medium">
                    *Provide specific details like: 'Standard fabric costs ₦20,000. Nationwide shipping is ₦4,000.'
                  </span>
                </div>
              </div>
            )}

            {/* Navigation Button Controls */}
            <div className="flex items-center gap-3 pt-3 border-t border-dark-border/40">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 h-9.5 text-xs font-semibold border-dark-border hover:bg-dark-card/50 text-text-primary rounded-lg flex items-center justify-center gap-1"
                >
                  <ChevronLeft size={14} /> Back
                </Button>
              )}

              {step < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !isStep1Valid) ||
                    (step === 2 && !isStep2Valid)
                  }
                  className="flex-1 h-9.5 text-xs font-bold bg-brand-green hover:bg-brand-green/80 text-white rounded-lg shadow-green flex items-center justify-center gap-1 disabled:opacity-40 disabled:pointer-events-none"
                >
                  Next <ChevronRight size={14} />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => handleRegister()}
                  disabled={!isStep3Valid}
                  className="flex-1 h-9.5 text-xs font-bold bg-brand-green hover:bg-brand-green/80 text-white rounded-lg shadow-green flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
                >
                  <Check size={14} /> Complete Onboarding
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Divider */}
        {!loading && (
          <div className="space-y-4 pt-1">
            <div className="relative flex items-center justify-center text-xs">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-border/40" />
              </div>
              <span className="relative px-3 bg-dark-card text-[9px] uppercase font-bold text-text-muted">
                Or experience the app
              </span>
            </div>

            {/* Instant Demo Sandbox Button */}
            <Button
              type="button"
              onClick={handleDemoClick}
              disabled={loading}
              className="w-full h-10 text-xs font-bold bg-gradient-to-r from-brand-green to-brand-green-light hover:opacity-90 text-white rounded-lg shadow-green hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              <Sparkles size={14} className="fill-white/20 animate-pulse text-white" />
              Start Instant Live Demo ⚡
            </Button>

            {/* Footnotes */}
            <p className="text-center text-xs text-text-muted pt-2 border-t border-dark-border/40">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-brand-green hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
