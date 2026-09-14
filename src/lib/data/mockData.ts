export interface LessonItem {
  id: string;
  slug: string;
  title: string;
  module: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  summary: string;
  content: string;
  codeSnippet: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface RoadmapItem {
  id: string;
  slug: string;
  stepNumber: number;
  title: string;
  level: string;
  category: string;
  overview: string;
  keyConcepts: string[];
  codeExample: string;
  status: "Core" | "Essential" | "Advanced";
  registersAffected: string[];
  memoryRange: string;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  techStack: string[];
  description: string;
  githubUrl: string;
  features: string[];
  architectureSpecs: string;
  setupGuide: string;
}

export interface ArchitectureLayer {
  id: string;
  name: string;
  level: number;
  color: string;
  description: string;
  components: {
    name: string;
    description: string;
    headerFile: string;
    registers: string;
    codeSnippet: string;
  }[];
}

export const ROADMAP_STEPS: RoadmapItem[] = [
  {
    id: "step-1",
    slug: "bootloader-16bit",
    stepNumber: 1,
    title: "Stage 01: 16-Bit Real Mode Bootloader",
    level: "Beginner",
    category: "Boot sequence",
    overview: "Understand BIOS execution flow, MBR partition layout, and x86 16-bit real mode memory segmentation. Write a 512-byte boot sector ending in magic signature 0xAA55.",
    keyConcepts: [
      "BIOS Interrupts (INT 0x10, INT 0x13)",
      "Segment Registers (CS, DS, SS, ES)",
      "Magic Signature (0x55AA)",
      "LBA vs CHS Disk Addressing",
      "Far Jumps & Register Zeroing"
    ],
    codeExample: `; x86 16-bit Bootloader
[org 0x7c00]
mov ah, 0x0e        ; BIOS teletype output
mov al, 'H'
int 0x10
mov al, 'e'
int 0x10
mov al, 'l'
int 0x10
mov al, 'l'
int 0x10
mov al, 'o'
int 0x10

jmp $               ; Infinite loop

times 510-($-$$) db 0
dw 0xaa55           ; Boot sector signature`,
    status: "Core",
    registersAffected: ["AX", "BX", "CS", "DS", "IP", "FLAGS"],
    memoryRange: "0x7C00 - 0x7dfe"
  },
  {
    id: "step-2",
    slug: "gdt-protected-mode",
    stepNumber: 2,
    title: "Stage 02: GDT & 32-Bit Protected Mode",
    level: "Intermediate",
    category: "CPU State",
    overview: "Transition the x86 CPU from 16-bit Real Mode to 32-bit Protected Mode using the Global Descriptor Table (GDT) and setting bit 0 of register CR0.",
    keyConcepts: [
      "Global Descriptor Table (GDT)",
      "Code & Data Segment Selectors",
      "CR0 Control Register (PE Bit)",
      "Flat Memory Model",
      "VGA Text Mode Memory (0xB8000)"
    ],
    codeExample: `; GDT Definition & Protected Mode Switch
gdt_start:
    gdt_null: dd 0x0, 0x0            ; Null descriptor
    gdt_code: dw 0xffff, 0x0, 0x9a00, 0x00cf ; Code segment
    gdt_data: dw 0xffff, 0x0, 0x9200, 0x00cf ; Data segment
gdt_end:

gdt_descriptor:
    dw gdt_end - gdt_start - 1
    dd gdt_start

switch_to_pm:
    cli                             ; Clear interrupts
    lgdt [gdt_descriptor]           ; Load GDT
    mov eax, cr0
    or eax, 0x1                     ; Set CR0 PE bit
    mov cr0, eax
    jmp 0x08:init_pm                ; Far jump to 32-bit code`,
    status: "Core",
    registersAffected: ["CR0", "CS", "DS", "ES", "FS", "GS", "SS", "ESP"],
    memoryRange: "0x00000000 - 0xFFFFFFFF (4GB Flat)"
  },
  {
    id: "step-3",
    slug: "paging-long-mode",
    stepNumber: 3,
    title: "Stage 03: 64-Bit Paging & Long Mode",
    level: "Intermediate",
    category: "Memory Management",
    overview: "Configure 4-level paging (PML4, PDPT, PD, PT), identity map physical memory, enable PAE in CR4, set EFER.LME MSR, and enter 64-bit Long Mode.",
    keyConcepts: [
      "Page Tables (PML4, PDPT, PD, PT)",
      "CR3 Register (Page Directory Base)",
      "PAE (Physical Address Extension)",
      "Model Specific Registers (IA32_EFER)",
      "Virtual to Physical Translation"
    ],
    codeExample: `// C Kernel Paging Initialization
#define PAGE_PRESENT (1 << 0)
#define PAGE_WRITABLE (1 << 1)

uint64_t pml4[512] __attribute__((aligned(4096)));
uint64_t pdpt[512] __attribute__((aligned(4096)));
uint64_t pd[512]   __attribute__((aligned(4096)));

void init_paging(void) {
    pml4[0] = (uint64_t)&pdpt | PAGE_PRESENT | PAGE_WRITABLE;
    pdpt[0] = (uint64_t)&pd   | PAGE_PRESENT | PAGE_WRITABLE;

    // 2MB Huge Pages identity mapping for first 1GB
    for (int i = 0; i < 512; i++) {
        pd[i] = (i * 0x200000) | PAGE_PRESENT | PAGE_WRITABLE | (1 << 7);
    }

    // Load CR3 register with PML4 physical address
    asm volatile("mov %0, %%cr3" : : "r"(pml4));
}`,
    status: "Essential",
    registersAffected: ["CR3", "CR4", "MSR IA32_EFER", "CR0"],
    memoryRange: "Virtual 0x0000000000000000 - 0xFFFFFFFFFFFFFFFF"
  },
  {
    id: "step-4",
    slug: "idt-interrupts",
    stepNumber: 4,
    title: "Stage 04: IDT & Hardware Interrupts (PIC/APIC)",
    level: "Intermediate",
    category: "Core Kernel",
    overview: "Set up the Interrupt Descriptor Table (IDT), remap the 8259 Programmable Interrupt Controller (PIC), write assembly stub ISR handlers, and handle hardware IRQs.",
    keyConcepts: [
      "Interrupt Descriptor Table (IDT)",
      "Interrupt Service Routines (ISRs)",
      "PIC Remapping (IRQ 0-15 -> INT 0x20-0x2F)",
      "CPU Exceptions (Page Fault, Double Fault)",
      "APIC & LAPIC Timers"
    ],
    codeExample: `// IDT Gate Descriptor Structure
struct idt_entry {
    uint16_t base_low;
    uint16_t selector;
    uint8_t  ist;
    uint8_t  attributes;
    uint16_t base_mid;
    uint32_t base_high;
    uint32_t zero;
} __attribute__((packed));

void idt_set_gate(uint8_t num, uint64_t base, uint16_t sel, uint8_t flags) {
    idt[num].base_low  = (base & 0xFFFF);
    idt[num].base_mid  = (base >> 16) & 0xFFFF;
    idt[num].base_high = (base >> 32) & 0xFFFFFFFF;
    idt[num].selector  = sel;
    idt[num].attributes= flags;
}`,
    status: "Core",
    registersAffected: ["IDTR", "RFLAGS (IF bit)", "EIP/RIP"],
    memoryRange: "IDT Table @ 0x00100000"
  },
  {
    id: "step-5",
    slug: "kernel-heap-allocator",
    stepNumber: 5,
    title: "Stage 05: Kernel Heap & Buddy Memory Allocator",
    level: "Advanced",
    category: "Memory Management",
    overview: "Implement physical frame allocation via bitmaps or free lists, and virtual kernel heap allocation with kmalloc/kfree using a Buddy Allocator or Slab Allocator.",
    keyConcepts: [
      "Physical Frame Allocator",
      "Buddy Allocator Algorithm",
      "Slab Allocator for Small Objects",
      "Page Fault Handler (COW)",
      "Memory Fragmentation Prevention"
    ],
    codeExample: `// Tiny Kernel Heap Allocator Header
typedef struct header {
    size_t size;
    unsigned is_free;
    struct header *next;
} header_t;

void *kmalloc(size_t size) {
    // Round size to 8-byte alignment
    size = (size + 7) & ~7;
    header_t *curr = head;
    while (curr) {
        if (curr->is_free && curr->size >= size) {
            curr->is_free = 0;
            return (void*)(curr + 1);
        }
        curr = curr->next;
    }
    return NULL; // Out of heap memory
}`,
    status: "Essential",
    registersAffected: ["RAX", "RDI", "RSI", "RSP"],
    memoryRange: "Kernel Heap @ 0xFFFF800000000000"
  },
  {
    id: "step-6",
    slug: "scheduler-context-switch",
    stepNumber: 6,
    title: "Stage 06: Preemptive Scheduler & Context Switching",
    level: "Advanced",
    category: "Process Management",
    overview: "Create process control blocks (PCB), setup timer interrupts (PIT/APIC), save CPU state on task switch, and execute Round-Robin or Priority Scheduling.",
    keyConcepts: [
      "Process Control Block (PCB)",
      "Stack Frame Preserved Registers",
      "Timer Interrupt (IRQ 0)",
      "Task State Segment (TSS)",
      "User Mode Ring 3 Privilege Switch"
    ],
    codeExample: `; Assembly Context Switch Stub
global switch_to_task
switch_to_task:
    ; Save current task registers
    push rbp
    push rbx
    push r12
    push r13
    push r14
    push r15
    mov [rdi + 0x10], rsp     ; Save current RSP to old PCB

    ; Load new task RSP
    mov rsp, [rsi + 0x10]     ; Load new RSP from new PCB
    pop r15
    pop r14
    pop r13
    pop r12
    pop rbx
    pop rbp
    ret`,
    status: "Advanced",
    registersAffected: ["RSP", "RIP", "RBP", "CR3", "TSS"],
    memoryRange: "Task Stacks @ 0x8000000000"
  },
  {
    id: "step-7",
    slug: "vfs-and-elf-loading",
    stepNumber: 7,
    title: "Stage 07: VFS, Ramdisk & ELF Executable Loader",
    level: "Advanced",
    category: "FileSystem & Syscalls",
    overview: "Build a Virtual File System abstraction tree, mount an initial ramdisk (initrd), parse ELF64 binary headers, allocate user virtual memory, and jump to userland.",
    keyConcepts: [
      "VFS Node Operations (open, read, write)",
      "Tar/Initrd Ramdisk Reader",
      "ELF64 Header Parsing",
      "SYSCALL / SYSRET Assembly Instructions",
      "User Space Shell (ush)"
    ],
    codeExample: `// Simple ELF64 Loader Snippet
int load_elf(const char *path, uint64_t *entry_point) {
    vfs_node_t *file = vfs_open(path, 0);
    Elf64_Ehdr header;
    vfs_read(file, 0, sizeof(Elf64_Ehdr), (uint8_t*)&header);

    if (header.e_ident[0] != 0x7F || header.e_ident[1] != 'E') {
        return -1; // Not valid ELF file
    }

    *entry_point = header.e_entry;
    return 0; // Success
}`,
    status: "Advanced",
    registersAffected: ["RAX", "RCX", "R11", "RSP", "RIP"],
    memoryRange: "User Space @ 0x00000000400000"
  }
];

export const LESSONS_DATA: LessonItem[] = [
  {
    id: "les-1",
    slug: "understanding-x86-booting",
    title: "Understanding x86 Boot sequence & Real Mode",
    module: "Module 1: Bootstrapping & Hardware",
    level: "Beginner",
    duration: "25 min read",
    summary: "Deep dive into what happens when power hits the CPU, BIOS execution, interrupt vector table (IVT), and MBR boot sector mechanics.",
    content: `
### What happens when a PC turns on?

When you press the power button on an x86 computer, the system undergoes a precise series of hardware events before your kernel gets control:

1. **Power-On Self-Test (POST)**: The motherboard chipset initializes hardware, tests RAM, and executes firmware from ROM.
2. **CPU Reset Vector**: The CPU boots up in 16-bit **Real Mode** at physical memory location \`0xFFFFFFF0\` (Reset Vector).
3. **BIOS Loads MBR**: The BIOS scans boot devices (Hard Drive, USB, NVMe) for a 512-byte sector ending in the magic signature \`0x55AA\`.
4. **Execution Transfer**: The BIOS loads these 512 bytes into RAM address \`0x7C00\` and executes a far jump to \`0x0000:0x7C00\`.

### 16-Bit Real Mode Memory Segmentation

In 16-bit Real Mode, the processor can only access 1MB of memory (\`2^20 bytes\`). Addresses are calculated using two 16-bit values: a **Segment Register** and an **Offset**:

\`\`\`
Physical Address = (Segment * 16) + Offset
Physical Address = (CS << 4) + IP
\`\`\`

For example, if \`CS = 0x07C0\` and \`IP = 0x0000\`:
\`\`\`
Address = (0x07C0 * 16) + 0x0000 = 0x7C00
\`\`\`

### Writing Your First Bootloader in NASM Assembly

Here is the complete source code for a 16-bit boot sector that prints "OS KERNEL BOOTING..." using BIOS interrupt \`0x10\`:

\`\`\`nasm
[org 0x7c00]            ; Tell assembler where code is loaded

mov bp, 0x8000          ; Setup stack far away from boot code
mov sp, bp

mov si, MSG_BOOT
call print_string

jmp $                   ; Hang indefinitely

print_string:
    mov ah, 0x0e        ; BIOS tty output function
.loop:
    lodsb               ; Get byte from [SI] into AL and increment SI
    cmp al, 0
    je .done
    int 0x10            ; Call BIOS video service
    jmp .loop
.done:
    ret

MSG_BOOT: db "OS KERNEL BOOTING...", 0x0d, 0x0a, 0

times 510-($-$$) db 0   ; Pad remaining bytes with zeroes
dw 0xaa55               ; Boot sector magic signature
\`\`\`
    `,
    codeSnippet: `[org 0x7c00]
mov si, msg
print:
    lodsb
    or al, al
    jz halt
    mov ah, 0x0e
    int 0x10
    jmp print
halt:
    cli
    hlt
msg: db "BOOTING OK", 0
times 510-($-$$) db 0
dw 0xaa55`,
    quiz: [
      {
        question: "What RAM memory address does BIOS load the MBR boot sector into?",
        options: ["0x1000", "0x7C00", "0x8000", "0x0000"],
        correctIndex: 1,
        explanation: "The IBM PC standard specifies loading the 512-byte boot sector into memory address 0x0000:0x7C00."
      },
      {
        question: "What 2-byte magic signature must end a valid boot sector?",
        options: ["0xDEAD", "0x55AA", "0x8086", "0xFFFF"],
        correctIndex: 1,
        explanation: "BIOS checks bytes 510 and 511 for 0x55 and 0xAA (little endian 0xAA55) to verify the disk is bootable."
      },
      {
        question: "How is physical address calculated in 16-bit Real Mode?",
        options: ["(Segment * 16) + Offset", "(Segment * 4) + Offset", "Segment + Offset", "Segment * Offset"],
        correctIndex: 0,
        explanation: "Real mode uses 20-bit physical addresses calculated by shifting the segment left by 4 bits (multiplying by 16) and adding the offset."
      }
    ]
  },
  {
    id: "les-2",
    slug: "gdt-and-protected-mode-switching",
    title: "Mastering the GDT & Transitioning to 32-Bit Protected Mode",
    module: "Module 2: Memory & CPU States",
    level: "Intermediate",
    duration: "35 min read",
    summary: "Learn how the Global Descriptor Table (GDT) works, segment descriptors, clearing interrupts, setting bit 0 of CR0, and making the far jump into 32-bit flat memory space.",
    content: `
### Why Leave 16-Bit Real Mode?

Real mode has serious limitations for operating system development:
* Access limited to only **1 Megabyte** of RAM.
* **No memory protection**: any program can overwrite BIOS or hardware memory.
* No virtual memory or paging support.

In **32-Bit Protected Mode**, you get:
* Full access to **4 Gigabytes** of linear memory space (\`2^32 bytes\`).
* Hardware ring-based memory protection (Ring 0 Kernel vs Ring 3 User).
* 32-bit registers (\`EAX\`, \`EBX\`, \`ESP\`, \`EIP\`).

### The Global Descriptor Table (GDT)

Instead of segment registers storing raw segment addresses, in Protected Mode segment registers store **Selectors** (indexes into the GDT table).

Each GDT Entry is an 8-byte structure defining:
* **Base Address** (32-bit starting location)
* **Segment Limit** (20-bit size)
* **Access Byte** (Present, Ring Privilege 0-3, Executable, Read/Write)
* **Flags** (Granularity: 1B vs 4KB, 32-bit vs 16-bit mode)

\`\`\`c
struct gdt_entry {
    uint16_t limit_low;
    uint16_t base_low;
    uint8_t  base_middle;
    uint8_t  access;
    uint8_t  granularity;
    uint8_t  base_high;
} __attribute__((packed));
\`\`\`

### Entering Protected Mode Steps

1. Disable interrupts with \`cli\`.
2. Load the GDT pointer into the CPU using \`lgdt [gdt_descriptor]\`.
3. Set Bit 0 of register \`CR0\` (PE - Protection Enable).
4. Perform a **Far Jump** (\`jmp 0x08:target\`) to flush the 16-bit instruction prefetch queue and set the \`CS\` register to the 32-bit code selector.
    `,
    codeSnippet: `mov eax, cr0
or eax, 0x1
mov cr0, eax
jmp 0x08:init_32bit_pm`,
    quiz: [
      {
        question: "Which register's bit 0 must be set to 1 to enable Protected Mode?",
        options: ["CR0", "CR2", "CR3", "EFLAGS"],
        correctIndex: 0,
        explanation: "Bit 0 of CR0 is the Protection Enable (PE) flag. Setting it turns on 32-bit Protected Mode."
      },
      {
        question: "Why is a Far Jump required immediately after enabling CR0 bit 0?",
        options: ["To clear the screen", "To flush the CPU instruction prefetch pipeline & reload CS", "To enable paging", "To reset the RAM"],
        correctIndex: 1,
        explanation: "The CPU decodes instructions in advance. A far jump clears the pre-fetched 16-bit instructions and sets CS to the 32-bit code selector."
      }
    ]
  },
  {
    id: "les-3",
    slug: "building-virtual-memory-paging",
    title: "Virtual Memory, Page Tables & 64-Bit Long Mode",
    module: "Module 3: Virtual Memory Architecture",
    level: "Advanced",
    duration: "45 min read",
    summary: "Architect a 4-level paging hierarchy (PML4 -> PDPT -> PD -> PT), implement identity mapping, PAE, and MSR registers for 64-bit Long Mode.",
    content: `
### The Power of Virtual Memory & Paging

Virtual memory abstracts physical RAM into contiguous 4KB or 2MB pages for processes. It enables:
* Memory isolation between processes.
* Swap file / paging to disk.
* Memory mapped files & Kernel memory protection.

### 4-Level x86-64 Page Translation

In 64-bit Long Mode, virtual addresses (48-bit canonical addresses) are translated to physical addresses using 4 levels of page tables stored in RAM:

\`\`\`
Virtual Address Layout (48 bits used):
[ PML4 Index (9 bits) | PDPT Index (9 bits) | PD Index (9 bits) | PT Index (9 bits) | Offset (12 bits) ]
\`\`\`

1. **CR3 Register**: Contains physical base address of current **PML4** table.
2. **PML4 (Page Map Level 4)**: 512 entries pointing to PDPT entries.
3. **PDPT (Page Directory Pointer Table)**: 512 entries pointing to Page Directories.
4. **PD (Page Directory)**: Points to Page Tables (or 2MB Huge Pages).
5. **PT (Page Table)**: Points to physical 4KB RAM frame.

### Setting up Paging in C

\`\`\`c
#define PAGE_PRESENT  (1 << 0)
#define PAGE_WRITABLE (1 << 1)
#define PAGE_HUGE     (1 << 7)

alignas(4096) uint64_t pml4[512];
alignas(4096) uint64_t pdpt[512];
alignas(4096) uint64_t pd[512];

void setup_paging() {
    // Zero tables
    memset(pml4, 0, 4096);
    memset(pdpt, 0, 4096);
    memset(pd, 0, 4096);

    // Link PML4[0] -> PDPT, PDPT[0] -> PD
    pml4[0] = (uint64_t)pdpt | PAGE_PRESENT | PAGE_WRITABLE;
    pdpt[0] = (uint64_t)pd   | PAGE_PRESENT | PAGE_WRITABLE;

    // Identity map 0x00000000 - 0x40000000 (1GB) using 2MB pages
    for (int i = 0; i < 512; i++) {
        pd[i] = (i * 0x200000) | PAGE_PRESENT | PAGE_WRITABLE | PAGE_HUGE;
    }

    // Set CR3 register
    asm volatile("mov %0, %%cr3" : : "r"(pml4));
}
\`\`\`
    `,
    codeSnippet: `void setup_paging() {
    pml4[0] = (uint64_t)pdpt | 3;
    pdpt[0] = (uint64_t)pd | 3;
    asm volatile("mov %0, %%cr3" : : "r"(pml4));
}`,
    quiz: [
      {
        question: "Which CPU control register stores the physical address of the active PML4 Page Table?",
        options: ["CR0", "CR2", "CR3", "CR4"],
        correctIndex: 2,
        explanation: "CR3 holds the base physical memory address of the top-level Page Map Level 4 (PML4) table."
      },
      {
        question: "What size is a standard small virtual memory page on x86-64?",
        options: ["1 KB", "4 KB", "64 KB", "1 MB"],
        correctIndex: 1,
        explanation: "Standard x86-64 memory pages are 4096 bytes (4 KB)."
      }
    ]
  },
  {
    id: "les-4",
    slug: "writing-interrupt-handlers-idt",
    title: "Handling Hardware Interrupts, Timers & Keyboard IRQs",
    module: "Module 4: Interrupts & Drivers",
    level: "Intermediate",
    duration: "30 min read",
    summary: "Build an IDT, remap 8259 PIC master & slave ports (0x20, 0xA0), capture keyboard scan codes, and manage PIT timer ticks.",
    content: `
### What are Interrupts?

Interrupts are hardware or software signals that suspend normal CPU code execution and jump directly to an **Interrupt Service Routine (ISR)** in the kernel.

* **Exceptions**: Generated by CPU (Divide by Zero #0, Page Fault #14, General Protection Fault #13).
* **IRQs (Hardware Interrupts)**: Generated by devices (Timer IRQ 0, Keyboard IRQ 1, Disk Controller IRQ 14).
* **Software Interrupts**: Generated by code (\`int 0x80\` or \`syscall\` instruction for userland calls).

### Keyboard Handler Example

\`\`\`c
void keyboard_callback(registers_t regs) {
    // Read scan code from PS/2 data port 0x60
    uint8_t scancode = inb(0x60);
    
    if (scancode < 0x80) {
        // Key pressed event
        char key = scancode_to_ascii[scancode];
        vga_putchar(key);
    }

    // Send End of Interrupt (EOI) to PIC
    outb(0x20, 0x20);
}
\`\`\`
    `,
    codeSnippet: `void keyboard_handler() {
    uint8_t code = inb(0x60);
    outb(0x20, 0x20); // EOI
}`,
    quiz: [
      {
        question: "Which I/O port address reads PS/2 keyboard scancodes?",
        options: ["0x20", "0x60", "0x3F8", "0x1F0"],
        correctIndex: 1,
        explanation: "Port 0x60 is the PS/2 keyboard controller data port."
      }
    ]
  }
];

export const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    id: "layer-userland",
    name: "User Space (Ring 3)",
    level: 1,
    color: "#00f2fe",
    description: "Applications, User Shell (ush), Utilities, C Standard Library (musl/glibc port), ELF binaries executed with unprivileged user rights.",
    components: [
      {
        name: "User Shell (`ush`)",
        description: "Command line interpreter accepting user inputs like ls, cat, mem, ps, exec, and clear.",
        headerFile: "user/shell.h",
        registers: "RDI, RSI, RDX (Arguments passed via SYSCALL)",
        codeSnippet: `int main(int argc, char **argv) {
    printf("ush 0.9.4 # ");
    char buf[128];
    read_line(buf, sizeof(buf));
    return execute_cmd(buf);
}`
      },
      {
        name: "Standard Library Subsystem",
        description: "Provides malloc, free, printf, open, write wrappers binding to kernel system calls.",
        headerFile: "libc/stdio.h",
        registers: "RAX (Syscall Number), RDI, RSI",
        codeSnippet: `size_t write(int fd, const void *buf, size_t count) {
    return syscall3(SYS_WRITE, fd, buf, count);
}`
      }
    ]
  },
  {
    id: "layer-syscall",
    name: "System Call Dispatcher (Ring 3 -> Ring 0)",
    level: 2,
    color: "#8b5cf6",
    description: "Boundary layer handling SYSCALL / SYSRET instructions, switching user stack to kernel stack, and parameter verification.",
    components: [
      {
        name: "Syscall Handler Entry",
        description: "Validates system call numbers in RAX and dispatches to kernel subsystem functions.",
        headerFile: "kernel/syscall.h",
        registers: "MSR_LSTAR, MSR_STAR, MSR_SFMASK",
        codeSnippet: `void sys_handler(registers_t *regs) {
    if (regs->rax < MAX_SYSCALLS) {
        syscall_table[regs->rax](regs);
    }
}`
      }
    ]
  },
  {
    id: "layer-kernel",
    name: "Kernel Core (Ring 0 Monolithic / Microkernel)",
    level: 3,
    color: "#10b981",
    description: "Executes in privileged Ring 0 mode with full memory access. Houses Memory Manager, Process Scheduler, VFS, and IPC.",
    components: [
      {
        name: "Virtual Memory Manager (VMM)",
        description: "Manages PML4 page tables, page fault (#PF) exception handler, kmalloc heap, and mmap allocation.",
        headerFile: "kernel/mm/vmm.h",
        registers: "CR2 (Faulting Address), CR3 (PML4 Base)",
        codeSnippet: `void do_page_fault(uint64_t fault_addr) {
    allocate_frame(get_page(fault_addr, 1, current_pml4));
}`
      },
      {
        name: "Preemptive Round-Robin Scheduler",
        description: "Saves & restores context frames during LAPIC timer interrupts, maintaining active runqueues.",
        headerFile: "kernel/sched/sched.h",
        registers: "RSP, RIP, RBP, RFLAGS, CR3",
        codeSnippet: `void schedule() {
    process_t *next = pick_next_task();
    switch_task_context(current_task, next);
}`
      },
      {
        name: "Virtual File System (VFS)",
        description: "Tree abstraction for mounting Ext2, Tar, and DevFS nodes with uniform open/read/write interfaces.",
        headerFile: "kernel/fs/vfs.h",
        registers: "N/A (Kernel C Structures)",
        codeSnippet: `vfs_node_t *vfs_open(const char *path, uint32_t flags) {
    return root_vfs->finddir(root_vfs, path);
}`
      }
    ]
  },
  {
    id: "layer-hal",
    name: "Hardware Abstraction Layer & Drivers (HAL)",
    level: 4,
    color: "#f59e0b",
    description: "Translates high level kernel IO requests into hardware register reads and writes over I/O ports or MMIO.",
    components: [
      {
        name: "8259 PIC / APIC Interrupt Controller",
        description: "Manages hardware interrupt lines, IRQ masking, and Local APIC timer frequency calibration.",
        headerFile: "drivers/apic.h",
        registers: "I/O Ports 0x20, 0x21, 0xA0, 0xA1, APIC MMIO",
        codeSnippet: `void pic_remap(int offset1, int offset2) {
    outb(0x20, 0x11);
    outb(0xA0, 0x11);
    outb(0x21, offset1);
    outb(0xA1, offset2);
}`
      },
      {
        name: "VGA Text Mode & Framebuffer Driver",
        description: "Renders colored 80x25 characters directly to memory address 0xB8000 or UEFI linear RGB framebuffer.",
        headerFile: "drivers/vga.h",
        registers: "Memory 0xB8000, CRT Controller Ports 0x3D4/0x3D5",
        codeSnippet: `void vga_write_char(char c, uint8_t color, int x, int y) {
    volatile uint16_t *video = (uint16_t*)0xB8000;
    video[y * 80 + x] = (color << 8) | c;
}`
      }
    ]
  },
  {
    id: "layer-hardware",
    name: "Bare Metal CPU & Hardware Platform",
    level: 5,
    color: "#f43f5e",
    description: "Physical CPU silicon (x86-64 / RISC-V / ARM64), RAM chips, MMU, PS/2 Keyboard Controller, Serial COM1 port, Storage controllers.",
    components: [
      {
        name: "CPU MMU & Registers",
        description: "Hardware execution engine with General Purpose Registers, Control Registers (CR0-CR4), and MMU translation caches.",
        headerFile: "arch/x86_64/cpu.h",
        registers: "RAX, RBX, RCX, RDX, CR0, CR2, CR3, CR4",
        codeSnippet: `static inline uint64_t read_cr2() {
    uint64_t val;
    asm volatile("mov %%cr2, %0" : "=r"(val));
    return val;
}`
      }
    ]
  }
];

export const OS_PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    slug: "zenith-os",
    title: "ZenithOS: 64-Bit Monolithic x86-64 Kernel",
    difficulty: "Advanced",
    techStack: ["C", "x86-64 Assembly", "Make", "QEMU", "Linker Script"],
    description: "A complete 64-bit multi-tasking monolithic operating system built from scratch with 4-level paging, VFS ramdisk, userland ELF shell, and sound driver.",
    githubUrl: "https://github.com/os-from-scratch/zenith-os",
    features: [
      "Pure 64-bit Long Mode execution",
      "Multiboot2 compliant boot sequence",
      "Buddy Allocator & Slab Heap Allocator",
      "Interactive C Userland Shell (ush)",
      "VGA & Serial COM1 logging driver"
    ],
    architectureSpecs: "Monolithic kernel design compiled with x86_64-elf-gcc, linked with custom linker script entry at 0x100000. Uses PAE and 2MB pages.",
    setupGuide: `# Clone repository
git clone https://github.com/os-from-scratch/zenith-os.git
cd zenith-os

# Build kernel ISO
make iso

# Launch in QEMU Emulator
make run-qemu`
  },
  {
    id: "proj-2",
    slug: "risc-core",
    title: "RiscCore: RISC-V RV32I Microkernel",
    difficulty: "Intermediate",
    techStack: ["Rust", "RISC-V Assembly", "Cargo", "QEMU-system-riscv32"],
    description: "A lightweight type-safe RISC-V 32-bit Microkernel demonstrating hardware interrupts, UART serial output, and lock-free thread queues.",
    githubUrl: "https://github.com/os-from-scratch/risc-core",
    features: [
      "100% Memory Safe Rust core kernel",
      "RISC-V Machine (M-Mode) & Supervisor (S-Mode)",
      "UART 16550 Serial console output",
      "Lock-free cooperative task scheduler"
    ],
    architectureSpecs: "Microkernel architecture targeting QEMU virt machine (rv32ima). Uses Rust no_std environment.",
    setupGuide: `# Install RISC-V target
rustup target add riscv32imac-unknown-none-elf

# Build & Run in QEMU
cargo run --target riscv32imac-unknown-none-elf`
  },
  {
    id: "proj-3",
    slug: "boot-x",
    title: "BootX: Multi-Stage Modular Bootloader",
    difficulty: "Intermediate",
    techStack: ["C", "NASM", "x86 Assembly"],
    description: "A custom 2-stage bootloader supporting A20 line enabling, GDT initialization, ELF64 parsing, and Multiboot header verification.",
    githubUrl: "https://github.com/os-from-scratch/boot-x",
    features: [
      "512-byte Stage 1 MBR Boot sector",
      "Stage 2 FAT12/RAW sector kernel loader",
      "Automatic A20 Line enabling via Keyboard Controller & System Port 0x92",
      "E820 BIOS RAM Map detection"
    ],
    architectureSpecs: "Two-stage bootloader written in 16-bit NASM assembly and 32-bit C. Prepares machine state for 64-bit kernel payloads.",
    setupGuide: `nasm -f bin stage1.asm -o boot.bin
gcc -m32 -ffreestanding -c stage2.c -o stage2.o
ld -m elf_i386 -Ttext 0x8000 stage2.o -o stage2.bin
cat boot.bin stage2.bin > disk.img`
  },
  {
    id: "proj-4",
    slug: "byte-fs",
    title: "ByteFS: Custom Inode Virtual File System",
    difficulty: "Advanced",
    techStack: ["C", "GCC"],
    description: "An inode-based file system driver written from scratch featuring directory structures, bitmap blocks, and file descriptor management.",
    githubUrl: "https://github.com/os-from-scratch/byte-fs",
    features: [
      "Superblock & Inode allocation bitmaps",
      "Direct & Indirect block pointer tables",
      "RAM Disk & ATA Hard Drive storage backend",
      "POSIX-like open/read/write/close API"
    ],
    architectureSpecs: "Modular VFS driver integrated into custom operating systems or testable in standalone FUSE userland environments.",
    setupGuide: `gcc -Wall -Wextra bytefs.c test_main.c -o bytefs_test
./bytefs_test create_disk 10MB`
  }
];

export const PLAYGROUND_PRESETS = [
  {
    id: "boot-msg",
    name: "16-Bit MBR Hello World (ASM)",
    language: "assembly",
    code: `; x86 16-Bit MBR Boot Sector Example
[org 0x7c00]

mov si, msg_hello

print_loop:
    lodsb
    or al, al
    jz boot_done
    mov ah, 0x0e
    int 0x10
    jmp print_loop

boot_done:
    mov si, msg_success
    call print_string
    cli
    hlt

print_string:
    lodsb
    or al, al
    jz .done
    mov ah, 0x0e
    int 0x10
    jmp print_string
.done:
    ret

msg_hello: db "=== OS KERNEL V0.9 BOOTING ===", 0x0d, 0x0a, 0
msg_success: db "[SYS_OK] Real Mode initialized at 0x7C00", 0x0d, 0x0a, 0

times 510-($-$$) db 0
dw 0xaa55`,
    simulatedOutput: {
      registers: {
        EAX: "0x0E00",
        EBX: "0x0000",
        ECX: "0x0000",
        EDX: "0x0000",
        ESP: "0x7C00",
        EBP: "0x8000",
        EIP: "0x7C24",
        CR0: "0x00000010 (Real Mode)",
        CR3: "0x00000000 (No Paging)"
      },
      vgaText: [
        "=== OS KERNEL V0.9 BOOTING ===",
        "[SYS_OK] Real Mode initialized at 0x7C00",
        "",
        "_ System halted (HLT instruction executed)."
      ],
      memoryHex: [
        { addr: "0x00007C00", bytes: "BE 1D 7C AC 08 C0 74 09 B4 0E INT 10 EB F5 AC 08 C0" },
        { addr: "0x00007C10", bytes: "74 04 B4 0E INT 10 EB F7 C3 3D 3D 3D 20 4F 53 20 4B" },
        { addr: "0x00007DF0", bytes: "00 00 00 00 00 00 00 00 00 00 00 00 00 00 55 AA" }
      ],
      logs: [
        "[CPU] Reset Vector execution -> Jumped to 0x7C00",
        "[BIOS] MBR Magic 0xAA55 verified at offset 510",
        "[TTY] Video Interrupt 0x10 fired 72 times",
        "[CPU] Execution Halted (HLT flag set)"
      ]
    }
  },
  {
    id: "gdt-pm",
    name: "32-Bit GDT Protected Mode Switch (ASM)",
    language: "assembly",
    code: `; Switch to 32-Bit Protected Mode
cli
lgdt [gdt_descriptor]

mov eax, cr0
or eax, 0x1        ; Set PE bit in CR0
mov cr0, eax

jmp 0x08:init_32bit ; Far jump to 32-bit segment

[bits 32]
init_32bit:
    mov ax, 0x10   ; 0x10 is GDT Data Segment Selector
    mov ds, ax
    mov ss, ax
    mov es, ax
    mov esp, 0x90000

    ; Write 'P' directly to VGA video memory 0xB8000
    mov byte [0xb8000], 'P'
    mov byte [0xb8001], 0x2f ; Green on dark green
    hlt`,
    simulatedOutput: {
      registers: {
        EAX: "0x00000010",
        EBX: "0x00000000",
        ECX: "0x00000000",
        EDX: "0x00000000",
        ESP: "0x00090000",
        EBP: "0x00000000",
        EIP: "0x00007C48",
        CR0: "0x00000011 (Protected Mode ON)",
        CR3: "0x00000000"
      },
      vgaText: [
        "P",
        "",
        "[PROTECTED MODE 32-BIT FLAT MEMORY ACTIVE]"
      ],
      memoryHex: [
        { addr: "0x000B8000", bytes: "50 2F 20 07 20 07 20 07 20 07 20 07 20 07 20 07" },
        { addr: "0x00090000", bytes: "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00" }
      ],
      logs: [
        "[CPU] Interrupts disabled (CLI)",
        "[GDT] Global Descriptor Table loaded base=0x7C50 limit=23",
        "[CR0] Control Register 0 updated: PE bit 0 = 1",
        "[CPU] Pipeline flushed via far jump selector 0x08",
        "[VGA] Direct VRAM write at 0xB8000 -> Char 'P'"
      ]
    }
  },
  {
    id: "c-heap-alloc",
    name: "C Kernel Buddy Heap Allocator (C)",
    language: "c",
    code: `// C Kernel Memory Allocation Test
#include <stdint.h>
#include <stddef.h>

#define HEAP_START 0x100000
#define HEAP_SIZE  0x10000

typedef struct block_header {
    size_t size;
    uint8_t free;
    struct block_header *next;
} block_header_t;

static block_header_t *heap_head = (block_header_t*)HEAP_START;

void init_kernel_heap() {
    heap_head->size = HEAP_SIZE - sizeof(block_header_t);
    heap_head->free = 1;
    heap_head->next = NULL;
}

void* kmalloc(size_t size) {
    block_header_t *curr = heap_head;
    while (curr) {
        if (curr->free && curr->size >= size) {
            curr->free = 0;
            return (void*)(curr + 1);
        }
        curr = curr->next;
    }
    return NULL;
}

void kernel_main() {
    init_kernel_heap();
    char *str = (char*)kmalloc(64);
    uint32_t *page_table = (uint32_t*)kmalloc(4096);
}`,
    simulatedOutput: {
      registers: {
        EAX: "0x00100018 (Allocated Ptr)",
        EBX: "0x00000040",
        ECX: "0x00001000",
        EDX: "0x00100000",
        ESP: "0x001FFFF0",
        EBP: "0x001FFFF8",
        EIP: "0x00100092",
        CR0: "0x80000001 (Paging + PM)",
        CR3: "0x00200000 (Page Table)"
      },
      vgaText: [
        "[KMALLOC] Heap Header initialized at 0x100000",
        "[KMALLOC] Chunk #1 allocated 64 bytes @ 0x100018",
        "[KMALLOC] Chunk #2 allocated 4096 bytes @ 0x100068",
        "[STATUS] Total Free Heap RAM: 61368 Bytes"
      ],
      memoryHex: [
        { addr: "0x00100000", bytes: "00 00 01 00 00 00 00 00 00 00 00 00 00 00 00 00" },
        { addr: "0x00100018", bytes: "4F 53 5F 4B 45 52 4E 45 4C 5F 48 45 41 50 5F 4F" }
      ],
      logs: [
        "[MMU] Kernel Heap Base set to 0x100000",
        "[HEAP] Initialized 65536 bytes pool",
        "[KMALLOC] Block 1 requested 64B -> Returned 0x100018",
        "[KMALLOC] Block 2 requested 4096B -> Returned 0x100068"
      ]
    }
  }
];

export const FAQS = [
  {
    q: "Do I need prior C or Assembly experience to build an OS from scratch?",
    a: "Basic C understanding and familiarity with pointers is helpful. We guide you step-by-step through x86 assembly, registers, stack frames, and hardware concepts right from lesson 1!"
  },
  {
    q: "Will I need to install a physical bare-metal computer to test my OS?",
    a: "No! We use QEMU (Quick Emulator) and Bochs to run and debug your custom kernel safely inside a virtual machine on Windows, macOS, or Linux."
  },
  {
    q: "What cross-compiler toolchain do I need?",
    a: "You'll use x86_64-elf-gcc and x86_64-elf-ld. We provide precompiled binaries and a 1-line Docker container set up to build your code seamlessly."
  },
  {
    q: "Is this platform free for self-study?",
    a: "Yes! All lessons, code playgrounds, architecture visualizers, and sample project repositories are 100% open access for aspiring systems engineers."
  }
];
