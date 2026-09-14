import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Building an Operating System from Scratch | Educational Kernel Platform",
  description:
    "Learn operating system development step-by-step from 16-bit real mode bootloader to 64-bit multi-tasking kernel, virtual memory paging, VFS, and C userland shell.",
  keywords: [
    "Operating System Development",
    "Kernel Programming",
    "x86-64 Assembly",
    "C Systems Programming",
    "Paging and Virtual Memory",
    "Bootloader",
    "GDT",
    "IDT",
    "RISC-V Kernel",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-os-bg text-slate-100 flex flex-col antialiased crt-overlay">
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
