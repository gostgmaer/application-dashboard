"use client";

import React, { useEffect, useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

function SSOLandingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams ? searchParams.get("token") : null;
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("No Single Sign-On token found. Please sign in again.");
      return;
    }

    const performSSO = async () => {
      try {
        console.log("🔑 Triggering NextAuth SSO credentials sign-in...");
        const result = await signIn("credentials", {
          token,
          redirect: false,
        });

        if (result?.error) {
          console.error("❌ NextAuth SSO authentication failed:", result.error);
          setStatus("error");
          setErrorMessage(result.error || "Authentication failed. Token might be expired.");
        } else if (result?.ok) {
          console.log("✅ SSO authentication successful!");
          setStatus("success");
          setTimeout(() => {
            router.replace("/dashboard");
          }, 1500);
        }
      } catch (err: any) {
        console.error("❌ SSO Error:", err);
        setStatus("error");
        setErrorMessage(err.message || "An unexpected error occurred during Single Sign-On.");
      }
    };

    performSSO();
  }, [token, router]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950 font-sans">
      {/* Background Animated Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/30 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-purple-600/25 blur-[150px]"
        />
      </div>

      {/* Main Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4 p-8 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center text-white"
      >
        {status === "loading" && (
          <div className="space-y-6">
            <div className="relative flex justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 flex items-center justify-center"
              >
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              </motion.div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Verifying Credentials
              </h2>
              <p className="text-slate-400 text-sm">
                Authenticating your administrator session, please wait...
              </p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
              </motion.div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-emerald-400">
                Access Granted
              </h2>
              <p className="text-slate-450 text-sm">
                SSO verified successfully. Redirecting to dashboard...
              </p>
            </div>
            {/* Small glowing loading line */}
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
                className="bg-gradient-to-r from-emerald-400 to-indigo-500 h-full"
              />
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                <AlertCircle className="w-8 h-8 text-rose-400" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-rose-400">
                SSO Authentication Failed
              </h2>
              <p className="text-slate-400 text-sm">
                {errorMessage}
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => router.push("/auth/login")}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98] transition-all rounded-lg font-semibold text-sm shadow-md"
              >
                Go to standard login
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function SSOLandingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    }>
      <SSOLandingContent />
    </Suspense>
  );
}
