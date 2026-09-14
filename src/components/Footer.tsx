"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Cpu, Github, Terminal, Send, CheckCircle2, ShieldCheck } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSubscribed(true);
        setEmail("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="w-full border-t border-os-border bg-os-bg text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Platform Meta */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-lg bg-os-surface border border-os-cyan/40 flex items-center justify-center text-os-cyan">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="font-mono text-base font-bold text-white">
                OS<span className="text-os-cyan">::</span>FromScratch
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              The premier open educational platform for engineering x86-64, RISC-V, and ARM operating system kernels from boot sector to userland shell.
            </p>
            <div className="flex items-center space-x-2 font-mono text-[11px] text-os-emerald">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Kernel Build v0.9.4-BETA</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 font-mono text-xs">
              <li>
                <Link href="/" className="hover:text-os-cyan transition-colors">
                  &gt; Home Terminal
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-os-cyan transition-colors">
                  &gt; Kernel Roadmap
                </Link>
              </li>
              <li>
                <Link href="/architecture" className="hover:text-os-cyan transition-colors">
                  &gt; OS Architecture
                </Link>
              </li>
              <li>
                <Link href="/lessons" className="hover:text-os-cyan transition-colors">
                  &gt; Lesson Index
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Interactive Sandbox & Projects */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
              Tooling & Code
            </h4>
            <ul className="space-y-2 font-mono text-xs">
              <li>
                <Link href="/playground" className="hover:text-os-cyan transition-colors">
                  &gt; x86 Assembly Playground
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-os-cyan transition-colors">
                  &gt; ZenithOS (x86-64)
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-os-cyan transition-colors">
                  &gt; RiscCore (RISC-V)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-os-cyan transition-colors">
                  &gt; Developer Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter Subscription */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
              Kernel Dispatch Newsletter
            </h4>
            <p className="text-xs text-slate-400 font-sans">
              Receive weekly systems engineering deep dives, paging tutorials, and assembly cheat sheets.
            </p>
            {subscribed ? (
              <div className="p-3 rounded-lg bg-os-emerald/10 border border-os-emerald/40 text-os-emerald font-mono text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Subscribed! Check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sysadmin@kernel.org"
                    className="w-full px-3 py-2 bg-os-surface border border-os-border rounded-md font-mono text-xs text-white placeholder-slate-500 focus:outline-none focus:border-os-cyan"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-1 top-1 bottom-1 px-3 bg-os-cyan/20 hover:bg-os-cyan/30 text-os-cyan rounded font-mono text-xs flex items-center justify-center transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-os-border flex flex-col sm:flex-row items-center justify-between font-mono text-xs text-slate-500 gap-4">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-os-cyan" />
            <span>Built for Systems Engineers & OS Architects worldwide.</span>
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/os-from-scratch"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <span>MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
