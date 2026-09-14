"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Terminal,
  Map,
  Layers,
  BookOpen,
  Code2,
  FolderGit2,
  Info,
  Mail,
  Search,
  Menu,
  X,
  Cpu,
  Github,
  Sun,
  Moon,
  User as UserIcon,
  LogOut,
  Shield,
  LayoutDashboard,
  LogIn,
} from "lucide-react";
import SearchModal from "./SearchModal";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const navLinks = [
    { href: "/", label: "Home", icon: Terminal },
    { href: "/roadmap", label: "Roadmap", icon: Map },
    { href: "/architecture", label: "Architecture", icon: Layers },
    { href: "/lessons", label: "Lessons", icon: BookOpen },
    { href: "/playground", label: "Playground", icon: Code2 },
    { href: "/projects", label: "Projects", icon: FolderGit2 },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Mail },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-os-border/80 bg-os-bg/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & System Status */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-os-cyan/20 to-os-violet/20 border border-os-cyan/40 flex items-center justify-center text-os-cyan group-hover:scale-105 transition-transform duration-200">
                <Cpu className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="font-mono text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                  OS<span className="text-os-cyan">::</span>FromScratch
                </span>
                <span className="block font-mono text-[10px] text-os-emerald tracking-wider uppercase">
                  [SYS_OK: 64-BIT KERNEL]
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md font-mono text-xs font-medium transition-all flex items-center space-x-1.5 ${
                    isActive
                      ? "bg-os-cyan/15 text-os-cyan border border-os-cyan/40 shadow-[0_0_12px_rgba(0,242,254,0.15)]"
                      : "text-slate-300 hover:text-white hover:bg-os-surface/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Tools: Search, Theme Toggle, User Profile / Auth */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-os-surface border border-os-border text-xs text-slate-400 hover:text-white hover:border-os-cyan/40 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-os-cyan" />
              <span className="font-mono">Search Kernel docs...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-os-card border border-slate-700 rounded text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md bg-os-surface border border-os-border text-slate-300 hover:text-os-cyan hover:border-os-cyan/40 transition-colors"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-os-cyan" />}
            </button>

            {/* User Auth Profile / Login Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="px-3 py-1.5 rounded-md bg-os-surface border border-os-cyan/40 text-os-cyan font-mono text-xs font-semibold flex items-center space-x-2 hover:bg-os-surface/80 transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>{user.name.split(" ")[0]}</span>
                  {user.role === "ADMIN" && (
                    <span className="font-mono text-[9px] px-1 bg-os-violet/30 text-os-violet border border-os-violet/40 rounded uppercase font-bold">
                      RING 0
                    </span>
                  )}
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-os-card border border-os-border shadow-2xl p-2 font-mono text-xs z-50 space-y-1">
                    <div className="px-3 py-2 border-b border-os-border text-[11px]">
                      <div className="text-white font-bold">{user.name}</div>
                      <div className="text-slate-400 truncate">{user.email}</div>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="px-3 py-2 rounded hover:bg-os-surface text-slate-300 hover:text-os-cyan flex items-center space-x-2 transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>User Dashboard</span>
                    </Link>

                    {user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="px-3 py-2 rounded hover:bg-os-surface text-os-violet flex items-center space-x-2 transition-colors font-bold"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 rounded hover:bg-rose-500/20 text-rose-400 flex items-center space-x-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-md bg-os-surface border border-os-border hover:border-os-cyan/40 font-mono text-xs text-white hover:text-os-cyan transition-colors flex items-center space-x-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 rounded-md bg-os-cyan text-slate-950 font-mono text-xs font-bold hover:bg-os-cyan/90 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md bg-os-surface border border-os-border text-slate-300"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-os-cyan" />}
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-md bg-os-surface border border-os-border text-slate-300"
            >
              <Search className="w-4 h-4 text-os-cyan" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md bg-os-surface border border-os-border text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-os-border bg-os-card/95 backdrop-blur-lg px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-md font-mono text-sm font-medium flex items-center space-x-2.5 transition-colors ${
                    isActive
                      ? "bg-os-cyan/20 text-os-cyan border border-os-cyan/40"
                      : "text-slate-300 hover:bg-os-surface hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 text-os-cyan" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="pt-2 border-t border-os-border space-y-1">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-md font-mono text-sm text-os-cyan flex items-center space-x-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard ({user.name})</span>
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-md font-mono text-sm text-os-violet font-bold flex items-center space-x-2"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin Console</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-md font-mono text-sm text-rose-400 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center rounded-md bg-os-surface border border-os-border text-white font-mono text-xs"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center rounded-md bg-os-cyan text-slate-950 font-mono text-xs font-bold"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Search Dialog */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
