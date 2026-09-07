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
  * 2×2 Bento Grid: *Your Journey* (real-time live counts for projects, challenges, completions, and **real-time help requests**), *Current Streak* (fire emblem & 7-day activity pips), *Continue Building* (active project progress & direct navigation), and *Today's Quest* (daily objective & XP reward trigger).
  * Streamlined sidebar navigation focused on active developer tools: **Overview**, **Projects**, and **Challenges**, with the inspirational quote pinned cleanly at the bottom.
* **Platform About Page (`About.jsx`)**:
  * Dedicated, immersive overview page accessible via top navigation (`/about`).
  * Explains what Build With Me is, what it does, how it works through a 5-stage step-by-step loop, and technical feature deep dives.
* **Learner Profile Dossier (`Profile.jsx`)**:
  * Warning alert banner displayed when profile is missing, explaining that parameters are required before project generation.
  * Left identity card: Capitalized initial avatar, experience level badge, XP progression track (`0 / 700 XP`), earned emblems (`First Step`, `Streak 7`, `Pioneer`, `Builder`), and motto.
  * Right learning dossier form: Goal textarea, target completion date with calendar picker integration (duplicate browser icons suppressed), available hours per day, experience level, difficulty, assistance preference, and learning style.
  * Seamless view vs. edit mode toggling with instant validation.
* **Projects Explorer (`Projects.jsx`) & Roadmap (`Project.jsx`)**:
  * Category filter tabs (`All Projects`, `In Progress`, `Completed`) with real-time counts.
  * Live search input filtering projects dynamically by title or description.
  * Direct challenge navigation: Clicking a challenge navigates straight to the active Monaco workspace (`/solve`), eliminating intermediate preview screens.
* **Interactive Coding Workspace (`SolveChallenge.jsx`)**:
  * Multi-language Monaco Code Editor (`@monaco-editor/react`) supporting **JavaScript**, **Python**, and **Java** with dynamic syntax and tokenization.
  * Dedicated non-wrapping subbar architecture displaying challenge title, milestone badge, difficulty pill, and status, with learning objectives row directly underneath.
  * Progressive AI Help Drawer: Instant triggers for Non-spoiler Hints, Structural Pseudocode, and Solution Unlocks.
  * Live Interaction & Feedback Stream: Real-time rendering of all previous AI hints, submissions, and Gemini evaluation cards.
* **Route Guarding (`ProfileGuard.jsx`)**: Route-level session guarding redirecting unauthenticated or non-onboarded users.

### Backend (Node.js + Express + Prisma + Gemini)
* **Authentication & Session Security**: Secure cookie-based JWT sessions with refresh token rotation, token revocation, and `GET /auth/me` user endpoint.
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
* 🛡️ **Rate Limiting & Token Budgeting**: Add IP and user-tier rate limiting for Gemini AI assistance and evaluation endpoints.
* 📦 **Production Deployment**: Containerization with Docker and deployment setup on Vercel and Render.

## Documentation

The `docs/` directory contains the engineering journey, architecture decisions, database design, API design, challenges, and interview preparation.

## Philosophy

The goal isn't simply to finish the application.

The goal is to understand **why every important part exists, how it works, what problems were encountered while building it, and what tradeoffs were made.**
