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

✅ **Backend AI Mentorship & Adaptive Learning Engine is fully functional!**

The backend architecture includes:

* **Authentication & Session Security**: Secure cookie-based JWT sessions with refresh token rotation and revocation.
* **Learner Profile Management**: Profile CRUD with learning style, target timeframe, and experience preferences.
* **AI Project Generation**: Dynamic project & curriculum generation using Google Gemini with structured Zod output validation.
* **Project & Challenge CRUD**: Full lifecycle management for projects and sequential challenge breakdown.
* **Attempt Tracking & Struggle Telemetry**: `ChallengeAttempt` tracking capturing hints used, pseudocode requests, and solution unlocks.
* **Multi-Tier Progressive Help**: Tiered AI guidance endpoints (`/hint`, `/pseudocode`, `/solution`) to mentor rather than give direct answers.
* **AI Code Evaluation Engine**: Submissions evaluated by Gemini with separate logic and syntax verification to prevent trivial hardcoded answers.
* **Adaptive Challenge Progression**: Dynamic challenge generation engine that analyzes previous struggle telemetry to tailor subsequent challenges.
* **Database & ORM**: PostgreSQL with Prisma ORM and versioned migrations.

## What is next

* 🚀 **Frontend Development**: Build the interactive React interface (Code Editor workspace, progressive hint drawers, evaluation modal, and project dashboard).
* 🧪 **Testing & Quality**: Add end-to-end integration tests for the full attempt/evaluation lifecycle.
* 📦 **Deployment & CI/CD**: Containerization and cloud deployment setup on Vercel/Render.

## Documentation

The `docs/` directory contains the engineering journey, architecture decisions, database design, API design, challenges, and interview preparation.

## Philosophy

The goal isn't simply to finish the application.

The goal is to understand **why every important part exists, how it works, what problems were encountered while building it, and what tradeoffs were made.**
