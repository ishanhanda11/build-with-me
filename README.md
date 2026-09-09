# AI Build With Me

AI Build With Me is an adaptive coding-learning platform designed to help developers learn by **building real projects instead of copying AI-generated code**.

The platform acts as a coding mentor. It generates projects based on a learner's goals, skills, interests, and experience, then breaks those projects into progressively challenging tasks.

When a learner gets stuck, the platform provides assistance progressively:

**Hint → Stronger Hint → Pseudocode → Solution**

Instead of immediately giving the answer, the system uses the learner's behavior—attempts, mistakes, hints, time spent, and performance—to understand where they are struggling and adapt future challenges accordingly.

## Core Idea

> AI shouldn't write your code. AI should make you capable of writing it.

## Planned Learning Flow

```text
Learner Goal
    ↓
Onboarding
    ↓
Learner Profile
    ↓
Project Generation
    ↓
Challenge Generation
    ↓
Learner Attempts
    ↓
AI Evaluation
    ↓
Learning Signals
    ↓
Learner Profile Updated
    ↓
Adaptive Next Challenge
```

## Planned Technology

### Frontend

* React

### Backend

* Node.js
* Express

### Database

* PostgreSQL
* Prisma ORM

### AI

* Gemini API

### Deployment

* Vercel
* Render

## Project Goals

This project is being built to:

* Learn through implementation rather than copying solutions
* Build a real-world full-stack application
* Explore adaptive learning systems
* Integrate an LLM into a structured backend application
* Practice Node.js, Express, React, PostgreSQL and Prisma
* Develop strong software architecture and debugging skills
* Create a serious portfolio project
* Eventually explore turning the project into a commercial SaaS

## Current Status

✅ **Full-Stack Application & End-to-End AI Mentorship Platform is fully functional with a dedicated Dark Nordic & Frontier design system!**

The system architecture includes:

### Frontend (React + Vite + Vanilla CSS)
* **Design Token System**: Custom dark stone palette (`#111312`), hairline borders (`#34352F`), restrained crimson accents (`#A43B2E`), muted gold (`#B59A62`), and bespoke typography (`Cinzel`, `Cormorant Garamond`, `Inter`, `JetBrains Mono`).
* **Expedition Dashboard (`Dashboard.jsx`)**:
  * Top navigation with live brand emblem, active routing indicators, and interactive user profile menu with hover grace period, profile navigation, and logout.
  * Hero greeting banner with personalized user name, mountain ridge landscape SVG, and discipline motto.
  * Full-width vertically stacked layout: *Your Journey* on top (live metrics for projects, challenges, completions, and real-time help requests) and *Continue Building* below, stretching seamlessly from left to right.
  * *Continue Building* strictly filters and displays active in-progress projects with dynamic progress bars and completion counts, hiding completed or abandoned builds.
  * Streamlined sidebar navigation focused on active developer tools: **Overview**, **Projects**, and **Challenges**, with the inspirational quote pinned cleanly at the bottom.
* **Dedicated Challenges Hub (`Challenges.jsx`)**:
  * Dedicated problem-solving arena accessible via `/challenges`.
  * **Next Active Challenge Hero**: Prominently highlights the user's next unsolved milestone with difficulty indicator, parent project context, and a direct "Solve Challenge →" button jumping straight into the Monaco editor.
  * **Multi-Dimensional Filtering**: Real-time filtering by status (*All*, *In Progress*, *Completed*), difficulty (*Easy*, *Medium*, *Hard*), parent project dropdown, and keyword search across titles and descriptions.
  * Unified challenge stream with direct solver and solution review links.
* **Platform About Page (`About.jsx`)**:
  * Dedicated, immersive overview page accessible via top navigation (`/about`).
  * Explains what Build With Me is, what it does, how it works through a 5-stage step-by-step loop, and technical feature deep dives.
* **Learner Profile Dossier (`Profile.jsx`)**:
  * Warning alert banner displayed when profile is missing, explaining that parameters are required before project generation.
  * Left identity card: Capitalized initial avatar, experience level badge, XP progression track (`0 / 700 XP`), earned emblems (`First Step`, `Streak 7`, `Pioneer`, `Builder`), and motto.
  * Right learning dossier form: Goal textarea, target completion date with calendar picker integration (duplicate browser icons suppressed), available hours per day, experience level, difficulty, assistance preference, and learning style.
  * Seamless view vs. edit mode toggling with instant validation.
* **Projects Explorer (`Projects.jsx`) & Roadmap (`Project.jsx`)**:
  * Category filter tabs (`All Projects`, `In Progress`, `Completed`, `Abandoned`) with real-time counts.
  * **Project Abandonment Workflow**: Safe in-card abandon button with a themed confirmation dialog to archive stalled projects without accidental navigation.
  * Live search input filtering projects dynamically by title or description.
  * Direct challenge navigation: Clicking a challenge navigates straight to the active Monaco workspace (`/solve`), eliminating intermediate preview screens.
* **Interactive Coding Workspace (`SolveChallenge.jsx`)**:
  * Multi-language Monaco Code Editor (`@monaco-editor/react`) supporting **JavaScript**, **Python**, and **Java** with dynamic syntax and tokenization.
  * Dedicated non-wrapping subbar architecture displaying challenge title, milestone badge, difficulty pill, and status, with learning objectives row directly underneath.
  * Progressive AI Help Drawer: Instant triggers for Non-spoiler Hints, Structural Pseudocode, and Solution Unlocks.
  * Live Interaction & Feedback Stream: Real-time rendering of all previous AI hints, submissions, and Gemini evaluation cards.
* **Themed Loading States (`LoadingAnimation.jsx`, `loadingAnimation2.jsx`, `ProfileGuard.jsx`)**:
  * Unified stone background token (`var(--bg-primary, #111312)`), bespoke typography, and warm parchment/crimson spinners across route transitions.
* **Mobile-First Responsiveness & Cross-Device Navigation**:
  * Complete media query system across all 8 pages for tablet (`768px`), mobile (`640px`), and small phone (`480px`) breakpoints.
  * Ergonomic two-row mobile navigation bar preserving top-level routing (`Home | Projects | Challenges | About`) without hiding navigation links.
  * Mobile-adapted layouts: 2x2 Journey stats cards, stacked Monaco coding workspace with vertical AI Mentorship drawer, horizontally scrollable filter tabs, single-column responsive grids, and 16px form inputs preventing iOS Safari auto-zoom.

### Backend (Node.js + Express + Prisma + Gemini)
* **Clean 4-Tier Architecture**: Modular separation of concerns across Route, Controller, Service, and Repository layers (including dedicated `/auth/me` user retrieval decoupled from route-level Prisma execution).
* **Authentication & Rate Limiting Defense**: Secure cookie-based JWT sessions with refresh token rotation, token revocation, and `express-rate-limit` guards on `/register` (anti-bot mass creation), `/login` (brute-force defense with `skipSuccessfulRequests: true`), and `/refresh` (replay attack mitigation).
* **Hardened Request Validation**: Zod schema validation with trimmed inputs and custom, user-friendly error messages across registration and authentication endpoints.
* **Learner Profile Management**: Profile CRUD with learning style, target timeframe, experience preferences, and real user name resolution.
* **AI Project Generation & Scope Control**: Dynamic curriculum generation using Google Gemini with dynamic `maxChallenges` bounds (8–20) tailored to learner capacity.
* **Project & Challenge CRUD**: Full lifecycle management with strict sequential progression prerequisites.
* **Real-Time Struggle & Help Telemetry**: `GET /api/help/count` aggregating `ChallengeHelp` records (`HINT`, `PSEUDOCODE`, `SOLUTION`) and `ChallengeAttempt` counters in real time.
* **Audit & Interaction History**: `ChallengeHelp` model recording full chronological history of hints, pseudocode, solutions, user code submissions, and Gemini evaluations.
* **Multi-Tier Progressive Help**: Tiered AI guidance endpoints (`/hint`, `/pseudocode`, `/solution`) to mentor rather than give direct answers.
* **AI Code Evaluation Engine**: Submissions evaluated by Gemini with separate logic and syntax verification to prevent trivial hardcoded answers.
* **Adaptive Challenge Progression**: Dynamic challenge engine analyzing struggle telemetry to synthesize personalized follow-up challenges.
* **Database Transactions & ORM**: PostgreSQL with Prisma ORM, atomic `$transaction` consistency, and versioned migrations.

## What is next

* 🧪 **Automated Testing Suite**: Add integration and end-to-end test suites across frontend and backend flows.
* 🛡️ **AI Token Budgeting & LLM Rate Limiting**: Add IP and user-tier rate limiting for Gemini AI assistance and evaluation endpoints.
* 📦 **Production Deployment**: Containerization with Docker and deployment setup on Vercel and Render.

## Documentation

The `docs/` directory contains the engineering journey, architecture decisions, database design, API design, challenges, and interview preparation.

## Philosophy

The goal isn't simply to finish the application.

The goal is to understand **why every important part exists, how it works, what problems were encountered while building it, and what tradeoffs were made.**
