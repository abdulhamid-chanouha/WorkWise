const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.sprint.deleteMany();
  await prisma.document.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash('Password123', 10);

  const Abed = await prisma.user.create({
    data: {
      name: 'Abed Al-Hamid',
      email: 'abed@team1.com',
      password: hashedPassword,
    }
  });

  const yehia = await prisma.user.create({
    data: {
      name: 'Yehia Fayyad',
      email: 'yehia@team1.com',
      password: hashedPassword,
    }
  });

  const taimour = await prisma.user.create({
    data: {
      name: 'Taimour Shmait',
      email: 'taimour@team1.com',
      password: hashedPassword,
    }
  });

  const hadi = await prisma.user.create({
    data: {
      name: 'Hadi Wehbe',
      email: 'hadi@team1.com',
      password: hashedPassword,
    }

  });

  // Create project
  const project = await prisma.project.create({
    data: {
      name: 'AI Project Management Hub',
      description: 'WorkWise— Aspire GDC Team 1',
      key: 'AIWW',
    }
  });

  // Add members to project
  await prisma.projectMember.createMany({
    data: [
      { userId: Abed.id, projectId: project.id, role: 'ADMIN' },
      { userId: yehia.id, projectId: project.id, role: 'DEVELOPER' },
      { userId: taimour.id, projectId: project.id, role: 'DEVELOPER' },
      { userId: hadi.id, projectId: project.id, role: 'DEVELOPER' },
    ]
  });

  // Create sprint
  const sprint = await prisma.sprint.create({
    data: {
      name: 'Sprint 1',
      goal: 'Foundation — auth, kanban, core backend',
      startDate: new Date('2025-06-09'),
      endDate: new Date('2025-06-20'),
      isActive: true,
      projectId: project.id,
    }
  });

  // Create tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Set up authentication system',
        description: 'JWT-based register, login, logout, token refresh',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        projectId: project.id,
        sprintId: sprint.id,
        assigneeId: yehia.id,
        creatorId: yehia.id,
      },
      {
        title: 'Build Kanban board UI',
        description: 'Drag and drop board with columns',
        status: 'TODO',
        priority: 'HIGH',
        projectId: project.id,
        sprintId: sprint.id,
        assigneeId: taimour.id,
        creatorId: yehia.id,
      },
      {
        title: 'Design database schema',
        description: 'Prisma schema with all models',
        status: 'DONE',
        priority: 'URGENT',
        projectId: project.id,
        sprintId: sprint.id,
        assigneeId: yehia.id,
        creatorId: yehia.id,
      },
      {
        title: 'Set up AI task breakdown feature',
        description: 'Gemini integration for splitting features into subtasks',
        status: 'BACKLOG',
        priority: 'MEDIUM',
        projectId: project.id,
        assigneeId: hadi.id,
        creatorId: yehia.id,
      },
      {
        title: 'Build sprint dashboard',
        description: 'Velocity charts, burndown, completion metrics',
        status: 'BACKLOG',
        priority: 'MEDIUM',
        projectId: project.id,
        assigneeId: taimour.id,
        creatorId: yehia.id,
      },
    ]
  });

  // Create a document
  await prisma.document.create({
    data: {
      title: 'Project Architecture',
      content: '# Architecture\n\nReact + Vite frontend, Node.js + Express backend, PostgreSQL on Supabase, Gemini AI.',
      projectId: project.id,
      authorId: yehia.id,
    }
  });

  console.log('✅ Database seeded successfully');
  console.log(`   Users: ${yehia.name}, ${taimour.name}, ${hadi.name}`);
  console.log(`   Project: ${project.name}`);
  console.log(`   Sprint: ${sprint.name}`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });