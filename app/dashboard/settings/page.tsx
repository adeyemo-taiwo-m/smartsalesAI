"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  MessageCircle, 
  Instagram, 
  Globe, 
  Bell, 
  Save, 
  Copy, 
  Check, 
  Upload, 
  Store, 
  User, 
  ShieldAlert,
  Link2,
  HelpCircle,
  Lock,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const { user, addToast } = useStore();
  const [activeTab, setActiveTab] = useState("business");

  // Profile Form States
  const [bizName, setBizName] = useState("Kene Fashion Hub");
  const [website, setWebsite] = useState("https://kenefashion.com.ng");
  const [bizEmail, setBizEmail] = useState("kene@kenefashion.com.ng");
  const [bizPhone, setBizPhone] = useState("+234 803 111 2222");

  // AI Agent States
  const [aiName, setAiName] = useState("Aria");
  const [aiTone, setAiTone] = useState("friendly");
  const [aiKb, setAiKb] = useState(
    "We are Kene Fashion Hub based in Lagos. We sell premium Ankara 6-yard bundles starting at ₦35,000, and standard fabrics starting at ₦20,000. Express delivery within Lagos takes 24 hours and costs ₦2,500. Standard shipping nationwide takes 2-3 business days and costs ₦4,000. All prices are in Nigerian Naira."
  );
  const [autoFollowUp, setAutoFollowUp] = useState(true);
  const [handoffAlert, setHandoffAlert] = useState(true);

  // Connection Indicator States
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [copied, setCopied] = useState(false);

  // WhatsApp Configuration States
  const [whatsappPhoneId, setWhatsappPhoneId] = useState("");
  const [whatsappAccessToken, setWhatsappAccessToken] = useState("");
  const [whatsappVerifyToken, setWhatsappVerifyToken] = useState("smartsales_aria_verify_token");
  const [isEditingWhatsApp, setIsEditingWhatsApp] = useState(false);
  const [whatsappLoading, setWhatsappLoading] = useState(false);

  // Notification Toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(false);
  const [pushAlerts, setPushAlerts] = useState(true);

  // Fetch settings from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await api.settings.get();
        if (data) {
          setBizName(data.business_name || "");
          setAiName(data.ai_persona_name || "");
          setAiTone(data.ai_tone || "friendly");
          setAutoFollowUp(data.auto_followup ?? true);
          setHandoffAlert(data.human_handoff_trigger ?? true);

          // Load WhatsApp settings
          const phoneId = data.whatsapp_phone_number_id || "";
          const token = data.whatsapp_access_token || "";
          const verify = data.whatsapp_verify_token || "smartsales_aria_verify_token";
          setWhatsappPhoneId(phoneId);
          setWhatsappAccessToken(token);
          setWhatsappVerifyToken(verify);
          setWhatsappConnected(!!(phoneId && token));
        }
      } catch (error) {
        console.warn("Failed to fetch settings from API, loading local fallback", error);
        if (typeof window !== "undefined") {
          const localSettingsStr = localStorage.getItem("smartsales_settings");
          if (localSettingsStr) {
            try {
              const data = JSON.parse(localSettingsStr);
              setBizName(data.business_name || "Kene Fashion Hub");
              setAiName(data.ai_persona_name || "Aria");
              setAiTone(data.ai_tone || "friendly");
              setAutoFollowUp(data.auto_followup ?? true);
              setHandoffAlert(data.human_handoff_trigger ?? true);
              setWhatsappPhoneId(data.whatsapp_phone_number_id || "");
              setWhatsappAccessToken(data.whatsapp_access_token || "");
              setWhatsappVerifyToken(data.whatsapp_verify_token || "smartsales_aria_verify_token");
              setWhatsappConnected(!!(data.whatsapp_phone_number_id && data.whatsapp_access_token));
            } catch (jsonErr) {
              console.error("Failed to parse local fallback settings", jsonErr);
            }
          }
        }
      }
    };
    loadSettings();
  }, []);

  const handleConnectWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsappPhoneId.trim() || !whatsappAccessToken.trim()) {
      addToast("error", "Validation Error", "Phone Number ID and Permanent Access Token are required.");
      return;
    }
    
    setWhatsappLoading(true);
    const localPayload = {
      business_name: bizName,
      ai_persona_name: aiName,
      ai_tone: aiTone,
      auto_followup: autoFollowUp,
      human_handoff_trigger: handoffAlert,
      whatsapp_phone_number_id: whatsappPhoneId.trim(),
      whatsapp_access_token: whatsappAccessToken.trim(),
      whatsapp_verify_token: whatsappVerifyToken.trim() || "smartsales_aria_verify_token",
    };

    try {
      await api.settings.update({
        whatsapp_phone_number_id: whatsappPhoneId.trim(),
        whatsapp_access_token: whatsappAccessToken.trim(),
        whatsapp_verify_token: whatsappVerifyToken.trim() || "smartsales_aria_verify_token",
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("smartsales_settings", JSON.stringify(localPayload));
      }
      setWhatsappConnected(true);
      setIsEditingWhatsApp(false);
      addToast("success", "WhatsApp Connected", "WhatsApp Business API channel is now active.");
    } catch (error: any) {
      console.warn("Failed to save WhatsApp on backend settings, saving locally", error);
      if (typeof window !== "undefined") {
        localStorage.setItem("smartsales_settings", JSON.stringify(localPayload));
      }
      setWhatsappConnected(true);
      setIsEditingWhatsApp(false);
      addToast("info", "WhatsApp Connected (Local Fallback)", "WhatsApp Business API channel saved locally.");
    } finally {
      setWhatsappLoading(false);
    }
  };

  const handleDisconnectWhatsApp = async () => {
    if (!confirm("Are you sure you want to disconnect your WhatsApp channel? This will stop AI Aria from auto-replying to customer inquiries.")) {
      return;
    }

    setWhatsappLoading(true);
    const localPayload = {
      business_name: bizName,
      ai_persona_name: aiName,
      ai_tone: aiTone,
      auto_followup: autoFollowUp,
      human_handoff_trigger: handoffAlert,
      whatsapp_phone_number_id: null,
      whatsapp_access_token: null,
      whatsapp_verify_token: "smartsales_aria_verify_token",
    };

    try {
      await api.settings.update({
        whatsapp_phone_number_id: null,
        whatsapp_access_token: null,
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("smartsales_settings", JSON.stringify(localPayload));
      }
      setWhatsappPhoneId("");
      setWhatsappAccessToken("");
      setWhatsappConnected(false);
      setIsEditingWhatsApp(false);
      addToast("success", "WhatsApp Disconnected", "WhatsApp Business API channel has been disabled.");
    } catch (error: any) {
      console.warn("Failed to disconnect WhatsApp on backend, saving locally", error);
      if (typeof window !== "undefined") {
        localStorage.setItem("smartsales_settings", JSON.stringify(localPayload));
      }
      setWhatsappPhoneId("");
      setWhatsappAccessToken("");
      setWhatsappConnected(false);
      setIsEditingWhatsApp(false);
      addToast("success", "WhatsApp Disconnected (Local Fallback)", "WhatsApp Business API channel has been disabled locally.");
    } finally {
      setWhatsappLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const localPayload = {
      business_name: bizName,
      ai_persona_name: aiName,
      ai_tone: aiTone,
      auto_followup: autoFollowUp,
      human_handoff_trigger: handoffAlert,
      whatsapp_phone_number_id: whatsappPhoneId || null,
      whatsapp_access_token: whatsappAccessToken || null,
      whatsapp_verify_token: whatsappVerifyToken || "smartsales_aria_verify_token",
    };

    try {
      await api.settings.update({
        business_name: bizName,
        ai_persona_name: aiName,
        ai_tone: aiTone,
        auto_followup: autoFollowUp,
        human_handoff_trigger: handoffAlert,
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("smartsales_settings", JSON.stringify(localPayload));
      }
      addToast("success", "Settings Saved", "Workspace parameters have been updated.");
    } catch (error: any) {
      console.warn("Failed to update settings on backend, saving locally", error);
      if (typeof window !== "undefined") {
        localStorage.setItem("smartsales_settings", JSON.stringify(localPayload));
      }
      addToast("success", "Settings Saved (Local Fallback)", "Saved settings configurations locally.");
    }
  };

  const embedScript = `<script>
  window.SmartSalesConfig = {
    agentId: "aria-kene-fashion",
    businessName: "Kene Fashion Hub",
    themeColor: "#1D6B4A"
  };
</script>
<script src="https://cdn.smartsales.ai/widget.js" async></script>`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(embedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 select-none w-full max-w-4xl overflow-hidden">
      {/* Title */}
      <div className="pb-4 border-b border-slate-700/30">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-50 tracking-tight">System Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Configure business profile parameters, train AI Aria prompts, and link WhatsApp endpoints.</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="business" className="space-y-6">
        <TabsList className="bg-dark border border-slate-800 p-1 rounded-xl grid grid-cols-2 md:flex md:flex-row md:w-fit w-full gap-1 h-auto md:h-10">
          <TabsTrigger value="business" className="text-xs font-semibold px-2 py-2 rounded-lg data-[state=active]:bg-dark-card data-[state=active]:text-brand-green w-full text-center">
            Business Profile
          </TabsTrigger>
          <TabsTrigger value="ai" className="text-xs font-semibold px-2 py-2 rounded-lg data-[state=active]:bg-dark-card data-[state=active]:text-brand-green w-full text-center">
            Aria AI Agent
          </TabsTrigger>
          <TabsTrigger value="channels" className="text-xs font-semibold px-2 py-2 rounded-lg data-[state=active]:bg-dark-card data-[state=active]:text-brand-green w-full text-center truncate">
            Integrations
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs font-semibold px-2 py-2 rounded-lg data-[state=active]:bg-dark-card data-[state=active]:text-brand-green w-full text-center truncate">
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: BUSINESS PROFILE */}
        <TabsContent value="business" className="space-y-4 focus-visible:outline-none">
          <div className="bg-dark-card rounded-xl border border-slate-700/50 p-4 sm:p-6 space-y-6 shadow-card hover:border-slate-600 transition-colors">
            <div>
              <h3 className="text-sm font-bold text-slate-50 uppercase tracking-widest flex items-center gap-2">
                <Store size={15} className="text-brand-green" /> Business Profile
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Modify how your sales hub details appear across automated invoices and catalogs.</p>
            </div>

            {/* Logo Upload Simulation */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-slate-850 pb-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-lg shrink-0 select-none">
                KF
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business Brand Mark</label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="h-8 text-xs font-semibold border-slate-700 text-slate-300 hover:text-white shrink-0">
                    <Upload size={12} className="mr-1.5" /> Upload Brand Mark
                  </Button>
                  <Button variant="ghost" className="h-8 text-xs text-red-400 hover:text-red-300 shrink-0">Remove</Button>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business Name</label>
                  <Input
                    value={bizName}
                    onChange={(e) => setBizName(e.target.value)}
                    className="h-9.5 text-xs bg-dark border-slate-800 text-slate-200 rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Website URL</label>
                  <Input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="h-9.5 text-xs bg-dark border-slate-800 text-slate-200 rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Email</label>
                  <Input
                    value={bizEmail}
                    onChange={(e) => setBizEmail(e.target.value)}
                    className="h-9.5 text-xs bg-dark border-slate-800 text-slate-200 rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Support Phone</label>
                  <Input
                    value={bizPhone}
                    onChange={(e) => setBizPhone(e.target.value)}
                    className="h-9.5 text-xs bg-dark border-slate-800 text-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <Button type="submit" className="h-9 text-xs font-bold bg-brand-green hover:bg-brand-green/80 text-white rounded-lg shadow-green flex items-center gap-1.5">
                <Save size={13} /> Save Business Profile
              </Button>
            </form>
          </div>
        </TabsContent>

        {/* TAB 2: AI AGENT ARIA */}
        <TabsContent value="ai" className="space-y-4 focus-visible:outline-none">
          <div className="bg-dark-card rounded-xl border border-slate-700/50 p-4 sm:p-6 space-y-6 shadow-card hover:border-slate-600 transition-colors">
            <div>
              <h3 className="text-sm font-bold text-slate-50 uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={15} className="text-purple-400" /> Aria AI Agent Configuration
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Configure your pre-sales chatbot, paste catalogs knowledge, and define support tones.</p>
            </div>

            {/* Persona Setup */}
            <form onSubmit={handleSaveSettings} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Persona Name</label>
                  <Input
                    value={aiName}
                    onChange={(e) => setAiName(e.target.value)}
                    className="h-9.5 text-xs bg-dark border-slate-800 text-slate-200 rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tonal Pitch Mode</label>
                  <select
                    value={aiTone}
                    onChange={(e) => setAiTone(e.target.value)}
                    className="w-full h-9.5 px-3 bg-dark border border-slate-800 text-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-green"
                  >
                    <option value="friendly">Friendly & Energetic</option>
                    <option value="professional">Strictly Professional</option>
                    <option value="casual">Casual & Relaxed</option>
                  </select>
                </div>
              </div>

              {/* Text Knowledge Base */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Catalogs Knowledge Base</label>
                <textarea
                  value={aiKb}
                  onChange={(e) => setAiKb(e.target.value)}
                  rows={5}
                  className="w-full p-3 bg-dark border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-brand-green font-sans leading-relaxed"
                  placeholder="Paste details of your products, wholesale prices, shipping rates, and refund policies here..."
                />
                <span className="text-[10px] text-slate-500 block leading-tight">
                  Aria references this knowledge base in real-time when answering customer prices and catalog queries.
                </span>
              </div>

              {/* Switches */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-slate-880 pb-3">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-slate-200">Auto follow-ups on abandoned shopping</label>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Aria sends gentle notifications 2 hours after a shopper drops a Lekki order catalog inquiry.
                    </p>
                  </div>
                  <Switch checked={autoFollowUp} onCheckedChange={setAutoFollowUp} className="scale-85" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-slate-200">Takeover handoff alerts</label>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Flash notifications when a shopper complains about code errors or requests live human assistance.
                    </p>
                  </div>
                  <Switch checked={handoffAlert} onCheckedChange={setHandoffAlert} className="scale-85" />
                </div>
              </div>

              <Button type="submit" className="h-9 text-xs font-bold bg-brand-green hover:bg-brand-green/80 text-white rounded-lg shadow-green flex items-center gap-1.5">
                <Save size={13} /> Update Aria Settings
              </Button>
            </form>
          </div>
        </TabsContent>

        {/* TAB 3: INTEGRATIONS & CHANNELS */}
        <TabsContent value="channels" className="space-y-4 focus-visible:outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Messaging Connectors */}
            <div className="bg-dark-card rounded-xl border border-slate-700/50 p-4 sm:p-6 space-y-6 shadow-card hover:border-slate-600 transition-colors">
              <div>
                <h3 className="text-sm font-bold text-slate-50 uppercase tracking-widest flex items-center gap-2">
                  <MessageCircle size={15} className="text-green-400" /> Messaging Connections
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">Connect your active WhatsApp API and Instagram Business tokens.</p>
              </div>

              {/* Whatsapp Slot */}
              <div className="space-y-4 p-4 bg-dark/20 border border-slate-800 rounded-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/20 shrink-0">
                      <MessageCircle size={18} className="fill-green-400/10" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-200 truncate">WhatsApp Business API</h4>
                      {whatsappConnected ? (
                        <span className="flex items-center gap-1 text-[9px] text-green-400 font-semibold mt-0.5 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" /> 
                          Phone ID: {whatsappPhoneId} (Connected)
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[9px] text-slate-500 font-semibold mt-0.5 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-650 shrink-0" />
                          Not Connected
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                    {whatsappConnected && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsEditingWhatsApp(!isEditingWhatsApp)}
                        className="h-7.5 px-2.5 rounded-lg text-[10px] font-semibold text-slate-400 hover:text-white hover:bg-slate-800/40"
                      >
                        <Settings size={12} className="mr-1" />
                        {isEditingWhatsApp ? "Hide Settings" : "Configure"}
                      </Button>
                    )}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={whatsappConnected ? handleDisconnectWhatsApp : () => setIsEditingWhatsApp(!isEditingWhatsApp)}
                      disabled={whatsappLoading}
                      className={cn(
                        "h-7.5 px-3 rounded-lg text-[10px] font-semibold border-slate-700 w-full sm:w-auto",
                        whatsappConnected ? "text-red-400 hover:bg-red-500/10 border-red-500/20" : "text-green-400 hover:bg-green-500/10 border-green-500/20"
                      )}
                    >
                      {whatsappConnected ? "Disconnect" : (isEditingWhatsApp ? "Cancel" : "Connect")}
                    </Button>
                  </div>
                </div>

                {!whatsappConnected && !isEditingWhatsApp && (
                  <p className="text-[10.5px] text-slate-500 leading-normal mt-2 border-t border-slate-800/40 pt-2">
                    Configure WhatsApp to allow AI Aria to automatically message customers and process orders in real-time.
                  </p>
                )}

                {/* Inline Configuration Form */}
                {isEditingWhatsApp && (
                  <form onSubmit={handleConnectWhatsApp} className="border-t border-slate-800/60 pt-4 mt-3 space-y-4 animate-slide-up">
                    <div className="bg-brand-green/10 border border-brand-green/20 p-3 rounded-lg flex items-start gap-2.5">
                      <HelpCircle size={15} className="text-brand-green shrink-0 mt-0.5" />
                      <div className="text-[10px] text-slate-400 leading-relaxed">
                        <p className="font-bold text-slate-200">How to get Meta API Parameters?</p>
                        <p className="mt-0.5">Create a Developer app in the Meta Developers dashboard under WhatsApp Cloud API. Link your business phone number to generate these parameters.</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Link2 size={12} className="text-slate-500" /> WhatsApp Phone Number ID
                      </label>
                      <Input
                        required
                        value={whatsappPhoneId}
                        onChange={(e) => setWhatsappPhoneId(e.target.value)}
                        placeholder="e.g. 109283746501928"
                        className="h-9.5 text-xs bg-dark border-slate-800 text-slate-200 placeholder:text-slate-600 rounded-lg focus:border-brand-green/60"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Lock size={12} className="text-slate-500" /> Meta API Permanent Token
                      </label>
                      <Input
                        type="password"
                        required
                        value={whatsappAccessToken}
                        onChange={(e) => setWhatsappAccessToken(e.target.value)}
                        placeholder="EAAGy7ZCpB2t4BO8..."
                        className="h-9.5 text-xs bg-dark border-slate-800 text-slate-200 placeholder:text-slate-600 rounded-lg focus:border-brand-green/60"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        Custom Webhook Verification Token
                      </label>
                      <Input
                        required
                        value={whatsappVerifyToken}
                        onChange={(e) => setWhatsappVerifyToken(e.target.value)}
                        placeholder="smartsales_aria_verify_token"
                        className="h-9.5 text-xs bg-dark border-slate-800 text-slate-200 placeholder:text-slate-600 rounded-lg focus:border-brand-green/60"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/40">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsEditingWhatsApp(false)}
                        className="h-8 text-xs font-semibold text-slate-400 hover:text-white"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={whatsappLoading}
                        className="h-8 px-4 text-xs font-bold bg-brand-green hover:bg-brand-green/80 text-white rounded-lg shadow-green"
                      >
                        {whatsappLoading ? "Connecting..." : "Save WhatsApp Settings"}
                      </Button>
                    </div>
                  </form>
                )}
              </div>

              {/* Instagram Slot */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-dark/20 border border-slate-800 rounded-xl gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/20 shrink-0">
                    <Instagram size={18} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-200 truncate">Instagram DM Direct</h4>
                    <span className="flex items-center gap-1 text-[9px] text-slate-500 font-semibold mt-0.5 truncate">
                      Not Connected
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => { setInstagramConnected(!instagramConnected); }}
                  className={cn(
                    "h-7.5 px-3 rounded-lg text-[10px] font-semibold border-slate-700 w-full sm:w-auto shrink-0",
                    instagramConnected ? "text-red-400 hover:bg-red-500/10" : "text-pink-400 hover:bg-pink-500/10"
                  )}
                >
                  {instagramConnected ? "Disconnect" : "Connect Store"}
                </Button>
              </div>
            </div>

            {/* Right: Embed script block widget */}
            <div className="bg-dark-card rounded-xl border border-slate-700/50 p-4 sm:p-5 shadow-card hover:border-slate-600 transition-colors flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-50 uppercase tracking-widest flex items-center gap-2">
                  <Globe size={15} className="text-brand-green" /> Web Widget Integrations
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">Copy and paste this secure script code inside your store's HTML header to embed Aria.</p>
              </div>

              <div className="relative">
                <pre className="p-3 bg-dark border border-slate-850 rounded-lg text-[9px] font-mono text-slate-400 overflow-x-auto leading-relaxed select-all">
                  {embedScript}
                </pre>
                <button
                  onClick={handleCopyScript}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-300 transition-colors"
                >
                  {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                </button>
              </div>

              <p className="text-[10px] text-slate-500 leading-tight">
                Once copied, paste it right before the closing tag of your store index file. Aria will float automatically at the bottom right.
              </p>
            </div>
          </div>
        </TabsContent>

        {/* TAB 4: NOTIFICATIONS ALERTS */}
        <TabsContent value="notifications" className="space-y-4 focus-visible:outline-none">
          <div className="bg-dark-card rounded-xl border border-slate-700/50 p-4 sm:p-6 space-y-6 shadow-card hover:border-slate-600 transition-colors">
            <div>
              <h3 className="text-sm font-bold text-slate-50 uppercase tracking-widest flex items-center gap-2">
                <Bell size={15} className="text-brand-green" /> Alerts & Notifications
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Configure where your team receives pipeline activity checkups and order summaries.</p>
            </div>

            {/* Notification items */}
            <form onSubmit={handleSaveSettings} className="space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-slate-200">Email daily sales summaries</label>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Receive weekly and daily transaction logs to your billing contact emails.
                    </p>
                  </div>
                  <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} className="scale-85" />
                </div>

                <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-slate-200">Slack workspace channel triggers</label>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Push checkout orders alerts and active takeover notifications to a dedicated Slack channel.
                    </p>
                  </div>
                  <Switch checked={slackAlerts} onCheckedChange={setSlackAlerts} className="scale-85" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-slate-200">Push checkout warnings</label>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Pop screen alert overlays in browser whenever customer checkout attempts fail.
                    </p>
                  </div>
                  <Switch checked={pushAlerts} onCheckedChange={setPushAlerts} className="scale-85" />
                </div>
              </div>

              <Button type="submit" className="h-9 text-xs font-bold bg-brand-green hover:bg-brand-green/80 text-white rounded-lg shadow-green flex items-center gap-1.5">
                <Save size={13} /> Save Alerts Config
              </Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

