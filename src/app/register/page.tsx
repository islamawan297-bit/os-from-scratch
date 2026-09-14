"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Key, Mail, User, AlertCircle, Cpu } from "lucide-react";
import OSWindow from "@/components/OSWindow";
import { useAuth } from "@/components/AuthProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        login(data.user);
        router.push("/dashboard");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err: any) {
      setError("Network error during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-os-cyan/10 border border-os-cyan/40 flex items-center justify-center text-os-cyan mx-auto">
          <Cpu className="w-6 h-6 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold text-white font-mono">Create Systems Account</h1>
        <p className="text-xs text-slate-400 font-sans">
          Join thousands of kernel developers building operating systems from hardware up.
        </p>
      </div>

      <OSWindow title="register_developer.sh" badge="New Account">
        <form onSubmit={handleRegister} className="space-y-4 font-mono text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/40 text-rose-400 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold block uppercase">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                className="w-full pl-9 pr-3 py-2 bg-os-code border border-os-border rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-os-cyan"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold block uppercase">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ada@kernel.org"
                className="w-full pl-9 pr-3 py-2 bg-os-code border border-os-border rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-os-cyan"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold block uppercase">
              Password (Min 6 Characters) *
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
            <UserPlus className="w-3.5 h-3.5" />
            <span>{loading ? "Registering..." : "Create Account"}</span>
          </button>
        </form>
      </OSWindow>

      <div className="text-center font-mono text-xs text-slate-400">
        Already registered?{" "}
        <Link href="/login" className="text-os-cyan hover:underline font-bold">
          Log In Here &gt;
        </Link>
      </div>
    </div>
  );
}
