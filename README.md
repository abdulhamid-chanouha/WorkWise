# Workwise

An AI-powered project management platform built for small development teams. Workwise replaces the fragmented workflow of juggling multiple tools by combining task tracking, sprint planning, kanban boards, and documentation in one place — with AI deeply integrated into the core workflow.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) + TailwindCSS |
| Backend | Node.js / Express |
| Database | PostgreSQL on Supabase |
| ORM | Prisma |
| AI | Google Gemini API |
| Real-Time | Socket.io |
| Auth | JWT |
| Hosting | Vercel (frontend) + Render (backend) |

## Project Structure

```
workwise/
├── client/          # React frontend
├── server/          # Node.js/Express backend
├── .gitignore
└── README.md
```

## Team

| Name | Role |
|------|------|
| Taimour Shmait | Developer |
| Yehia Fayyad | Developer |
| Hadi Wehbe | Developer |

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Git
- VS Code (recommended)
- PostgreSQL client (for connecting to Supabase)

### Setup

1. Clone the repo:
   ```bash
   git clone <repo-url>
   cd workwise
   ```

2. Switch to the `develop` branch:
   ```bash
   git checkout develop
   ```

3. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```

4. Install backend dependencies:
   ```bash
   cd ../server
   npm install
   ```

5. Set up environment variables:
   - Copy `.env.example` to `.env` in the `server/` directory
   - Fill in your Supabase database URL, JWT secret, and Gemini API key

6. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

7. Start the development servers:
   ```bash
   # Terminal 1 — backend
   cd server
   npm run dev

   # Terminal 2 — frontend
   cd client
   npm run dev
   ```

## Git Workflow

This project uses a **two-branch model** with `main` and `develop`.

### Branches

- **`main`** — Production-ready code. Only updated at the end of a sprint before deployment. Never push directly to main.
- **`develop`** — Active development branch. All feature work merges here first.

### How to Work on a Task

1. **Pull the latest from develop:**
   ```bash
   git checkout develop
   git pull origin develop
   ```

2. **Create a feature branch from develop:**
   ```bash
   git checkout -b feature/SCRUM-XX-short-description
   ```
   Use the Jira ticket number in the branch name (e.g., `feature/SCRUM-42-login-page`).

3. **Work on your task.** Commit often with clear messages:
   ```bash
   git add .
   git commit -m "SCRUM-42: Add login form with validation"
   ```

4. **Push your branch:**
   ```bash
   git push origin feature/SCRUM-XX-short-description
   ```

5. **Open a Pull Request (PR) into `develop`:**
   - Go to GitHub and create a PR from your branch into `develop`
   - Add a clear title and description of what you did
   - Request a review from at least one teammate
   - Link the Jira ticket in the PR description

6. **After review and approval**, merge the PR into `develop`.

7. **Delete your feature branch** after merging (GitHub can do this automatically).

### Rules

- Never push directly to `main` or `develop` — always use pull requests
- Keep your feature branches small and focused on one task
- Pull from `develop` frequently to avoid merge conflicts
- Write meaningful commit messages that reference the Jira ticket
- Review your teammates' PRs — everyone reviews, everyone learns

## Key Features

- User authentication with role-based access (Admin, Developer, Viewer)
- Project and workspace management with team invitations
- Kanban board with drag-and-drop task management
- Sprint management with backlog grooming and planning
- Real-time updates across the board via WebSockets
- Integrated documentation wiki with rich text editing
- AI Task Breakdown: paste a feature, AI splits it into subtasks
- AI Sprint Planner: suggests optimal sprint scope
- AI Daily Digest: auto-generated summary of progress and blockers
- AI Retrospective Assistant: generates structured retro reports
- Analytics dashboard with burndown charts and velocity tracking
