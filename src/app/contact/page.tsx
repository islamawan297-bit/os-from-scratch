"use client";

import React, { useState } from "react";
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Terminal,
  Cpu,
} from "lucide-react";
import OSWindow from "@/components/OSWindow";
import { FAQS } from "@/lib/data/mockData";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Kernel Feedback / QEMU Question",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState<{
    type: "success" | "error";
    text: string;
    ticketId?: string;
  } | null>(null);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setResponseMsg({
          type: "success",
          text: data.message,
          ticketId: data.ticketId,
        });
        setFormData({
          name: "",
          email: "",
          subject: "Kernel Feedback / QEMU Question",
          message: "",
        });
      } else {
        setResponseMsg({
          type: "error",
          text: data.error || "Failed to submit message.",
        });
      }
    } catch (err) {
      setResponseMsg({
        type: "error",
        text: "Network transmission error. Please check your connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Header Banner */}
      <div className="space-y-4 border-b border-os-border pb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-os-cyan/10 border border-os-cyan/30 text-os-cyan font-mono text-xs">
          <Mail className="w-3.5 h-3.5" />
          <span>Developer Support & FAQ</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Contact <span className="os-gradient-text">Architect Team</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl font-sans leading-relaxed">
          Have questions about toolchain compilation, QEMU boot flags, or GDT debugging? Transmit a message directly to our core systems engineering maintainers.
        </p>
      </div>

      {/* Main Grid: Left Form | Right FAQ Accordion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Contact Form Window */}
        <div className="lg:col-span-6">
          <OSWindow title="transmit_message.sh" badge="COM1 Serial Transmission">
            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              {responseMsg && (
                <div
                  className={`p-3 rounded-lg border font-mono text-xs flex items-start space-x-2 ${
                    responseMsg.type === "success"
                      ? "bg-os-emerald/10 border-os-emerald/40 text-os-emerald"
                      : "bg-rose-500/10 border-rose-500/40 text-rose-400"
                  }`}
                >
                  {responseMsg.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div>{responseMsg.text}</div>
                    {responseMsg.ticketId && (
                      <div className="text-[10px] opacity-80 mt-1 font-bold">
                        TRANSMISSION ID: {responseMsg.ticketId}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Name Input */}
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold block uppercase">
                  Developer Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Linus Torvalds"
                  className="w-full px-3 py-2 bg-os-code border border-os-border rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-os-cyan"
                  required
                />
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold block uppercase">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sysadmin@kernel.org"
                  className="w-full px-3 py-2 bg-os-code border border-os-border rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-os-cyan"
                  required
                />
              </div>

              {/* Subject Input */}
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold block uppercase">
                  Subject Category
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-os-code border border-os-border rounded-lg text-white focus:outline-none focus:border-os-cyan"
                >
                  <option value="Kernel Feedback / QEMU Question">
                    Kernel Feedback / QEMU Question
                  </option>
                  <option value="Toolchain / GCC Cross Compiler">
                    Toolchain / GCC Cross Compiler
                  </option>
                  <option value="Paging & GDT Debugging">Paging & GDT Debugging</option>
                  <option value="General Technical Inquiry">General Technical Inquiry</option>
                </select>
              </div>

              {/* Message Input */}
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold block uppercase">
                  Technical Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  placeholder="Describe your kernel compilation setup, BIOS error messages, or questions..."
                  className="w-full px-3 py-2 bg-os-code border border-os-border rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-os-cyan resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-os-cyan text-slate-950 font-mono text-xs font-bold hover:bg-os-cyan/90 transition-all flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(0,242,254,0.3)]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? "Transmitting Packet..." : "Transmit Message"}</span>
              </button>
            </form>
          </OSWindow>
        </div>

        {/* Right Column: FAQ Accordion */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-os-cyan uppercase border-b border-os-border pb-3">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked OS Engineering Questions</span>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-os-border bg-os-card overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-mono text-xs font-semibold text-white flex items-center justify-between hover:bg-os-surface/50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? "rotate-180 text-os-cyan" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="p-4 pt-0 font-sans text-xs text-slate-300 border-t border-os-border/40 leading-relaxed bg-os-surface/30">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
