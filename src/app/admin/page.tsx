"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Users,
  Database,
  Terminal,
  AlertOctagon,
  RefreshCw,
  Cpu,
  CheckCircle2,
  Lock,
  Sparkles,
} from "lucide-react";
import OSWindow from "@/components/OSWindow";
import { useAuth } from "@/components/AuthProvider";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  _count?: {
    progress: number;
    projects: number;
  };
}

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [fetching, setFetching] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  const fetchUsers = async () => {
    setFetching(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
      } else {
        setAccessDenied(true);
      }
    } catch (e) {
      setAccessDenied(true);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "ADMIN") {
        setAccessDenied(true);
        setFetching(false);
      } else {
        fetchUsers();
      }
    }
  }, [user, loading]);

  if (loading || fetching) {
    return (
      <div className="py-20 text-center font-mono text-xs text-os-violet animate-pulse">
        [SYS] Authenticating Ring 0 Admin Security Credentials...
      </div>
    );
  }

  if (accessDenied || !user || user.role !== "ADMIN") {
    return (
      <div className="py-16 max-w-xl mx-auto space-y-6">
        <OSWindow title="privilege_fault.sys" badge="RING 0 FAULT">
          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center space-x-2 text-rose-500 font-bold border-b border-os-border pb-2">
              <Lock className="w-5 h-5" />
              <span>ACCESS DENIED: RING 0 PRIVILEGE FAULT #GPF(0)</span>
            </div>

            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              You attempted to access the Kernel Administration Console without Ring 0 Admin security privileges.
            </p>

            <div className="p-3 rounded bg-black border border-rose-500/30 text-rose-400">
              Required Role: ADMIN | Current User Role: {user ? user.role : "GUEST"}
            </div>

            <Link
              href="/"
              className="inline-block px-4 py-2 rounded bg-os-surface border border-os-border text-white font-mono text-xs hover:border-os-cyan/40"
            >
              &lt; Return to Public Shell
            </Link>
          </div>
        </OSWindow>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-16">
      {/* Admin Header */}
      <div className="space-y-4 border-b border-os-border pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-os-violet/10 border border-os-violet/30 text-os-violet font-mono text-xs font-bold">
          <Shield className="w-3.5 h-3.5" />
          <span>Kernel Administration Console (Ring 0 Privileged)</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          System Metrics & <span className="os-gradient-text">User Management</span>
        </h1>
      </div>

      {/* Admin Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 font-mono text-xs">
        <div className="p-4 rounded-xl bg-os-card border border-os-border space-y-1">
          <div className="text-slate-400 text-[10px] uppercase font-semibold">Total Accounts</div>
          <div className="text-2xl font-bold text-white">{users.length} Users</div>
        </div>

        <div className="p-4 rounded-xl bg-os-card border border-os-border space-y-1">
          <div className="text-slate-400 text-[10px] uppercase font-semibold">Active Engine</div>
          <div className="text-2xl font-bold text-os-cyan">PostgreSQL + Prisma</div>
        </div>

        <div className="p-4 rounded-xl bg-os-card border border-os-border space-y-1">
          <div className="text-slate-400 text-[10px] uppercase font-semibold">Kernel State</div>
          <div className="text-2xl font-bold text-os-emerald">[SYS_OK: 100%]</div>
        </div>

        <div className="p-4 rounded-xl bg-os-card border border-os-border space-y-1">
          <div className="text-slate-400 text-[10px] uppercase font-semibold">Security Ring</div>
          <div className="text-2xl font-bold text-os-violet">Ring 0 Active</div>
        </div>
      </div>

      {/* Users Management Table Window */}
      <OSWindow title="user_database_table.db" badge="PostgreSQL">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-os-border pb-3">
            <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
              <Users className="w-4 h-4 text-os-cyan" />
              <span>Registered OS Engineers ({users.length})</span>
            </div>

            <button
              onClick={fetchUsers}
              className="p-1.5 rounded bg-os-surface border border-os-border text-slate-300 hover:text-os-cyan"
              title="Refresh Users"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs text-slate-300">
              <thead>
                <tr className="border-b border-os-border bg-os-surface/60 text-os-cyan">
                  <th className="p-3">User Name</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Security Role</th>
                  <th className="p-3">Joined Date</th>
                  <th className="p-3">Lessons Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-os-border/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-os-surface/40">
                    <td className="p-3 font-bold text-white flex items-center space-x-2">
                      <div className="w-6 h-6 rounded bg-os-surface border border-os-cyan/40 flex items-center justify-center text-[10px] text-os-cyan">
                        {u.name.charAt(0)}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="p-3 text-slate-300">{u.email}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === "ADMIN"
                            ? "bg-os-violet/20 text-os-violet border border-os-violet/40"
                            : "bg-os-cyan/10 text-os-cyan border border-os-cyan/30"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-os-emerald font-bold">
                      {u._count ? u._count.progress : 0} Completed
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </OSWindow>
    </div>
  );
}
