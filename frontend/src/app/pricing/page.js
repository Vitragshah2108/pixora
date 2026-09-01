"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Zap,
  Crown,
  Sparkles,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  HelpCircle,
  TrendingUp,
  Image as ImageIcon,
  HardDrive,
  Users,
  Award,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PricingPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [billingCycle, setBillingCycle] = useState("monthly"); // "monthly" | "yearly"
  const [currency, setCurrency] = useState("INR"); // "INR" | "USD"
  const [processingPlan, setProcessingPlan] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationPlan, setCelebrationPlan] = useState("");

  // Dynamically load Razorpay SDK
  useEffect(() => {
    const loadRazorpay = () => {
      if (document.getElementById("razorpay-sdk")) return;
      const script = document.createElement("script");
      script.id = "razorpay-sdk";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    };
    loadRazorpay();
  }, []);

  const tiers = [
    {
      id: "free",
      name: "Starter",
      badge: "Free Forever",
      description: "Essential visual discovery & community sharing tools for hobbyist photographers.",
      priceINR: 0,
      priceUSD: 0,
      gradient: "from-zinc-800/80 to-zinc-900/80",
      border: "border-white/10",
      btnText: user ? "Current Plan" : "Get Started Free",
      btnClass: "bg-white/10 hover:bg-white/20 text-white",
      highlight: false,
      features: [
        "5 GB Cloud Media Storage",
        "Up to 10 Image Uploads / day",
        "Standard Masonry Feed Discovery",
        "Community Likes & Threaded Comments",
        "Curate up to 5 Moodboard Collections",
        "Standard JPEG/PNG Compression",
      ],
    },
    {
      id: "pro",
      name: "Creator Pro",
      badge: "Most Popular",
      description: "For professional photographers, 3D artists, and creators scaling their visual brand.",
      priceINR: billingCycle === "monthly" ? 499 : 399,
      priceUSD: billingCycle === "monthly" ? 9 : 7,
      gradient: "from-violet-900/40 via-purple-900/30 to-indigo-900/40",
      border: "border-violet-500/50 shadow-2xl shadow-purple-500/20",
      btnText: user?.isPremium && user?.premiumPlan === "pro" ? "Current Active Plan" : "Upgrade to Pro",
      btnClass: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30",
      highlight: true,
      features: [
        "100 GB Ultra-Fast Cloud Storage",
        "Unlimited High-Res & 4K Uploads",
        "Verified Creator Badge (Pro)",
        "Priority Feed Placement & Featured Showcase",
        "Unlimited Collections & Moodboards",
        "Direct Original RAW / EXIF Downloads",
        "Creator Analytics & Traffic Insights",
        "Custom Profile Bio & Social Links",
      ],
    },
    {
      id: "studio",
      name: "Studio / Agency",
      badge: "Maximum Power",
      description: "For photo agencies, design studios, and top-tier visual architects needing unlimited scale.",
      priceINR: billingCycle === "monthly" ? 1499 : 1199,
      priceUSD: billingCycle === "monthly" ? 29 : 24,
      gradient: "from-amber-900/30 via-fuchsia-900/20 to-zinc-900/60",
      border: "border-amber-500/40 shadow-2xl shadow-amber-500/10",
      btnText: user?.isPremium && user?.premiumPlan === "studio" ? "Current Active Plan" : "Get Studio Access",
      btnClass: "bg-gradient-to-r from-amber-500 to-fuchsia-600 hover:from-amber-400 hover:to-fuchsia-500 text-white shadow-lg shadow-amber-500/30",
      highlight: false,
      features: [
        "Unlimited Cloud Storage & Bandwidth",
        "Golden Trendsetter Prestige Badge",
        "Commercial Licensing & Rights Generator",
        "Dedicated Edge CDN Optimization",
        "Direct Client Collaboration Galleries",
        "Early Access to AI Generation & Beta Features",
        "Dedicated 24/7 VIP Creator Support",
      ],
    },
  ];

  const handleSubscribe = async (tier) => {
    if (tier.id === "free") {
      if (!user) router.push("/register");
      else router.push("/feed");
      return;
    }

    if (!user) {
      toast("Please sign in to upgrade your subscription", { icon: "🔒" });
      router.push("/login?redirect=/pricing");
      return;
    }

    try {
      setProcessingPlan(tier.id);

      // 1. Create order on backend
      const orderResponse = await api.post("/api/payment/razorpay/order", {
        plan: tier.id,
        currency: "INR",
      });

      const orderData = orderResponse.data?.data;

      if (!orderData) {
        throw new Error("Failed to generate payment order");
      }

      // 2. If test mode / mock order or Razorpay window is available
      if (typeof window !== "undefined" && window.Razorpay && !orderData.isMock && orderData.keyId !== "rzp_test_placeholder") {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "Pixora Creative Studio",
          description: `Upgrade to Pixora ${tier.name}`,
          image: "https://pixora-hub.vercel.app/favicon.ico",
          order_id: orderData.orderId,
          handler: async function (response) {
            try {
              const verifyRes = await api.post("/api/payment/razorpay/verify", {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                plan: tier.id,
              });

              if (verifyRes.data.success) {
                if (refreshUser) await refreshUser();
                setCelebrationPlan(tier.name);
                setShowCelebration(true);
                toast.success(`Upgraded to ${tier.name}! Enjoy your premium creator privileges.`);
              }
            } catch (err) {
              console.error("Verification error:", err);
              toast.error(err.response?.data?.message || "Payment verification failed");
            }
          },
          prefill: {
            name: user.fullName || user.username,
            email: user.email,
          },
          theme: {
            color: "#7c3aed",
          },
          modal: {
            ondismiss: function () {
              setProcessingPlan(null);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Test mode automatic upgrade simulation (instant verification for testing)
        toast("Processing Razorpay Test Mode Checkout...", { icon: "⚡" });

        const verifyRes = await api.post("/api/payment/razorpay/verify", {
          razorpayOrderId: orderData.orderId,
          razorpayPaymentId: `pay_test_${Date.now()}`,
          razorpaySignature: "mock_signature_test_mode",
          plan: tier.id,
          isMock: true,
        });

        if (verifyRes.data.success) {
          if (refreshUser) await refreshUser();
          setCelebrationPlan(tier.name);
          setShowCelebration(true);
          toast.success(`⚡ Test Mode: Successfully activated ${tier.name}!`);
        }
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error(error.response?.data?.message || "Payment checkout failed. Please try again.");
    } finally {
      setProcessingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-white flex flex-col selection:bg-purple-500 selection:text-white">
      <Header />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background glow ambients */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-purple-600/15 via-indigo-600/15 to-transparent blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[300px] bg-pink-600/10 blur-[140px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simple, Transparent Pricing</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
            >
              Fuel Your Creativity with{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Pixora Pro
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-5 text-gray-400 text-base sm:text-lg max-w-2xl mx-auto"
            >
              Unlock ultra-high resolution cloud media storage, verified creator badges, priority showcase placement, and advanced analytics.
            </motion.p>

            {/* Billing & Currency Controls */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              {/* Monthly / Yearly Toggle */}
              <div className="flex items-center bg-white/5 border border-white/10 p-1 rounded-xl backdrop-blur-md">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    billingCycle === "monthly"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                    billingCycle === "yearly"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Yearly
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                    Save 20%
                  </span>
                </button>
              </div>

              {/* Currency Selector */}
              <div className="flex items-center bg-white/5 border border-white/10 p-1 rounded-xl backdrop-blur-md">
                <button
                  onClick={() => setCurrency("INR")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    currency === "INR" ? "bg-white/20 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  ₹ INR
                </button>
                <button
                  onClick={() => setCurrency("USD")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    currency === "USD" ? "bg-white/20 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  $ USD
                </button>
              </div>
            </motion.div>
          </div>

          {/* Pricing Tier Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
            {tiers.map((tier, idx) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (idx + 1) }}
                className={`relative rounded-3xl p-8 flex flex-col justify-between bg-gradient-to-b ${tier.gradient} backdrop-blur-xl border ${tier.border} transition-all duration-300 hover:scale-[1.02]`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-500/40 flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5" />
                    {tier.badge}
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                    {!tier.highlight && (
                      <span className="px-3 py-1 text-xs font-medium text-gray-400 bg-white/5 rounded-full border border-white/10">
                        {tier.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-400 text-sm mb-6 min-h-[40px]">{tier.description}</p>

                  <div className="mb-6 flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-extrabold text-white">
                      {currency === "INR" ? `₹${tier.priceINR}` : `$${tier.priceUSD}`}
                    </span>
                    {tier.priceINR > 0 && (
                      <span className="text-gray-400 text-sm font-medium">
                        / month {billingCycle === "yearly" ? "(billed yearly)" : ""}
                      </span>
                    )}
                  </div>

                  <hr className="border-white/10 mb-6" />

                  {/* Feature Checklist */}
                  <div className="space-y-3.5 mb-8">
                    <p className="text-xs uppercase font-semibold tracking-wider text-gray-300">
                      What&apos;s included:
                    </p>
                    {tier.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3 text-sm text-gray-300">
                        <div className="p-0.5 rounded-full bg-emerald-500/10 text-emerald-400 mt-0.5 shrink-0 border border-emerald-500/20">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleSubscribe(tier)}
                  disabled={processingPlan === tier.id || (user?.isPremium && user?.premiumPlan === tier.id)}
                  className={`w-full py-4 px-6 rounded-2xl font-semibold text-sm transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${tier.btnClass} disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {processingPlan === tier.id ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {tier.btnText}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Feature Matrix / Highlights Banner */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#141724] to-[#1a1528] border border-white/10 backdrop-blur-xl mb-20">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Why Creators Choose Pixora Pro</h2>
              <p className="text-gray-400 text-sm sm:text-base">
                Everything you need to showcase, distribute, and protect your digital photography portfolio.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                  <HardDrive className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-white mb-1">Ultra Fast Media Storage</h4>
                <p className="text-xs text-gray-400">High-speed Cloudinary CDN caching with multi-resolution scaling.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-3">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-white mb-1">Prestige Badges</h4>
                <p className="text-xs text-gray-400">Stand out in the creator network with Verified & Pro badges.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-white mb-1">Algorithmic Boost</h4>
                <p className="text-xs text-gray-400">Get top placement on Discover, Trending, and Community feeds.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-white mb-1">Secure Razorpay Testing</h4>
                <p className="text-xs text-gray-400">Seamless 256-bit encrypted checkout with instant activation.</p>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "How does the Razorpay payment flow work?",
                  a: "Pixora integrates Razorpay test & live modes. You can check out with UPI, Cards, Netbanking, or test credentials. Your account updates automatically upon instant signature verification.",
                },
                {
                  q: "Can I cancel or change my plan anytime?",
                  a: "Yes! You have complete freedom to upgrade, downgrade, or switch billing cycles anytime from your account settings without penalties.",
                },
                {
                  q: "Do I keep my uploaded photos if I downgrade?",
                  a: "All your existing images and collections remain completely safe and viewable in the community forever.",
                },
                {
                  q: "What payment methods are supported?",
                  a: "We support UPI (GPay, PhonePe, Paytm), Credit/Debit Cards (Visa, Mastercard, RuPay), NetBanking from 50+ banks, and international cards.",
                },
              ].map((faq, fIdx) => (
                <div key={fIdx} className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <h4 className="font-semibold text-white flex items-center gap-2 mb-2">
                    <HelpCircle className="w-4 h-4 text-purple-400" />
                    {faq.q}
                  </h4>
                  <p className="text-sm text-gray-400 pl-6">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Upgrade Success Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-[#141726] border border-purple-500/40 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-purple-500/30 animate-bounce">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Welcome to {celebrationPlan}!</h3>
              <p className="text-sm text-gray-300 mb-6">
                Your account has been upgraded with verified creator privileges and unlimited cloud power.
              </p>
              <button
                onClick={() => {
                  setShowCelebration(false);
                  router.push("/dashboard");
                }}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all"
              >
                Go to Creator Dashboard
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
