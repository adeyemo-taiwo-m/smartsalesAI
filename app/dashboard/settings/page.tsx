"use client";

import React, { useState } from "react";
import { Sparkles, MessageCircle, Instagram, Globe, Bell, Save, Copy, Check, Upload, Store, User, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/store/useStore";

export default function SettingsPage() {
  const { user } = useStore();
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
  const [whatsappConnected, setWhatsappConnected] = useState(true);
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [copied, setCopied] = useState(false);

  // Notification Toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(false);
  const [pushAlerts, setPushAlerts] = useState(true);

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

  const handleSaveAlert = (msg: string) => {
    alert(`${msg} saved successfully! (Demo Simulation)`);
  };

  return (
    <div className="space-y-6 select-none max-w-4xl px-4 sm:px-0">
      {/* Title */}
      <div className="pb-4 border-b border-slate-700/30">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-50 tracking-tight">System Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Configure business profile parameters, train AI Aria prompts, and link WhatsApp endpoints.</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="business" className="space-y-6">
        <TabsList className="bg-dark border border-slate-800 p-1 rounded-xl flex flex-nowrap overflow-x-auto scrollbar-none w-full max-w-full justify-start">
          <TabsTrigger value="business" className="text-xs font-semibold px-4 py-2 rounded-lg shrink-0 data-[state=active]:bg-dark-card data-[state=active]:text-brand-green">
            Business Profile
          </TabsTrigger>
          <TabsTrigger value="ai" className="text-xs font-semibold px-4 py-2 rounded-lg shrink-0 data-[state=active]:bg-dark-card data-[state=active]:text-brand-green">
            Aria AI Agent
          </TabsTrigger>
          <TabsTrigger value="channels" className="text-xs font-semibold px-4 py-2 rounded-lg shrink-0 data-[state=active]:bg-dark-card data-[state=active]:text-brand-green">
            Integrations & Channels
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs font-semibold px-4 py-2 rounded-lg shrink-0 data-[state=active]:bg-dark-card data-[state=active]:text-brand-green">
            Alerts Notifications
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
            <div className="flex items-center gap-4 border-b border-slate-850 pb-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-lg">
                KF
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business Brand Mark</label>
                <div className="flex gap-2">
                  <Button variant="outline" className="h-8 text-xs font-semibold border-slate-700 text-slate-300 hover:text-white">
                    <Upload size={12} className="mr-1.5" /> Upload Brand Mark
                  </Button>
                  <Button variant="ghost" className="h-8 text-xs text-red-400 hover:text-red-300">Remove</Button>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleSaveAlert("Business profile"); }} className="space-y-4">
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
            <form onSubmit={(e) => { e.preventDefault(); handleSaveAlert("AI configuration"); }} className="space-y-5">
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
              <div className="flex items-center justify-between p-4 bg-dark/20 border border-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/20">
                    <MessageCircle size={18} className="fill-green-400/10" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">WhatsApp Business API</h4>
                    <span className="flex items-center gap-1 text-[9px] text-green-400 font-semibold mt-0.5">
                      <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" /> +234 803 111 2222 Connected
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => { setWhatsappConnected(!whatsappConnected); }}
                  className={`h-7.5 px-3 rounded-lg text-[10px] font-semibold border-slate-700 ${
                    whatsappConnected ? "text-red-400 hover:bg-red-500/10" : "text-green-400 hover:bg-green-500/10"
                  }`}
                >
                  {whatsappConnected ? "Disconnect" : "Connect"}
                </Button>
              </div>

              {/* Instagram Slot */}
              <div className="flex items-center justify-between p-4 bg-dark/20 border border-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/20">
                    <Instagram size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Instagram DM Direct</h4>
                    <span className="flex items-center gap-1 text-[9px] text-slate-500 font-semibold mt-0.5">
                      Not Connected
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => { setInstagramConnected(!instagramConnected); }}
                  className={`h-7.5 px-3 rounded-lg text-[10px] font-semibold border-slate-700 ${
                    instagramConnected ? "text-red-400 hover:bg-red-500/10" : "text-pink-400 hover:bg-pink-500/10"
                  }`}
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
            <form onSubmit={(e) => { e.preventDefault(); handleSaveAlert("Notifications"); }} className="space-y-5">
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

