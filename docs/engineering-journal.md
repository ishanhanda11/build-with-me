# Engineering Journal

## AI Build With Me

This document records the engineering journey of building AI Build With Me.

The purpose is not just to record what was built, but to record the problems encountered, mistakes made, decisions taken, debugging process, concepts learned, and the reasoning behind the final implementation.

The goal is to be able to look back at this project and explain the engineering decisions honestly and deeply in technical interviews.

---

# Project Origin

## Why I am building this

I wanted to build a project that would force me to learn by actually implementing things rather than relying on tutorials or blindly copying AI-generated code.

The idea evolved into an AI-powered coding mentor.

The platform should generate projects based on what a learner wants to achieve and what they want to learn. It should then break those projects into challenges and allow the learner to attempt them independently.

If the learner gets stuck, the AI should progressively provide:

1. A hint
2. A stronger hint
3. Pseudocode
4. A solution as a last resort

The important idea is that getting stuck should not automatically result in receiving the answer.

Instead, the system should try to understand why the learner is struggling and reduce or decompose the difficulty when appropriate.

---

# Initial Product Philosophy

> AI shouldn't write your code. AI should make you capable of writing it.

The platform should encourage active problem solving rather than passive consumption.

---

# Day 1 — Project Setup

## What I did

* Created the project repository.
* Created the initial frontend directory.
* Created the initial backend directory.
* Created the documentation directory.
* Added the initial README.
* Started the engineering journal.

## Initial Architecture

```text
Frontend
    ↓
Backend API
    ↓
Database
```

AI requests will eventually follow:

```text
Frontend
    ↓
Backend
    ↓
AI Service
    ↓
Gemini
```

The learner's persistent information will be stored in PostgreSQL rather than relying on the AI model to remember it.

---

# Architecture Understanding

The backend will eventually separate responsibilities into areas such as:

* Controllers
* Application/business logic
* Repositories
* AI services
* Prompt construction
* Validation
* Database access

The controller should remain relatively thin.

The application service will coordinate business operations.

The repository layer will handle database access.

The AI service will communicate with Gemini.

Validation will ensure that external AI responses conform to the structure expected by the application.

---

# First Architecture Lessons

## Learner memory vs AI

Gemini is not the application's persistent learner memory.

The database stores information such as:

* Goals
* Skills
* Weaknesses
* Challenge history
* Mistakes
* Hints requested
* Performance
* Projects
* Learning preferences

The backend retrieves relevant information from the database and provides the appropriate context to Gemini.

## Adaptive learning

The application should not blindly ask Gemini what the learner should do next.

Application logic should use learner data and behavioral signals to determine what should happen.

Gemini can then generate the actual learning content.

---

# Mistakes / Problems

*None recorded yet.*

---

# Decisions

### Decision 001 — Build as a learning project first

The first goal is deep learning and job readiness rather than immediately optimizing for monetization.

### Decision 002 — Mentor instead of copy-paste

The AI should progressively provide assistance rather than immediately provide complete code.

### Decision 003 — Database as persistent learner memory

Learner information should be stored in the application's database.

### Decision 004 — Application logic controls adaptive behavior

The LLM should generate content, but important learner-state decisions should remain under application control.

---

# Interview Questions Generated So Far

* Why shouldn't the frontend call Gemini directly?
* Why should the Gemini API key remain on the backend?
* What is the repository layer?
* Why shouldn't controllers contain business logic?
* What is the difference between application logic and database access?
* Why validate LLM output?
* Why should LLM retries be bounded?
* Why shouldn't incomplete AI responses be saved?
* Why should PostgreSQL be the persistent learner memory?

---

# Current Status

Project setup completed.

Current next step:

**Begin Node.js/backend setup and understand the backend foundation before introducing Express.**

---

# Day 2 - Backend Foundation With Node.js and Express

## What I added

After the initial project setup, I started building the backend foundation.

The backend now contains:

* A Node.js backend package.
* Express as the HTTP server framework.
* A `dev` script using Node's watch mode.
* A separate server entry file.
* A separate Express app file.
* Basic API routes.
* Request logging middleware.
* A 404 handler.
* A centralized error handler.

The main backend files added are:

* `backend/package.json`
* `backend/package-lock.json`
* `backend/src/server.js`
* `backend/src/app.js`

## Why Express was introduced

The backend needs to expose HTTP endpoints that the frontend can call.

Express gives a simple way to define routes, middleware, and error handling.

At this stage, the goal was not to build all application features immediately. The goal was to understand the basic backend request lifecycle:

```text
Request
    |
Express middleware
    |
Route handler
    |
Response
```

This matters because later features such as authentication, learner onboarding, project generation, challenge submission, hint requests, and AI evaluation will all pass through this same lifecycle.

## Separation between app and server

I separated the Express application from the file that starts the server:

```text
src/app.js
    Defines the Express app, middleware, routes, 404 handler, and error handler.

src/server.js
    Imports the app and starts listening on port 3000.
```

This separation is useful because the app can later be tested without always starting a real network server.

It also keeps the responsibility of each file clearer:

* `app.js` describes the API behavior.
* `server.js` starts the running process.

## Routes added

The backend currently has these routes:

```text
GET /health
GET /api
GET /test-error
```

The `/health` route returns a simple status response:

```json
{ "status": "ok" }
```

This route is useful because it gives a quick way to confirm that the server is running.

The `/api` route returns a basic API message:

```json
{ "message": "build with me api" }
```

The `/test-error` route intentionally creates an error and passes it to the error handling middleware.

This helped me understand how Express moves from a route handler to the centralized error handler using `next(error)`.

## Middleware added

I added request logging middleware that records:

* User IP
* HTTP method
* Original URL
* Timestamp

This helped me understand that middleware runs before the route handler when it is registered earlier in the file.

The request lifecycle now looks like:

```text
Incoming request
    |
Request logger middleware
    |
Matching route handler
    |
404 handler if no route matches
    |
Error handler if an error is passed
```

## 404 handling

I added a final middleware after all routes to handle unknown endpoints.

This is important because if a request reaches this middleware, it means no route above it matched.

The backend now returns a structured 404 JSON response instead of leaving the client with a vague missing route behavior.

## Centralized error handling

I added an Express error handler at the end of `app.js`.

The important lesson is that Express error middleware has four parameters:

```js
(err, req, res, next)
```

The error handler currently reads:

* `err.statusCode`
* `err.message`

If no status code exists, it defaults to `500`.

This is the beginning of a consistent backend error strategy. Later, validation errors, authentication errors, database errors, and AI service errors should all flow through a predictable structure.

---

# Day 3 - Database Foundation With Prisma

## What I added

I introduced Prisma as the ORM layer for PostgreSQL.

The backend now contains:

* Prisma as a development dependency.
* `@prisma/client` as the runtime database client.
* A Prisma schema file.
* A Prisma config file.
* An initial database migration.
* A shared Prisma client module.

The main database-related files added are:

* `backend/prisma/schema.prisma`
* `backend/prisma.config.ts`
* `backend/prisma/migrations/20260813134942_init/migration.sql`
* `backend/prisma/migrations/migration_lock.toml`
* `backend/src/db/db.js`

## Why Prisma was added

The application needs persistent learner memory.

The AI model should not be treated as the source of truth for learner state. The database should store the durable facts of the application, and the backend should decide which facts are relevant when talking to the AI service.

Prisma helps by giving:

* A schema for modeling the database.
* Migrations for tracking database changes.
* A generated client for querying data from application code.

## Prisma client setup

I added a shared Prisma client module:

```js
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

module.exports = prisma
```

This creates one reusable database client that other backend modules can import later.

This is better than creating a new Prisma client in every file because the database connection layer should be managed consistently.

## Models added

The initial Prisma schema includes these main models:

* `User`
* `LearnerProfile`
* `Project`
* `Challenge`

These models match the core product idea:

```text
User
    |
LearnerProfile
    |
Projects
    |
Challenges
```

The database now has a first version of the application's learning data model.

## User model

The `User` model stores:

* `id`
* `name`
* `email`
* `passwordHash`
* relation to `LearnerProfile`
* relation to `Project`
* timestamps

The email is unique because two accounts should not share the same login identity.

The password is stored as `passwordHash`, not `password`, which is the correct direction because raw passwords should never be stored.

## LearnerProfile model

The `LearnerProfile` model stores learning-specific information:

* Goal
* Target timeframe
* Experience level
* Preferred difficulty
* Help preference
* Learning style
* Available hours per day

This model is important because it separates account identity from learning identity.

A `User` answers who the person is.

A `LearnerProfile` answers how the person wants to learn.

## Project model

The `Project` model stores generated or assigned learning projects.

Each project belongs to one user and can contain many challenges.

The project also has a status so the system can distinguish between active, paused, completed, and abandoned projects.

This matters because an adaptive learning platform needs to understand whether a learner is progressing through a project, stuck in it, or has stopped working on it.

## Challenge model

The `Challenge` model stores individual project tasks.

Each challenge belongs to one project.

Important fields include:

* Title
* Description
* Difficulty
* Learning objectives
* Challenge order

The `challengeOrder` field matters because generated challenges are not just random tasks. They should form a learning sequence.

I also added a unique constraint:

```prisma
@@unique([projectId, challengeOrder])
```

This prevents two challenges in the same project from having the same order number.

## Enums added

The schema includes enums for:

* `ProjectStatus`
* `Difficulty`
* `ExperienceLevel`
* `HelpPreference`
* `LearningStyle`

Enums are useful here because these fields should only allow known values.

For example, difficulty should not become random strings such as `"easyy"` or `"super medium"` because that would make adaptive logic harder to trust.

## Cascade deletes

The schema uses `onDelete: Cascade` for relations such as:

* User to learner profile
* User to projects
* Project to challenges

This means related child records are deleted when the parent is deleted.

The decision makes sense for early development because if a user is deleted, their profile and projects should not remain orphaned.

This may need to be reconsidered later if the product needs audit logs, analytics, or soft deletes.

---

# Backend Lessons Learned

## Middleware order matters

Express runs middleware and routes in the order they are registered.

That means:

* Logging middleware should be registered before routes.
* The 404 handler should be registered after routes.
* The error handler should be registered last.

If the order is wrong, requests may skip expected behavior or receive the wrong response.

## `next(error)` is how errors move through Express

Throwing or creating an error is not enough by itself in every situation.

Passing an error to `next(error)` tells Express to skip normal route handling and move to the error handler.

This is important because future controllers should not each manually format every error response.

## Database schema is product thinking

Designing the Prisma schema forced me to think about the actual product model.

The important question was not only "what tables do I need?"

The better question was:

> What does the application need to remember in order to mentor the learner over time?

That led to separating account information, learner preferences, projects, and challenges.

## AI memory should be reconstructed from database context

The database schema reinforces the earlier decision that Gemini is not the memory layer.

When the app later asks Gemini to generate projects, evaluate attempts, or provide hints, the backend should fetch relevant learner data and send only the useful context.

The AI response should then be validated before important state is saved.

---

# Mistakes / Problems Updated

* The backend currently has only basic routes and no real feature controllers yet.
* The test script is still a placeholder and does not run real tests.
* The backend currently listens on a hardcoded port `3000`; later this should move to an environment variable.
* The app does not yet parse JSON request bodies with `express.json()`.
* Authentication is not implemented yet, even though the `User` model already has `passwordHash`.
* The current error response contains both `error` and `message`, and the naming should be cleaned up before the API grows.
* The database schema is an initial version and will likely need more models for attempts, hints, submissions, evaluations, mistakes, and learning signals.

---

# Decisions Added

### Decision 005 - Separate Express app from server startup

The Express app should be defined separately from the file that starts listening on a port.

This keeps the backend easier to test and makes responsibilities clearer.

### Decision 006 - Add request logging early

Request logging was added early so that backend behavior can be observed while learning and debugging.

### Decision 007 - Use centralized error handling

Errors should eventually flow through a shared error handler instead of being formatted separately in every route.

### Decision 008 - Use Prisma for the database layer

Prisma will be used to model the PostgreSQL database, manage migrations, and access data from the backend.

### Decision 009 - Separate user account data from learner profile data

The `User` model stores account identity.

The `LearnerProfile` model stores learning preferences and goals.

This separation makes the product model clearer and easier to extend.

### Decision 010 - Store ordered challenges under projects

Challenges belong to projects and have a unique order within each project.

This supports the idea that learning should progress through a structured sequence rather than unrelated tasks.

---

# Interview Questions Added

* Why separate `app.js` from `server.js` in an Express backend?
* What is middleware in Express?
* Why does middleware order matter?
* Why should a 404 handler be placed after all route definitions?
* What makes Express error middleware different from normal middleware?
* Why use `next(error)`?
* Why should ports usually come from environment variables?
* What is Prisma?
* What problem do database migrations solve?
* Why use enums in a database schema?
* Why should email be unique in the `User` table?
* Why store `passwordHash` instead of a raw password?
* Why separate `User` from `LearnerProfile`?
* Why does `Challenge` need `challengeOrder`?
* What does a composite unique constraint do?
* What are the tradeoffs of cascade deletes?

---

# Current Status Updated

Backend foundation has started.

Completed so far:

* Node.js backend package created.
* Express installed and connected.
* Basic server startup added.
* Basic health/API routes added.
* Request logging middleware added.
* 404 handling added.
* Centralized error handling added.
* Prisma installed and configured.
* Initial PostgreSQL schema designed.
* Initial migration created.
* Shared Prisma client module added.

Current next step:

**Add real backend feature structure: controllers, routes, services, repositories, validation, and the first learner/user API flow.**
