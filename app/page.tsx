import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare, Zap, BarChart3, Check, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-blue-900">
              SmartSales AI
            </span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
            <Link href="#features" className="hover:text-blue-600">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-blue-600">
              How it Works
            </Link>
            <Link href="#pricing" className="hover:text-blue-600">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-blue-600"
              >
                Log in
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="container px-4 md:px-6 text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100">
              Now with GPT-4 Turbo
            </Badge>
            <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl mb-6">
              Turn <span className="text-blue-600">Chats</span> Into{" "}
              <span className="text-purple-600">Sales</span> Automatically
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-600 mb-10 leading-relaxed">
              Engage leads 24/7 across WhatsApp, Web, and SMS. Our AI sales
              agent qualifies, follows up, and closes deals while you sleep.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="h-12 px-8 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                >
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-lg border-gray-300"
              >
                View Demo
              </Button>
            </div>
            <div className="mt-16 relative mx-auto max-w-5xl rounded-2xl bg-gray-900/5 p-2 ring-1 ring-gray-900/10 lg:rounded-3xl lg:p-4">
              <div className="aspect-[16/9] rounded-xl bg-white shadow-2xl overflow-hidden relative">
                {/* Mock UI for Hero */}
                <div className="flex h-full">
                  <div className="w-64 border-r bg-gray-50 p-4 hidden md:block text-left">
                    <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-12 bg-white rounded shadow-sm border p-2">
                        <div className="h-3 w-32 bg-gray-100 rounded"></div>
                      </div>
                      <div className="h-12 bg-white rounded shadow-sm border p-2">
                        <div className="h-3 w-32 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-end">
                    <div className="space-y-4 max-w-lg mx-auto w-full">
                      <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none self-start max-w-xs text-left text-sm text-gray-700">
                        Hi! I'm interested in the Business Plan. Does it include
                        API access?
                      </div>
                      <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-none self-end max-w-xs text-left text-sm text-white shadow-md">
                        Yes! The Business Plan includes full API access,
                        priority support, and unlimited team members. Would you
                        like to see the documentation?
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to scale sales
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Powerful tools to automate your workflow and boost conversion
                rates.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "AI Sales Agent",
                  icon: MessageSquare,
                  desc: "Intelligent responses that sound human. Handles objections and schedules meetings.",
                },
                {
                  title: "Omnichannel",
                  icon: Zap,
                  desc: "Connect WhatsApp, Messenger, Instagram, and SMS in one unified inbox.",
                },
                {
                  title: "Smart Analytics",
                  icon: BarChart3,
                  desc: "Track conversion rates, response times, and revenue attribution automatically.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="p-8 rounded-2xl border bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mb-6">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="relative">
                <div className="text-6xl font-black text-gray-200 mb-6">01</div>
                <h3 className="text-xl font-bold mb-2">Connect Channels</h3>
                <p className="text-gray-600">
                  Link your WhatsApp, Website widget, or SMS provider in
                  seconds.
                </p>
              </div>
              <div className="relative">
                <div className="text-6xl font-black text-gray-200 mb-6">02</div>
                <h3 className="text-xl font-bold mb-2">Train Your AI</h3>
                <p className="text-gray-600">
                  Upload your product docs and pricing. The AI learns your
                  business instantly.
                </p>
              </div>
              <div className="relative">
                <div className="text-6xl font-black text-gray-200 mb-6">03</div>
                <h3 className="text-xl font-bold mb-2">Watch Sales Grow</h3>
                <p className="text-gray-600">
                  The AI engages leads 24/7. You only step in when it's time to
                  close.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">
              Simple, transparent pricing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free */}
              <div className="border rounded-2xl p-8 shadow-sm">
                <h3 className="font-semibold text-lg text-gray-900">Starter</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight">
                    $0
                  </span>
                  <span className="ml-1 text-gray-500">/mo</span>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Perfect for trying out SmartSales AI.
                </p>
                <ul className="mt-6 space-y-4">
                  {[
                    "100 AI chats/month",
                    "1 Team Member",
                    "Basic Analytics",
                  ].map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-gray-600">
                      <Check className="h-5 w-5 text-green-500 shrink-0" />{" "}
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-8" variant="outline">
                  Get Started
                </Button>
              </div>

              {/* Pro */}
              <div className="border border-blue-200 rounded-2xl p-8 shadow-lg ring-1 ring-blue-600 relative bg-blue-50/10">
                <div className="absolute top-0 right-0 -mt-3 -mr-3 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                  Popular
                </div>
                <h3 className="font-semibold text-lg text-blue-600">Growth</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight">
                    $49
                  </span>
                  <span className="ml-1 text-gray-500">/mo</span>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  For growing businesses scaling fast.
                </p>
                <ul className="mt-6 space-y-4">
                  {[
                    "Unlimited AI chats",
                    "5 Team Members",
                    "Advanced Analytics",
                    "Custom Training",
                  ].map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-gray-900">
                      <Check className="h-5 w-5 text-blue-600 shrink-0" />{" "}
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-8 bg-blue-600 hover:bg-blue-700">
                  Start Free Trial
                </Button>
              </div>

              {/* Business */}
              <div className="border rounded-2xl p-8 shadow-sm">
                <h3 className="font-semibold text-lg text-gray-900">
                  Business
                </h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight">
                    $199
                  </span>
                  <span className="ml-1 text-gray-500">/mo</span>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  For large teams and high volume.
                </p>
                <ul className="mt-6 space-y-4">
                  {[
                    "Priority Support",
                    "Unlimited Members",
                    "API Access",
                    "Dedicated Success Manager",
                  ].map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-gray-600">
                      <Check className="h-5 w-5 text-green-500 shrink-0" />{" "}
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-8" variant="outline">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-12 bg-gray-50">
          <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-gray-900 flex items-center justify-center">
                <span className="text-white font-bold text-xs">S</span>
              </div>
              <span className="font-bold text-gray-900">SmartSales AI</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2024 SmartSales AI. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="#" className="hover:underline">
                Privacy
              </Link>
              <Link href="#" className="hover:underline">
                Terms
              </Link>
              <Link href="#" className="hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
    >
      {children}
    </span>
  );
}
