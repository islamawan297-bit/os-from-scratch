"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Key, Mail, CheckCircle2, AlertCircle, Cpu, ArrowRight } from "lucide-react";
import OSWindow from "@/components/OSWindow";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        login(data.user);
        router.push("/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err: any) {
      setError("Network authentication failure.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoUser = () => {
    setEmail("user@kernel.org");
    setPassword("user123");
  };

  const handleQuickDemoAdmin = () => {
    setEmail("admin@kernel.org");
    setPassword("admin123");
  };

  return (
    <div className="py-12 max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-os-cyan/10 border border-os-cyan/40 flex items-center justify-center text-os-cyan mx-auto">
          <Cpu className="w-6 h-6 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold text-white font-mono">Kernel Authentication</h1>
        <p className="text-xs text-slate-400 font-sans">
          Log in to synchronize your OS engineering progress across devices.
        </p>
      </div>

      <OSWindow title="user_authenticate.sh" badge="TTY Login">
        <form onSubmit={handleLogin} className="space-y-4 font-mono text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/40 text-rose-400 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold block uppercase">
              Kernel Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@kernel.org"
                className="w-full pl-9 pr-3 py-2 bg-os-code border border-os-border rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-os-cyan"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold block uppercase">
              Security Key / Password *
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-os-code border border-os-border rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-os-cyan"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-os-cyan text-slate-950 font-mono text-xs font-bold hover:bg-os-cyan/90 transition-all flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(0,242,254,0.3)]"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{loading ? "Verifying Credentials..." : "Authenticate"}</span>
          </button>

          {/* Quick Demo Credentials Autofill Helper */}
          <div className="pt-3 border-t border-os-border/60 space-y-2">
            <div className="text-[10px] text-slate-500 text-center uppercase font-semibold">
              Quick Fill Demo Accounts:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickDemoUser}
                className="py-1.5 px-2 rounded bg-os-surface border border-os-border hover:border-os-cyan/40 text-[10px] text-slate-300 hover:text-os-cyan"
              >
                Trainee User
              </button>
              <button
                type="button"
                onClick={handleQuickDemoAdmin}
                className="py-1.5 px-2 rounded bg-os-surface border border-os-border hover:border-os-violet/40 text-[10px] text-slate-300 hover:text-os-violet font-bold"
              >
                Admin Ring 0
              </button>
            </div>
          </div>
        </form>
      </OSWindow>

      <div className="text-center font-mono text-xs text-slate-400">
        Don&apos;t have an OS account?{" "}
        <Link href="/register" className="text-os-cyan hover:underline font-bold">
          Register Here &gt;
        </Link>
      </div>
    </div>
  );
}
