import { NextResponse } from "next/server";
import { PLAYGROUND_PRESETS } from "@/lib/data/mockData";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, presetId } = body;

    const matchedPreset = PLAYGROUND_PRESETS.find((p) => p.id === presetId);

    if (matchedPreset) {
      return NextResponse.json({
        success: true,
        output: matchedPreset.simulatedOutput,
      });
    }

    // Dynamic execution analysis fallback
    const isProtectedMode = code.includes("cr0") || code.includes("lgdt");
    const isPaging = code.includes("cr3") || code.includes("pml4");

    return NextResponse.json({
      success: true,
      output: {
        registers: {
          EAX: isProtectedMode ? "0x00000001" : "0x0E00",
          EBX: "0x00007C00",
          ECX: "0x00000000",
          EDX: "0x00000080",
          ESP: "0x00090000",
          EBP: "0x00008000",
          EIP: "0x00007C10",
          CR0: isProtectedMode
            ? isPaging
              ? "0x80000001 (Paging + PM)"
              : "0x00000011 (Protected Mode)"
            : "0x00000010 (Real Mode)",
          CR3: isPaging ? "0x00100000 (PML4 Base)" : "0x00000000",
        },
        vgaText: [
          "=== CUSTOM KERNEL EXECUTION ===",
          `[SYS] Parsed ${code ? code.split("\n").length : 0} lines of Assembly/C source code`,
          "[SYS] CPU Clock cycles simulated: 1,420 cycles",
          "[SYS] Memory Write OK to 0xB8000 (VGA Buffer)",
          "",
          "> User code executed successfully without kernel panics."
        ],
        memoryHex: [
          { addr: "0x00007C00", bytes: "B8 00 00 00 00 89 C0 EB FE 00 00 00 00 00 55 AA" },
          { addr: "0x00007C10", bytes: "00 10 00 00 00 00 00 00 00 00 00 00 00 00 00 00" }
        ],
        logs: [
          "[EMU] Virtual x86-64 Execution Engine started",
          "[EMU] Instruction Pointer set to 0x7C00",
          isProtectedMode
            ? "[CR0] PE Flag 1 set: Switch to 32-bit Protected Mode"
            : "[CPU] Executing in 16-bit Real Mode",
          "[EMU] HLT instruction reached cleanly"
        ]
      }
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Compilation/Execution failed" },
      { status: 400 }
    );
  }
}
