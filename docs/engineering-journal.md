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

---

# Day 4 - Authentication Foundation Started

## Where I left off

The previous step ended with the backend foundation in place:

* Express app and server split.
* Basic routes and middleware added.
* Centralized error handling added.
* Prisma configured.
* Initial schema and migration created.
* Shared Prisma client module added.

The planned next step was to start moving from a basic backend skeleton into real backend feature structure:

```text
controllers
routes
services
repositories
validation
first learner/user API flow
```

The additional changes made after that point started the authentication foundation.

## What changed

The backend now has additional authentication-related dependencies:

* `bcrypt`
* `jsonwebtoken`
* `zod`

The backend also has `nodemon` added as a development dependency.

These changes were recorded in:

* `backend/package.json`
* `backend/package-lock.json`

## Why these dependencies matter

`bcrypt` is needed so user passwords can be hashed before being stored.

This matches the earlier schema decision to store `passwordHash` instead of a raw password.

`jsonwebtoken` is needed for issuing signed tokens after login.

This will likely support short-lived access tokens that the frontend can send with protected API requests.

`zod` is needed for request validation.

This is important because controllers should not trust raw request bodies. Incoming data should be checked before the app tries to create users, hash passwords, issue tokens, or save data.

`nodemon` was added to support a smoother development workflow, although the current `dev` script still uses Node's watch mode.

## Refresh token model added

The Prisma schema now includes a new `RefreshToken` model.

The `User` model now has:

```prisma
refreshTokens RefreshToken[]
```

The new model stores:

* `id`
* `userId`
* relation to `User`
* `tokenHash`
* `revokedAt`
* `expiresAt`
* timestamps

This means the database can remember refresh tokens instead of treating authentication as only a stateless JWT problem.

That matters because refresh tokens often need server-side control:

* A token can expire.
* A token can be revoked on logout.
* A token can be deleted if the user account is deleted.
* The raw refresh token does not need to be stored if only its hash is saved.

The relation uses cascade delete, so a user's refresh tokens are deleted when the user is deleted.

## Validation folder started

A new validator file was added:

* `backend/src/validators/auth.validation.js`

It currently defines a `registerValidation` schema with:

```js
const registerValidation = z.object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(8)
})
```

This is the beginning of input validation for the registration flow.

The registration route is not wired yet, but the schema shows the intended boundary:

```text
request body
    |
Zod validation
    |
controller/service logic
    |
database write
```

## Important issue noticed

The validator currently defines `registerValidation`, but it does not export it yet.

That means other files cannot import and use it until an export is added.

The auth feature is started, but not complete.

## Backend lessons learned

### Authentication needs both hashing and token strategy

Password hashing and JWTs solve different problems.

Hashing protects stored passwords.

JWTs help prove that a request came from an authenticated user.

Refresh tokens add a server-controlled way to continue sessions without forcing the user to log in constantly.

### Validation belongs near the boundary

Request validation should happen before business logic.

That keeps controllers and services from dealing with invalid or incomplete data.

For registration, this means checking fields like name, email, and password before trying to create a user.

### Refresh tokens should not be stored raw

The schema uses `tokenHash`, which is a better direction than storing a raw refresh token.

If the database is exposed, raw refresh tokens would let an attacker continue sessions.

Storing a hash reduces that risk because the backend can compare hashes without keeping the original token value.

---

# Mistakes / Problems After Auth Start

* The authentication dependency setup has started, but no auth routes, controllers, services, or repositories are wired yet.
* `registerValidation` exists but is not exported yet.
* The `RefreshToken` model was added to the Prisma schema, but a matching migration has not been created yet.
* `bcrypt`, `jsonwebtoken`, and `zod` are installed but not used by application code yet.
* `nodemon` was added, but the `dev` script still uses `node --watch`.
* The app still does not parse JSON request bodies with `express.json()`, which will block real registration/login request bodies until added.
* There are still no real automated tests.

---

# Decisions Added After Auth Start

### Decision 011 - Use Zod for request validation

Zod will be used to validate incoming request bodies before controller or service logic runs.

This keeps invalid data from spreading deeper into the application.

### Decision 012 - Store refresh tokens in the database

Refresh tokens should be persisted so sessions can be revoked, expired, and managed server-side.

This gives the backend more control than relying only on stateless access tokens.

---

# Day 5 - Authentication and Profile API Flow

## Where we were before

At the end of the previous journal section, the backend had already moved past the initial setup:

* Express app/server split was in place.
* Prisma and PostgreSQL were configured.
* The initial schema and migration existed.
* A `RefreshToken` model had been planned and started.
* Validation and auth dependencies were being introduced.

The key gap was that the app still did not have a real user-authenticated flow. The backend was still structurally ready, but the actual registration, login, token handling, and learner-profile creation logic had not been completed.

## What changed in this current phase

The backend moved from a learning skeleton into a real first feature flow.

### Authentication flow implemented

A full auth foundation is now in place across multiple files:

* `backend/src/routes/auth.routes.js`
* `backend/src/controllers/auth.controller.js`
* `backend/src/services/auth.service.js`
* `backend/src/repositories/auth.repository.js`
* `backend/src/services/token.service.js`
* `backend/src/middleware/authentication.middleware.js`

This includes:

* `POST /api/auth/register`
* `POST /api/auth/login`
* `POST /api/auth/refresh`
* `POST /api/auth/logout`

The flow includes:

* password hashing with `bcrypt`
* access token generation with `jsonwebtoken`
* refresh token generation and hashing
* refresh-token rotation on session renewal
* revocation on logout
* secure cookie-based token storage

### Learner profile flow implemented

The backend now also includes a protected profile creation path:

* `backend/src/routes/profile.routes.js`
* `backend/src/controllers/profile.controller.js`
* `backend/src/services/profile.service.js`
* `backend/src/repositories/profile.repository.js`

The profile route is protected by `authenticate`, which verifies the access token from the cookie before allowing a user to create a profile.

This gives the app a first real authenticated data-write flow rather than only unsecured public routes.

### Validation added

The backend now validates incoming request bodies with Zod:

* `backend/src/validators/auth.validation.js`
* `backend/src/validators/profile.validation.js`

This ensures invalid registration and profile payloads are rejected before they reach business logic.

### Database and app wiring updated

The main app file now includes:

* `express.json()` for parsing JSON bodies
* `cookie-parser` to read and write authentication cookies
* route registration for `/api/auth` and `/api/profile`
* centralized error handling and 404 responses

The Prisma client setup also reflects the actual database work by using a PostgreSQL connection pool and Prisma adapter.

## Why this matters

This was the phase where the application started acting like a real backend instead of a placeholder project.

The most important product-level lesson is that the app did not just need routes; it needed a dependable identity and session model.

The backend now captures the first important lifecycle:

```text
User signs up or logs in
    ↓
Password is hashed
    ↓
Access token + refresh token are issued
    ↓
Protected routes validate the access token
    ↓
User profile can be created against the authenticated identity
```

This is the foundation for later features like:

* onboarding flow
* challenge generation
* learner attempts
* AI evaluation
* adaptive hints
* persistence of learning state

## Lessons learned

### Cookies are an important part of a web app session flow

The app is not only issuing tokens; it is also sending them through cookies with `httpOnly` and `sameSite` settings.

This is important because it reduces the risk of token leakage through browser-side JavaScript and creates a cleaner user session flow for a web API.

### Refresh-token rotation is better than a single long-lived refresh token

The current implementation rotates refresh tokens when a new session is created.

This makes token reuse harder and gives the backend more control over invalidation.

### Protected routes should be auth-aware from the start

A profile API is not useful if it accepts requests from any anonymous user.

By validating the JWT in the middleware before reaching the controller, the application begins to enforce clear ownership boundaries:

* a user can only work with their own profile data
* future project/challenge flows can derive from the authenticated `userId`

### Validation should happen at the API boundary

The backend is now enforcing a cleaner layering discipline:

```text
request
    ↓
Zod validation
    ↓
controller
    ↓
service
    ↓
repository
    ↓
Prisma/DB
```

This is a better pattern than allowing unvalidated data to reach the database and business logic.

## Mistakes / Problems from this phase

* The project still has no automated test suite.
* Environment variables such as JWT secrets and database connection details must be managed carefully.
* The app still needs stronger handling for edge cases such as expired refresh tokens, invalid cookies, and missing headers.
* The auth flow is functional but still early-stage and will need security reviews as the project grows.
* The current frontend is not yet connected to this backend in a full end-to-end flow.

## Decisions added after this phase

### Decision 013 - Use cookie-based JWT transport for the web API

Access and refresh tokens are stored in cookies so the browser can send them automatically for protected APIs.

This suits an app where the backend is the API layer and the frontend is a separate client.

### Decision 014 - Use refresh-token rotation

When the user refreshes a session, the backend revokes the old refresh token and issues a new one.

This improves security and makes the session lifecycle easier to reason about.

### Decision 015 - Protect the learner-profile creation flow with authentication

The profile is not public. It belongs to the authenticated user.

This supports the product principle that user identity and learning state should be owned by the learner and not created anonymously.

## Interview questions added

* Why are access tokens and refresh tokens different?
* Why should refresh tokens be hashed before saving?
* Why rotate refresh tokens after each session renewal?
* Why is `cookie-parser` needed when using cookies in Express?
* Why should a protected route verify a JWT before it reaches controller logic?
* Why does a profile API need the authenticated user ID?
* Why use `Zod` at request boundaries?
* Why is `httpOnly` useful for tokens stored in cookies?
* What is the difference between authentication and authorization?
* Why should the backend hold the secrets rather than the frontend?

## Current status updated

The current backend now includes the core authentication and learner-profile foundation.

Completed so far:

* Node.js backend package created
* Express server and app split implemented
* Health and API routes added
* Request logging and centralized error handling added
* Prisma configured for PostgreSQL
* Initial database models created and refined
* Refresh token table and session model added
* Auth routes, controllers, services, and repositories built
* JWT access-token and refresh-token flow implemented
* Cookie-based login/logout/refresh session handling added
* Protected profile creation route added
* Zod validation added for auth and profile requests

Current next step:

**Move from identity and profile setup into project generation, challenge creation, and AI-powered adaptive learning workflows.**

### Decision 013 - Store refresh token hashes, not raw tokens

Refresh tokens should be treated like sensitive credentials.

The database should store a token hash so leaked database rows do not directly expose usable refresh tokens.

---

# Interview Questions Added After Auth Start

* Why should passwords be hashed before storing them?
* Why use `bcrypt` instead of writing a custom hashing function?
* What is the difference between an access token and a refresh token?
* Why might refresh tokens be stored in the database?
* Why store a refresh token hash instead of the raw token?
* What does token revocation mean?
* Why validate request bodies before controller logic?
* What problem does Zod solve?
* Why should validation schemas be exported from their modules?
* What needs to happen after changing a Prisma schema?

---

# Current Status After Auth Start

Authentication foundation has started.

Completed since the last journal entry:

* Added auth-related dependencies.
* Added `zod` for validation.
* Added `bcrypt` for future password hashing.
* Added `jsonwebtoken` for future token issuing.
* Added `nodemon` as a development dependency.
* Added a `RefreshToken` Prisma model.
* Connected refresh tokens to the `User` model.
* Started a registration validation schema.

Current next step:

**Finish the first auth flow by adding JSON body parsing, exporting validation schemas, creating auth routes/controllers/services, hashing passwords, saving users, generating tokens, and creating the matching Prisma migration.**

---

# Day 6 - Profile Continuation & Project Generation API

## Where we were before

Authentication and the initial profile creation route were in place. The next goal was to introduce AI-powered project generation and allow fetching/updating the profile.

## What changed in this phase

### Profile feature expanded
- Added `getProfile` and `updateProfile` in `backend/src/services/profile.service.js`.
- Exposed `GET /api/profile` and `PATCH /api/profile` via `profile.routes.js`.
- Implemented `updateProfileValidation` using `zod` to validate profile modifications.
- Allowed users to securely read and update their own learner profile data.

### AI Project Generation introduced
- Integrated `@google/genai` (Gemini SDK) into the application.
- Added `ai.service.js` which sends the user's profile to Gemini to generate a personalized learning project containing structured challenges.
- Implemented `generatedProjectValidation` using `zod` to validate the JSON returned by the AI before accepting it.

### Project endpoints and database wiring
- Created `project.service.js` to manage the project creation workflow, using Prisma transactions to atomically save the `Project` and its `Challenge` records.
- Created `project.repository.js` to handle database interactions for projects and challenges.
- Added `POST /api/project` route, protected by authentication, to trigger the generation and save it to the database.

## Lessons learned

### AI Integration needs strict schemas
By providing `responseSchema` and validating the output with Zod, the application protects itself from unexpected AI responses. We do not trust the AI output blindly; we validate it just like any user input.

### Transactions for related data
The Project and its Challenges must be saved together. Using `prisma.$transaction` ensures that if one challenge fails to save, the entire project creation rolls back, preventing incomplete data.

## Mistakes / Problems from this phase
- The `.env` file now needs a valid `GEMINI_API_KEY`, but there's no error handling yet if the key is missing on startup.
- The project generation can take several seconds; the frontend will need to handle this delay gracefully.

## Current status updated
The application can now successfully take an authenticated learner's profile and use it to ask Gemini for a personalized learning project, safely parse the result, and persist it to PostgreSQL.

Current next step:
**Begin integrating the frontend to connect with these backend APIs and build out the UI for profile management and project viewing.**

---

# Day 7 - Full Project CRUD and Challenge Tracking

## Where we were before

The backend could generate AI projects based on learner profiles, but learners had no way to view their list of projects, update a project's status, delete a project, or view the challenges inside a project. Additionally, there was no way to track a learner's progress on an individual challenge.

## What changed in this phase

### Full Project CRUD
- Added `getAllProject`, `getProjectById`, `updateProject`, and `deleteProject` methods in `project.repository.js`.
- Exposed routes `GET /api/project`, `GET /api/project/:id`, `PATCH /api/project/:id`, and `DELETE /api/project/:id` in `project.routes.js`.
- Implemented `updateProjectValidation` in `project.validation.js` to ensure the project status transitions through safe enums (`ACTIVE`, `PAUSED`, `COMPLETED`, `ABANDONED`).

### Challenge Access and Progress Tracking
- Exposed new routes in `project.routes.js` for fetching challenges related to a project (`GET /:projectId/challenges` and `GET /:projectId/challenges/:id`).
- Created `challenge.controller.js`, `challenge.service.js`, and `challenge.repository.js` to handle fetching challenges.
- Added a new `ChallengeAttempt` model to the Prisma schema (`schema.prisma`).

### The ChallengeAttempt Model
The new `ChallengeAttempt` model tracks a learner's actual progress on a specific challenge:
- Tracks `status` (`IN_PROGRESS`, `COMPLETED`, `FAILED`).
- Tracks the number of hints, pseudocode, and solution unlocks used (`hintsUsed`, `pseudocodeUsed`, `solutionUsed`).
- Connects back to the `Challenge` and `User` with `onDelete: Cascade`.

### Database Configuration Update
- Updated `schema.prisma` datasource URL to properly read from the `DATABASE_URL` environment variable.

## Why this matters

The AI should not just generate projects and disappear. The core idea is an *adaptive mentor*. By introducing `ChallengeAttempt` and tracking exactly how many hints or solutions a learner uses, the application now has the foundation to observe struggle. Later, the AI can use this data to intervene differently based on how often a learner relies on hints.

## Lessons learned

### Tracking struggle is key to adaptive learning
Without `ChallengeAttempt`, we only know if a project exists. With it, we know *how* the learner is engaging with the challenge. This aligns perfectly with the initial product philosophy: "AI shouldn't write your code. AI should make you capable of writing it."

## Current status updated

The backend now supports full project management and has the database foundation for tracking learner struggle and progress on individual challenges.

Current next step:
**Implement the API endpoints to start, update, and complete `ChallengeAttempt` records, and hook up the adaptive hint logic with Gemini.**

---

# Day 8 - AI Mentorship Loop, Evaluation & Adaptive Challenge Engine

## Where we were before

In Day 7, we laid the database foundations for project CRUD and created the `ChallengeAttempt` schema. However, there were no API endpoints for learners to start attempts, request progressive guidance (hints, pseudocode, solutions), submit code for evaluation, or dynamically adapt challenge difficulty based on learner struggle.

## What changed in this phase

### 1. Challenge Attempt Lifecycle Management
- Created `challengeAttempt.repository.js`, `challengeAttempt.service.js`, and `challengeAttempt.controller.js`.
- Exposed CRUD attempt endpoints under `/api/challenge/:challengeId/attempts`:
  - `POST /api/challenge/:challengeId/attempts` (Start attempt)
  - `GET /api/challenge/:challengeId/attempts/:attemptId` (Get attempt details)
  - `GET /api/challenge/:challengeId/attempts` (List attempts for a challenge)
  - `PATCH /api/challenge/:challengeId/attempts/:attemptId` (Update attempt state)
- Updated Prisma schema with `ChallengeStatus` (`IN_PROGRESS`, `COMPLETED`) and refined `ChallengeDifficulty` enums (`EASY`, `MEDIUM`, `HARD`).

### 2. Progressive AI Help System (Mentor Guidance)
Implemented the core tier of progressive assistance through dedicated endpoints under `attemptHelp.routes.js`:
- `POST /api/challenges/:challengeId/hint`: Generates structured hints without giving away complete code; automatically increments `hintsUsed` on the learner's in-progress attempt.
- `POST /api/challenges/:challengeId/pseudocode`: Generates high-level algorithmic pseudocode steps without raw code syntax; automatically increments `pseudocodeUsed`.
- `POST /api/challenges/:challengeId/solution`: Unlocks full reference solution, explanation, and working code as a last resort; marks the attempt and challenge as `COMPLETED` and increments `solutionUsed`.

### 3. Submission & Code Evaluation Engine
- Implemented `submission.routes.js`, `submission.controller.js`, and `submitAttempt.service.js` (`POST /api/attempts/:attemptId/submit`).
- Utilized Gemini via `generateEvaluation()` in `ai.service.js` with structured JSON schema output:
  - Validates logical correctness separately from syntax errors.
  - Prevents hardcoded solutions tailored only to sample cases from passing.
  - Returns actionable feedback.
  - Updates attempt status (`COMPLETED` vs `FAILED`) and marks the challenge as completed when logic passes.

### 4. Dynamic Adaptive Challenge Engine
- Added `adaptiveChallenge.routes.js`, `adaptiveChallenge.controller.js`, and `adaptiveChallenge.service.js` (`POST /api/challenges/:projectId/adaptive`).
- Analyzes previous completed challenges and historical struggle signals (hints, pseudocode, solutions, and failed attempts).
- Generates personalized follow-up challenges matching the learner's demonstrated competency and learning objectives.
- Incrementally appends new challenges using dynamic sequence ordering (`challengeOrder`).

### 5. Enhanced AI Integration & Strict Schema Validation
- Enhanced `ai.service.js` to support `generateAdaptiveChallenges`, `generateEvaluation`, `generateHint`, `generatePseudocode`, and `generateSolution`.
- Updated `generateProject` to accept learner history (`previousProjects`) to avoid duplicate curriculum generation.
- Added strict Zod validation schemas across all new interfaces (`adaptiveChallenge.validation.js`, `attemptHelp.validation.js`, `challengeAttempt.validation.js`, and `userSubmission.validation.js`).

## Architecture Overview

```text
Learner Client
    │
    ├──▶ POST /api/challenge/:id/attempts (Start Attempt)
    │
    ├──▶ Progressive Help
    │    ├── POST /api/challenges/:id/hint (hintsUsed++)
    │    ├── POST /api/challenges/:id/pseudocode (pseudocodeUsed++)
    │    └── POST /api/challenges/:id/solution (solutionUsed++, marks COMPLETED)
    │
    ├──▶ POST /api/attempts/:id/submit ──▶ AI Evaluation ──▶ COMPLETED / FAILED
    │
    └──▶ POST /api/challenges/:projectId/adaptive ──▶ Analyze Struggle ──▶ Generate Next Challenges
```

## Lessons learned

### Decoupling Syntax from Logic in AI Evaluation
Prompt engineering and response schema validation were configured so the LLM distinguishes between minor syntax slips and structural algorithmic flaws. This gives learners constructive feedback rather than a binary pass/fail without guidance.

### Closing the Adaptive Learning Loop
Adaptive learning cannot rely solely on self-reported user surveys. By tracking telemetry (number of hint requests, reliance on pseudocode, failed submissions), the backend constructs a real-time behavioral profile that feeds into the next challenge generation cycle.

## Mistakes / Problems from this phase
- Need to ensure robust rate limiting and token budgeting on the AI endpoints since users can trigger multiple hint and evaluation requests.
- Need end-to-end integration tests to verify database state transitions across the full attempt -> help -> submit -> adaptive challenge lifecycle.

## Current status updated

The core AI Mentorship engine is now fully functional on the backend. The API handles the entire learning lifecycle: project generation, attempt management, multi-tier AI assistance, intelligent evaluation, and adaptive curriculum progression.

Current next step:
**Begin frontend integration: build the interactive challenge workspace UI with the code editor, hint/help drawers, submission feedback display, and adaptive progression cards.**
