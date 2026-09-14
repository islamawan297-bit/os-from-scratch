import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { LESSONS_DATA, OS_PROJECTS, PLAYGROUND_PRESETS } from "../src/lib/data/mockData";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting OS platform database seed...");

  // 1. Password Hashes
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  // 2. Create Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@kernel.org" },
    update: {},
    create: {
      name: "Kernel Administrator",
      email: "admin@kernel.org",
      password: adminPassword,
      role: "ADMIN",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });
  console.log("Seeded Admin User:", adminUser.email);

  // 3. Create Demo User
  const demoUser = await prisma.user.upsert({
    where: { email: "user@kernel.org" },
    update: {},
    create: {
      name: "Systems Engineer Trainee",
      email: "user@kernel.org",
      password: userPassword,
      role: "USER",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
  });
  console.log("Seeded Demo User:", demoUser.email);

  // 4. Seed Topics
  const topicBoot = await prisma.topic.upsert({
    where: { slug: "boot-and-hardware" },
    update: {},
    create: {
      slug: "boot-and-hardware",
      name: "Bootstrapping & Hardware",
      description: "BIOS vectors, MBR partition layout, 16-bit real mode memory segmentation.",
      order: 1,
    },
  });

  const topicMemory = await prisma.topic.upsert({
    where: { slug: "memory-and-paging" },
    update: {},
    create: {
      slug: "memory-and-paging",
      name: "Virtual Memory & Paging",
      description: "GDT descriptors, CR0/CR3 registers, 4-level PML4 paging, physical frame allocators.",
      order: 2,
    },
  });

  // 5. Seed Lessons
  for (let i = 0; i < LESSONS_DATA.length; i++) {
    const l = LESSONS_DATA[i];
    await prisma.lesson.upsert({
      where: { slug: l.slug },
      update: {
        title: l.title,
        summary: l.summary,
        content: l.content,
        codeSnippet: l.codeSnippet,
      },
      create: {
        slug: l.slug,
        title: l.title,
        module: l.module,
        level: l.level,
        duration: l.duration,
        summary: l.summary,
        content: l.content,
        codeSnippet: l.codeSnippet,
        sequence: i + 1,
        topicId: i % 2 === 0 ? topicBoot.id : topicMemory.id,
      },
    });
  }
  console.log("Seeded Lessons:", LESSONS_DATA.length);

  // 6. Seed Projects
  for (const p of OS_PROJECTS) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        description: p.description,
        setupGuide: p.setupGuide,
      },
      create: {
        slug: p.slug,
        title: p.title,
        difficulty: p.difficulty,
        techStack: p.techStack.join(", "),
        description: p.description,
        githubUrl: p.githubUrl,
        architectureSpecs: p.architectureSpecs,
        setupGuide: p.setupGuide,
      },
    });
  }
  console.log("Seeded Projects:", OS_PROJECTS.length);

  // 7. Seed Code Examples
  for (const preset of PLAYGROUND_PRESETS) {
    await prisma.codeExample.upsert({
      where: { presetId: preset.id },
      update: {
        code: preset.code,
      },
      create: {
        presetId: preset.id,
        title: preset.name,
        language: preset.language,
        code: preset.code,
        registers: JSON.stringify(preset.simulatedOutput.registers),
        memoryHex: JSON.stringify(preset.simulatedOutput.memoryHex),
        vgaText: JSON.stringify(preset.simulatedOutput.vgaText),
        logs: JSON.stringify(preset.simulatedOutput.logs),
      },
    });
  }
  console.log("Seeded Code Examples:", PLAYGROUND_PRESETS.length);

  // 8. Seed User Progress & Saved Projects for Demo User
  const firstLesson = await prisma.lesson.findFirst();
  if (firstLesson) {
    await prisma.userProgress.upsert({
      where: {
        userId_lessonId: {
          userId: demoUser.id,
          lessonId: firstLesson.id,
        },
      },
      update: {},
      create: {
        userId: demoUser.id,
        lessonId: firstLesson.id,
        isCompleted: true,
      },
    });
  }

  console.log("OS Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
