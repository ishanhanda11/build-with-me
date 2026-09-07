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

✅ **Full-Stack Application & End-to-End AI Mentorship Platform is fully functional!**

The system architecture includes:

### Frontend (React + Vite)
* **Interactive Coding Workspace**: Embedded Monaco Code Editor (`@monaco-editor/react`) with syntax highlighting, auto-formatting, and dark mode.
* **Progressive AI Help Drawer**: Instant triggers for Non-spoiler Hints, Structural Pseudocode, and Solution Unlocks.
* **Live Interaction & Feedback Stream**: Real-time rendering of all previous AI hints, submissions, and Gemini evaluation cards.
* **Learner Onboarding Wizard**: Multi-step questionnaire tailoring learning style, goals, and difficulty preferences.
* **Profile Guard & Auth Flow**: Route-level session guarding (`ProfileGuard`), redirecting unauthenticated or non-onboarded users.
* **Project Dashboard & Roadmap**: Visual project explorer with challenge difficulty indicators and sequential progress tracking.

### Backend (Node.js + Express + Prisma + Gemini)
* **Authentication & Session Security**: Secure cookie-based JWT sessions with refresh token rotation and revocation.
* **Learner Profile Management**: Profile CRUD with learning style, target timeframe, and experience preferences.
* **AI Project Generation & Scope Control**: Dynamic curriculum generation using Google Gemini with dynamic `maxChallenges` bounds (8–20) tailored to learner capacity.
* **Project & Challenge CRUD**: Full lifecycle management with strict sequential progression prerequisites.
* **Attempt Tracking & Struggle Telemetry**: `ChallengeAttempt` tracking hints used, pseudocode requests, and solution unlocks.
* **Audit & Interaction History**: `ChallengeHelp` model recording full chronological history of hints, pseudocode, solutions, user code submissions, and Gemini evaluations.
* **Multi-Tier Progressive Help**: Tiered AI guidance endpoints (`/hint`, `/pseudocode`, `/solution`) to mentor rather than give direct answers.
* **AI Code Evaluation Engine**: Submissions evaluated by Gemini with separate logic and syntax verification to prevent trivial hardcoded answers.
* **Adaptive Challenge Progression**: Dynamic challenge engine analyzing struggle telemetry to synthesize personalized follow-up challenges.
* **Database Transactions & ORM**: PostgreSQL with Prisma ORM, atomic `$transaction` consistency, and versioned migrations.

## What is next

* 🎨 **UI Polish & Theme Enhancements**: Refine styling, transitions, and editor ergonomics.
* 🧪 **Testing & Quality**: Add automated integration and end-to-end tests across frontend and backend flows.
* 📦 **Deployment & CI/CD**: Containerization (Docker) and cloud deployment setup on Vercel and Render.

## Documentation

The `docs/` directory contains the engineering journey, architecture decisions, database design, API design, challenges, and interview preparation.

## Philosophy

The goal isn't simply to finish the application.

The goal is to understand **why every important part exists, how it works, what problems were encountered while building it, and what tradeoffs were made.**
