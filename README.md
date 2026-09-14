# Building an Operating System from Scratch 💻⚙️

A complete, full-stack educational and technical platform for learning bare-metal systems engineering, x86-64 / RISC-V kernel architecture, memory paging, interrupt handlers, virtual file systems, and userland shells.

![Tech Stack](https://img.shields.io/badge/Stack-Next.js%2014%20%7C%20TypeScript%20%7C%20TailwindCSS%20%7C%20Prisma%20%7C%20PostgreSQL-00f2fe)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🌟 Features

- 🗺️ **Interactive OS Development Roadmap**: 7-stage kernel engineering trajectory (16-bit MBR Bootloader $\rightarrow$ 32-bit GDT Protected Mode $\rightarrow$ 64-bit Paging $\rightarrow$ IDT Interrupts $\rightarrow$ Buddy Heap $\rightarrow$ Preemptive Scheduler $\rightarrow$ VFS & ELF Shell) with target CPU selectors (`x86-64`, `RISC-V`, `ARM64`) and register/memory segment inspectors.
- 🏗️ **OS Architecture Visualizer**: Interactive subsystem visualizer across 5 privilege levels (Ring 3 User Space, Syscall Dispatcher, Ring 0 Kernel Core, Hardware Abstraction Layer, Bare Metal Hardware) with C header declarations and code stubs.
- 📚 **Comprehensive Lesson Platform**: Step-by-step curriculum with code implementations, interactive self-check quizzes with immediate score feedback, and completion status synced with PostgreSQL database (`/api/user/progress`) and `localStorage`.
- 💻 **Terminal Code Playground & CPU Simulator**: Web-based x86 Assembly & C kernel emulator with preset selector, real-time CPU register inspector (`EAX`, `EBX`, `ESP`, `EIP`, `CR0`, `CR3`), 80x25 virtual VGA text mode screen matrix, RAM hex dump, and COM1 serial logs.
- 📂 **Open-Source OS Projects Showcase**: Portfolio of reference operating systems (*ZenithOS*, *RiscCore*, *BootX*, *ByteFS*) with architecture specs, build instructions (`make iso`, `qemu-system-x86_64`), and GitHub links.
- 🔐 **Authentication & Security**: User Registration/Login with bcrypt password hashing, HTTP-only JWT cookies, user role security (`USER` vs `ADMIN`), protected routes, User Dashboard, and Ring 0 Admin Console.
- 🎨 **Dark OS Terminal / Light Theme System**: Dynamic theme toggle with high readability and CRT scanline overlay option.

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/islamawan297-bit/os-from-scratch.git
cd os-from-scratch
npm install
```

### 2. Set Up Database Schema & Seed Data
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Credentials

- **Admin Account**: `admin@kernel.org` / `admin123` (Access Ring 0 Admin Console at `/admin`)
- **Trainee User Account**: `user@kernel.org` / `user123` (User Dashboard at `/dashboard`)

---

## 📄 License
Distributed under the MIT License.
