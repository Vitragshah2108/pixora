"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle2, Sparkles, AlertCircle, KeyRound } from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const response = await api.post("/api/users/forgot-password", { email });

      if (response.data.success) {
        setIsSubmitted(true);
        toast.success("Password reset instructions sent!");
      } else {
        setError(response.data.message || "Failed to process request");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError(err.response?.data?.message || "Unable to send reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0f17] text-white p-4 relative overflow-hidden">
      {/* Dynamic gradient background circles */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#161926]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
              Pixora
            </span>
          </Link>

          {!isSubmitted ? (
            <>
              <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
              <p className="text-sm text-gray-400">
                Enter your registered email address and we&apos;ll send you a link to reset your password.
              </p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Check Your Email</h1>
              <p className="text-sm text-gray-400">
                We&apos;ve sent password reset instructions to <strong className="text-purple-300">{email}</strong>.
              </p>
            </>
          )}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full bg-[#0d0f17]/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-purple-600/30 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setEmail("");
              }}
              className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl border border-white/10 transition-all"
            >
              Resend with a different email
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
