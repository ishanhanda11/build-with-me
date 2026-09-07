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

---

# Day 9 - Challenge Help History, Project Max Scope, and State Consistency

## Where we were before

In Day 8, we completed the core mentorship loop: starting attempts, requesting progressive AI help, submitting code for evaluation, and generating adaptive challenges. However:
1. Help requests and submitted code evaluations were only tracked as increment counters (`hintsUsed`, `pseudocodeUsed`, `solutionUsed`) rather than preserving the actual generated AI guidance and user submissions.
2. Projects had no defined target scope or total length boundary.
3. Multiple database updates across attempts and help logs were not wrapped in atomic database transactions.
4. Learners could potentially jump ahead and submit challenges out of order.

## What changed in this phase

### 1. `ChallengeHelp` Model & Full Help History
- Added the `ChallengeHelp` Prisma model and `HelpType` enum (`HINT`, `PSEUDOCODE`, `SOLUTION`, `USER_SOLUTION`, `EVALUATION`).
- Created Prisma migrations:
  - `20260901071101_add_challenge_help_history`
  - `20260902082207_add_submission_help_types`
- Implemented `/api/challenges/:challengeId/help` (`challengeHelp.routes.js`, `challengeHelp.controller.js`, `challenge.help.service.js`) allowing the frontend to load the full chronological history of hints, pseudocode, solutions, user submissions, and evaluation reports.

### 2. Project Scope Control (`maxChallenges`)
- Added `maxChallenges` (default 8, min 8, max 20) to `Project` model.
- Updated `ai.service.js` to instruct Gemini to determine the total challenge count based on the learner's experience, available hours, target timeframe, and project complexity.
- Updated `adaptChallengeService` to calculate `remainingSlots` and stop generating new challenges once the project reaches its `maxChallenges` quota.
- Automatic completion: When the total challenge count matches `maxChallenges` and all challenges are `COMPLETED`, the project status automatically transitions to `COMPLETED`.

### 3. Atomic Database Transactions & Data Integrity
- Refactored `attemptHelp.service.js` and `submitAttempt.service.js` using `prisma.$transaction`.
- Updating attempt metrics, creating `ChallengeHelp` audit records, and updating challenge/project statuses are now executed in atomic transaction blocks to prevent inconsistent states if any query fails.

### 4. Sequential Challenge Enforcement & State Guardrails
- Added `getPreviousChallenge` in `challenge.repository.js` and verified that previous challenges are `COMPLETED` before allowing submissions on subsequent challenges.
- Blocked submissions and updates on `ABANDONED` or `COMPLETED` projects.
- Auto-reactivated `PAUSED` projects when a learner resumes and submits code.
- Prevented manual status changes to `COMPLETED` via `updateProjectValidation` (status is managed by completion logic).
- Fixed typo in profile controller responses (`messsage` -> `message`) and improved token revocation HTTP status codes (401).

## Architecture Overview

```text
Learner Client
    │
    ├──▶ POST /api/challenges/:id/hint ──▶ [tx: hintsUsed++, save ChallengeHelp(HINT)]
    ├──▶ POST /api/challenges/:id/pseudocode ──▶ [tx: pseudocodeUsed++, save ChallengeHelp(PSEUDOCODE)]
    ├──▶ POST /api/challenges/:id/solution ──▶ [tx: solutionUsed++, save ChallengeHelp(SOLUTION), complete Challenge]
    │
    ├──▶ POST /api/challenges/:id/submit ──▶ Validate Sequential Order
    │                                    ──▶ Gemini Code Evaluation
    │                                    ──▶ [tx: update Attempt, save USER_SOLUTION & EVALUATION]
    │                                    ──▶ Check maxChallenges: Auto-complete Project or Trigger Adaptive Gen
    │
    └──▶ GET /api/challenges/:id/help ──▶ Retrieve complete chronological interaction history
```

## Lessons learned

### Preserving Interaction History Over Plain Counters
Counters (`hintsUsed: 3`) tell us *how much* help was used, but not *what* was suggested or *what* the learner submitted. Storing structured `ChallengeHelp` records enables the frontend to persist conversation state across reloads and allows future AI context prompts to review previous attempts and feedback.

### Enforcing Strict State Transitions
Allowing arbitrary status updates can cause broken learning progressions. Restricting manual status mutations (e.g. keeping `COMPLETED` system-driven) and enforcing sequential prerequisites ensures data consistency.

## Current status updated

The backend architecture is complete, transactional, and resilient. It supports full project lifecycles with bounded scopes, progressive mentorship, persistent interaction histories, automated evaluation, and sequential enforcement.

Current next step:
**Develop the React frontend workspace: connect authentication cookies, build the project explorer, interactive code editor, sequential challenge roadmap, and real-time help/evaluation drawer.**

---

# Day 10 - Full-Stack React Frontend, Monaco Editor Workspace & End-to-End Integration

## Where we were before

In Day 9, the backend was completely finished with transactional consistency, challenge help history, bounded project scopes, and adaptive challenge generation. The next major milestone was building the user-facing web application in React and connecting it to the backend APIs.

## What changed in this phase

### 1. Backend CORS & Cookie Authentication Configuration
- Installed and configured `cors` in `backend/src/app.js` with `origin: "http://localhost:5173"` and `credentials: true`.
- Enabled cross-origin cookie propagation so the browser securely sends `httpOnly` access and refresh tokens across React API calls.

### 2. Frontend Infrastructure & Architecture
- Initialized React application powered by Vite, React Router v7 (`react-router-dom`), Axios, and React Hot Toast (`react-hot-toast`).
- Created a modular API client layer (`services/api.js`, `services/auth.api.js`, `services/profile.api.js`, `services/project.api.js`, `services/requestHelp.api.js`) with configured baseURL and `withCredentials: true`.

### 3. Authentication & Learner Profile Onboarding
- **Authentication Page (`Auth.jsx`)**: Interactive tabbed interface for User Registration and Login with validation and toast notifications.
- **Learner Profile Onboarding (`Profile.jsx`)**: Comprehensive onboarding questionnaire collecting learning goals, target timeframes, experience levels, help preferences, learning styles, and daily availability.
- **Route Guarding (`ProfileGuard.jsx`)**: Created a higher-order route guard that verifies if the authenticated user has an active learner profile, redirecting new users to onboarding while showing a smooth loading transition.

### 4. Project Explorer & Challenge Roadmap
- **Dashboard & Project Listing (`Dashboard.jsx`, `Projects.jsx`)**: Displays learner projects, active statuses, creation dates, and triggers the AI project generation workflow.
- **Project Detail (`Project.jsx`)**: Visualizes the sequential roadmap of challenges, displaying difficulty badges, completion badges, and challenge order.
- **Challenge Overview (`Challenge.jsx`)**: Displays detailed challenge descriptions, learning objectives, and action buttons to enter the coding workspace.

### 5. Interactive Coding Workspace & Progressive AI Drawer
- **Monaco Code Editor (`SolveChallenge.jsx`)**: Embedded Monaco Editor (`@monaco-editor/react`) featuring syntax highlighting, dark mode (`vs-dark`), and real-time code buffer tracking.
- **Progressive Help Drawer**: Instant triggers for:
  - `Hint`: Non-spoiler algorithmic clues.
  - `Pseudocode`: Step-by-step structural logic.
  - `Solution`: Full code solution unlock.
- **Live Help & Evaluation History**: Dynamically renders the `ChallengeHelp` audit stream, showing past hints, pseudocode, previous user code submissions, and Gemini evaluation results directly next to the editor.
- **Live Evaluation Feedback**: Submissions trigger Gemini code evaluation, dynamically displaying feedback and success/failure indicators.

## Architecture Overview

```text
React Client (Vite :5173)
    │
    ├── ProfileGuard (Session & Profile Check)
    │
    ├── /auth ──▶ POST /api/auth/register, /api/auth/login (Cookies stored)
    ├── /profile ──▶ POST /api/profile (Learner Profile Setup)
    ├── /projects ──▶ GET /api/project, POST /api/project (AI Project Gen)
    ├── /projects/:id ──▶ GET /api/project/:id/challenges
    │
    └── /projects/:id/challenges/:id/solve
            │
            ├── Monaco Code Editor (User Solution Buffer)
            ├── Progressive Help Drawer (POST /api/challenges/:id/hint, etc.)
            ├── Live Interaction Feed (GET /api/challenges/:id/help)
            └── Submission & Evaluation (POST /api/challenges/:id/submit)
```

## Lessons learned

### Cookie Transport Across Frontend and Backend
When running frontend and backend on different ports (`localhost:5173` and `localhost:3000`), `cors` must explicitly specify the exact origin and `credentials: true`. Wildcards (`*`) do not work with credentialed requests.

### Client-Side State Synchronization with Interaction History
Rather than storing hints in ephemeral local React state, fetching the `ChallengeHelp` history on component mount ensures learners retain all previously unlocked hints and past submissions upon refreshing the page or navigating back.

## Current status updated

The full-stack application is now complete and connected end-to-end. Learners can sign up, define their learning profile, generate AI-powered learning projects, navigate structured challenges, write solutions in Monaco Editor, access progressive AI hints, and receive instant AI feedback.

Current next step:
**Overhaul frontend visual aesthetics, implement cohesive dark stone theme system, build out dashboard bento cards, profile dossier, projects explorer, and polish user interaction flows.**

---

# Day 11 — Design System Overhaul, Gamified Developer Journey, and Clean Frontend Architecture

## Where we were before

In Day 10, we established the full-stack connectivity: user authentication, onboarding questionnaire, project explorer, Monaco Editor coding workspace, and progressive AI help drawer. While functional, the user interface lacked a cohesive aesthetic identity, the profile page did not enforce completion prior to project generation, and backend user relations defaulted to generic placeholders when unjoined.

## What changed in this phase

### 1. Design System & Thematic Architecture
- Established a unified design token system in `frontend/src/index.css`:
  - **Surfaces**: Dark Nordic stone (`--bg-primary: #111312`, `--bg-surface: #181A18`, `--bg-card: #141614`).
  - **Borders**: Hairline structural borders (`--border-default: #34352F`, `--border-subtle: #242622`).
  - **Accents**: Restrained crimson (`--accent-red: #A43B2E`, `--accent-red-bright: #C64A38`) and muted gold (`--accent-gold: #B59A62`).
  - **Typography**: Imported and configured `Cinzel`, `Cormorant Garamond`, `Inter`, and `JetBrains Mono` for a balanced editorial and developer aesthetic.

### 2. Dashboard Experience & Interactive Navigation
- Rebuilt `Dashboard.jsx` and `DashBoard.css`:
  - **Header & Navigation**: Top navigation with brand identity, active routing indicators, search button, and user profile chip.
  - **Profile Dropdown**: Implemented interactive dropdown with hover grace period (`closeTimeoutRef` 200ms debounce), click toggle, and outside click listener to prevent flickering. Provides direct access to "My Profile" and authenticated "Log Out".
  - **Hero Greeting**: Personalized greeting banner (`Good to see you, {userName}`) accompanied by an atmospheric landscape SVG silhouette and motto (`DISCIPLINE CREATES FREEDOM`).
  - **2×2 Bento Grid**:
    - *Your Journey*: Real-time project, challenge, and completion metrics derived from live backend data.
    - *Current Streak*: Fire emblem, 7-day activity progression pips, and consistency quote.
    - *Continue Building*: Active project card featuring woodcut emblem, description, progress bar, and direct navigation.
    - *Today's Quest*: Daily challenge card offering structured learning objectives and +50 XP reward trigger.
  - **Sidebar**: Quick navigation links paired with an inspirational quote and rune emblem.

### 3. Learner Profile Dossier & Mandatory Onboarding
- Rebuilt `Profile.jsx` and `Profile.css`:
  - **Profile Requirement Warning Banner**: Prominent warning displayed when a learner has not created a profile, stating that goals and learning preferences are required before generating projects.
  - **Identity & Progression Dossier (Left Column)**: User initial avatar, experience tier badge, XP progression track (`0 / 700 XP`), earned achievement emblems (`First Step`, `Streak 7`, `Pioneer`, `Builder`), and personal motto.
  - **Learning Preferences Form (Right Column)**: Goal textarea, target completion date with calendar picker integration (native duplicate calendar icon suppressed via CSS), available hours per day, experience level, difficulty preference, assistance preference, and learning style.
  - **View vs. Edit Mode**: Toggling between read-only dossier and active editing with instant validation and update persistence.

### 4. Projects Explorer & Build Journey Map
- Rebuilt `Projects.jsx` and `Projects.css`:
  - **Filter Navigation**: Quick category tabs for `All Projects`, `In Progress`, and `Completed` with real-time count badges.
  - **Live Search**: Client-side search input filtering projects dynamically by title or description.
  - **Project Cards Grid**: Responsive grid displaying project status tags, title, description, challenge completion ratio (`completed / total`), progress bar, and direct navigation to `/projects/:id`.
  - **Quick Action & Empty State**: "New Territory" dashed action card and empty state with compass icon for generating new projects.

### 5. Backend User Resolution & Authentication Endpoint
- Added `GET /auth/me` endpoint in `backend/src/routes/auth.routes.js` to return authenticated user details (`name`, `email`, `role`).
- Updated `backend/src/services/profile.service.js` to query the Prisma `User` table when learner profiles are retrieved, ensuring real user names are returned rather than fallback placeholders.

### 6. Clean Code Craftsmanship & Anti-Robotic Refactoring
- Systematically audited and cleaned all frontend files:
  - Removed robotic section divider comments (`// -----------------------`, `/* ======================= */`).
  - Stripped artificial interview boilerplate comments and step annotations.
  - Ensured code is natural, self-documenting, and human-written across all pages and stylesheets.

## Architecture Overview

```text
React Client (Vite :5173)
    │
    ├── /auth ──▶ Auth.jsx (Unified Dark Stone Card, Login / Register Toggle)
    │
    ├── / (Protected) ──▶ Dashboard.jsx
    │                       ├── TopNav & Profile Dropdown (Logout, Profile link)
    │                       ├── Hero Greeting & Mountain Landscape
    │                       └── 2x2 Bento Grid (Journey, Streak, Active Project, Quest)
    │
    ├── /profile (Protected) ──▶ Profile.jsx
    │                              ├── Unonboarded Warning Banner
    │                              ├── Identity & Progression Dossier (XP Bar, Badges)
    │                              └── Learning Dossier Form (Calendar Picker, Preferences)
    │
    └── /projects (Protected) ──▶ Projects.jsx
                                   ├── Category Filter Tabs (All, In Progress, Completed)
                                   ├── Real-Time Search Filter
                                   └── Project Cards Grid with Challenge Progress Bars
```

## Lessons learned

### Grace Periods for Hover Dropdowns
Hover menus often close prematurely when the cursor crosses narrow padding gaps between the trigger button and the dropdown container. Adding an invisible `::before` pseudo-element bridge and a small debounce timeout (150–200ms) on `onMouseLeave` prevents flickering while keeping the interface responsive.

### Browser Calendar Indicator Normalization
HTML5 `<input type="date">` inputs render native calendar picker indicators that conflict with custom SVG action buttons. Using `input[type="date"]::-webkit-calendar-picker-indicator { display: none !important; }` allows seamless custom button triggers while using `input.showPicker()` for the native date selection modal.

### Code Readability Over Comment Noise
Over-commenting with divider banners and obvious explanations makes code look machine-generated and harder to scan. Writing expressive variable names, modular functions, and idiomatic React hooks makes code inherently self-documenting and clean.

## Current status updated

The platform features a complete, highly polished frontend with a unified dark stone and frontier parchment aesthetic. Authentication, Dashboard, Profile Dossier, and Projects Explorer are fully functional, resilient, and connected to the backend.

Current next step:
**Redesign the single Project Roadmap page (`Project.jsx`) and Monaco Challenge Workspace (`SolveChallenge.jsx`) to align with the new design system.**

---

# Day 12 — Monaco Multi-Language Studio, Real-Time Struggle Telemetry, Direct Workspace Navigation, and Comprehensive About Architecture

## Where we were before

In Day 11, we overhauled the platform's visual design system, introduced the dark stone and parchment theme, rebuilt the Expedition Dashboard with interactive bento cards, and redesigned the Learner Profile dossier. However:
1. The Monaco Editor in `SolveChallenge.jsx` was hardcoded to JavaScript, with buttons wrapping awkwardly below challenge objectives.
2. The project roadmap navigated to an intermediate `Challenge.jsx` preview page before reaching the code workspace, creating unnecessary friction.
3. The dashboard's "Help Requests" metric in the Journey card was a hardcoded static placeholder (`5`) rather than reflecting real database telemetry.
4. The dashboard sidebar had unfinished placeholder links (`Quests`, `Leaderboard`, `Community`) that distracted from core engineering workflows.
5. The top navigation had a redundant "Discover" link that simply looped back to `/projects` rather than explaining what the platform does, how it works, and its core functions.

## What changed in this phase

### 1. Monaco Editor Multi-Language Studio & Workspace Subbar Redesign
- **Multi-Language Selector**: Added a language selection dropdown directly to the workspace action bar supporting **JavaScript**, **Python**, and **Java**.
- **Dynamic Syntax & Autocomplete**: Bound `<Editor language={selectedLanguage} />` dynamically so Monaco's tokenizers, autocompletion engine, and syntax highlighting adapt in real time to the selected language.
- **Dedicated Subbar Architecture**: Re-engineered `.solve-subbar` in `SolveChallenge.jsx` and `SolveChallenge.css`:
  - Left side displays the challenge title, milestone badge, difficulty indicator, and completion status, with learning objectives arranged directly underneath.
  - Right side groups the language selector, **Reset Buffer**, and **Submit Solution** buttons with `flex-wrap: nowrap` and `flex-shrink: 0`, ensuring actions never wrap awkwardly below the objectives.
  - Cleaned up `.editor-pane` so the left workspace exclusively hosts the Monaco Editor at 100% height and width.

### 2. Direct Challenge Navigation & Deprecation of Preview Page
- **Frictionless Roadmap**: Updated the challenge card `onClick` handler in `Project.jsx` to navigate directly to the workspace route: `/projects/${projectId}/challenges/${challenge.id}/solve`.
- **Codebase Cleanliness**:
  - Permanently deleted `frontend/src/pages/Challenge.jsx`.
  - Removed `import Challenge from "./pages/Challenge"` and its obsolete `/project/:projectId/challenges/:challengeId` route from `App.jsx`.

### 3. Real-Time Help Requests Telemetry & Backend Aggregation
- **Database Telemetry Aggregation**: Implemented `getUserTotalHelpRequests(userId)` in `backend/src/repositories/challenge.respository.js`:
  - Queries `ChallengeHelp` records for types `HINT`, `PSEUDOCODE`, and `SOLUTION` linked to user attempts.
  - Concurrently aggregates `hintsUsed`, `pseudocodeUsed`, and `solutionUsed` counters across all `ChallengeAttempt` records.
  - Returns `Math.max(count, countFromAttempts)` ensuring 100% data consistency regardless of attempt state.
- **Service & API Endpoints**:
  - Added `getUserHelpCountService(userId)` in `challenge.help.service.js`.
  - Added `getUserHelpCountController` in `challengeHelp.controller.js` returning `{ count }`.
  - Mounted authenticated routes `GET /api/help/count` and `GET /api/challenges/help/count` in `challengeHelp.routes.js`.
- **Live Dashboard Integration**:
  - Exported `getHelpRequestsCount()` in `frontend/src/services/requestHelp.api.js`.
  - Connected `helpRequestsCount` state to `Dashboard.jsx`, replacing the hardcoded `5` with real-time database counts fetched on load.

### 4. Dashboard Sidebar Streamlining
- Removed placeholder links (**Quests**, **Leaderboard**, and **Community**) from the sidebar in `Dashboard.jsx`.
- Cleaned up unused icon imports (`Shield`, `Users`, `Sparkles`).
- Kept the sidebar strictly focused on active developer tools: **Overview**, **Projects**, and **Challenges**, with the inspirational quote pinned cleanly at the bottom.

### 5. Platform "About" Architecture & Navigation Overhaul
- **Navbar Replacement**: Replaced "Discover" in the top navigation of `Dashboard.jsx`, `Projects.jsx`, and `Project.jsx` with **About**, linking to `/about`.
- **Dedicated About Experience (`About.jsx`, `About.css`)**:
  - Built a comprehensive, beautifully styled landing page at `/about` guarded by `ProfileGuard`.
  - **What is Build With Me**: Explains the core philosophy—moving past passive tutorial consumption into active, synaptic mental model construction through real-world building.
  - **What Does It Do**: Highlights project decomposition, live Monaco studio, tiered AI assistance, automated code validation, and dynamic milestone generation.
  - **How Does It Work**: Detailed 5-stage interactive workflow (Profile Calibration → Project Generation → Monaco Coding Workspace → Contextual AI Assistance → Submission & Progression).
  - **Functions & Features**: Technical breakdown of the multi-language code runner, real-time struggle analytics, and session-guarded persistence.
  - **Call to Action**: Direct navigation to explore projects or return to the dashboard.

## Architecture Overview

```text
React Client (Vite :5173)
    │
    ├── /about (Protected) ──▶ About.jsx (What it is, What it does, How it works, Features)
    ├── / (Protected) ──▶ Dashboard.jsx (Real-time Help Requests, Cleaned Sidebar)
    ├── /projects/:id ──▶ Project.jsx (Direct link to /solve)
    │
    └── /projects/:id/challenges/:id/solve ──▶ SolveChallenge.jsx
            │
            ├── Monaco Editor Studio (JavaScript / Python / Java Selector)
            ├── Subbar Actions (Reset Buffer, Submit Solution)
            ├── Objectives Row (Under Title, Non-wrapping Action Row)
            └── Progressive AI Help Drawer (Hints, Pseudocode, Solution)
                    │
                    └── Telemetry Sync ──▶ GET /api/help/count (Real-time count on Dashboard)
```

## Lessons learned

### Preserving Layout Integrity with Non-Wrapping Flex Actions
When placing dynamic content (such as multiline learning objectives) in header subbars next to action buttons, failing to apply `flex-shrink: 0` and `white-space: nowrap` can cause buttons to wrap awkwardly underneath the text on smaller or dynamic displays. Separating titles and objectives into a vertical container on the left while fixing actions on the right maintains visual hierarchy and usability.

### Multi-Language State Binding in Monaco Editor
Monaco requires the `language` prop to match exact identifier keys (`javascript`, `python`, `java`). When the language selector changes, dynamically rebinding this prop seamlessly triggers Monaco's internal language worker without destroying the active buffer or losing cursor position.

### Live Telemetry vs. Hardcoded Placeholders
Displaying hardcoded metrics in dashboard bento cards undermines user trust. Exposing lightweight aggregate endpoints (`_sum` + `count`) in Prisma allows the frontend to display authentic live telemetry with minimal database overhead.

## Current status updated

The platform provides a cohesive, end-to-end hands-on engineering environment. The Monaco workspace supports multiple languages with direct roadmap navigation, live help requests update across the dashboard in real time, and the platform's core purpose and capabilities are documented in the new About section.

Current next step:
**Overhaul loading animations with theme tokens, streamline dashboard cards layout to full width, add project abandonment workflows, and build a dedicated Challenges Hub.**

---

# Day 13 — Loading Animation Theming, Dashboard Layout Optimization, Project Abandonment Workflow, and Dedicated Challenges Hub

## Where we were before

In Day 12, we completed the Monaco Multi-Language Studio, direct challenge workspace routing, live struggle telemetry on the dashboard, and built the comprehensive About landing experience. However, several interaction and layout friction points remained:
1. **Unstyled Loading State**: Loading indicators in `LoadingAnimation.jsx`, `loadingAnimation2.jsx`, and `ProfileGuard.jsx` used hardcoded dark grey backgrounds (`#0d1117`) and default fonts, disconnecting the user from the Nordic stone aesthetic during route transitions.
2. **Dashboard Layout Crowding**: The dashboard's 2-column cards grid displayed cards side-by-side. When streak and daily quest cards were removed, the two remaining cards (`Your Journey` and `Continue Building`) were squeezed into awkward columns instead of spanning the full width from left to right.
3. **Completed Projects in Continue Building**: The `Continue Building` card had a fallback that selected `projects[0]` even when all of its challenges were completed, displaying stale finished projects instead of strictly focusing on active in-progress builds.
4. **No Project Abandonment Workflow**: Learners had no mechanism to mark projects as abandoned or archive stalled builds from their active roadmap.
5. **Redundant Challenges Navigation**: Both "Projects" and "Challenges" in the navigation bar navigated to `/projects`, creating cognitive dissonance and confusing users who expected a dedicated challenges portal.

## What changed in this phase

### 1. Loading Animation UI Theming & Font Alignment
- Themed `LoadingAnimation.jsx`, `loadingAnimation2.jsx`, and `ProfileGuard.jsx`:
  - Replaced hardcoded `#0d1117` background with the unified stone theme surface token (`var(--bg-primary, #111312)`).
  - Aligned typography with the design system font tokens (`var(--font-display)` for loading messages and `--font-sans`).
  - Styled SVG loading spinners with the warm parchment (`#D8C7A5`) and restrained crimson (`#A43B2E`) palette.

### 2. Dashboard Layout Optimization & In-Progress Filtering
- **Vertical Hierarchy & Full Width**:
  - Positioned **Your Journey** on top, followed directly by **Continue Building** underneath.
  - Converted `.cards-grid` into a full-width flex column (`flex-direction: column; width: 100%`) and removed the `max-width: 1400px` boundary on `.dashboard-main`.
  - Both cards now span seamlessly from left to right across all screen widths.
- **Strict In-Progress Filtering**:
  - Filtered out completed projects (`status === 'COMPLETED'` or all challenges finished) and abandoned projects.
  - Rendered individual progress bars and metric counters for every active in-progress project.
  - Added a graceful empty state when all projects are completed (*"All caught up! No projects currently in progress."*) with quick links to explore new projects.
- **Navigation Bar Cleanup**:
  - Removed the redundant search icon button from the dashboard top navigation bar to keep top-level actions streamlined and minimal.

### 3. Project Abandonment Workflow in Projects Explorer
- **API Integration**:
  - Added and exported `abandonProject(projectId)` in `frontend/src/services/project.api.js`, connecting directly to the existing backend endpoint `PATCH /api/project/:id/status` with `{ status: "ABANDONED" }`.
- **Card Action & Propagation Safety**:
  - Added an **Abandon** button (`.project-abandon-card-btn`) on in-progress project cards in `Projects.jsx`.
  - Applied `e.stopPropagation()` so clicking "Abandon" opens the confirmation modal without accidentally navigating into the project roadmap.
- **Themed Confirmation Modal**:
  - Built an atmospheric modal with backdrop blur (`.abandon-modal-overlay`), warning icon, project title highlight, and clear explanation of consequences.
  - Provided **Keep Building** (cancel) and **Yes, Abandon Project** (destructive confirm) actions with loading state management.
- **Filter Tabs & Statuses**:
  - Added an **Abandoned ({count})** filter tab to `Projects.jsx`.
  - Styled `.status-abandoned` badges in muted crimson across both project cards and the single project roadmap view (`Project.jsx`).

### 4. Dedicated Challenges Hub Architecture (`/challenges`)
- **New Page Component (`Challenges.jsx` & `Challenges.css`)**:
  - Built a dedicated problem-solving hub providing a unified stream of all milestone coding challenges across the learner's active and archived projects.
- **Featured Next Active Challenge Hero**:
  - Automatically identifies the next pending challenge from active projects.
  - Displays parent project context, difficulty badge (`EASY`, `MEDIUM`, `HARD`), learning objectives, and a prominent **"Solve Challenge →"** button that navigates directly into the Monaco editor (`/projects/:projectId/challenges/:challengeId/solve`).
- **Real-Time Multi-Dimensional Filtering**:
  - **Status Tabs**: *All*, *In Progress*, and *Completed*.
  - **Difficulty Filter**: *All Levels*, *Easy*, *Medium*, and *Hard*.
  - **Project Selector**: Dropdown to inspect challenges filtered by specific parent project.
  - **Live Search**: Instant keyword search across challenge titles, descriptions, and parent project names.
- **Challenge Cards Grid**:
  - Cards display project badges, milestone number, difficulty tags, learning objectives, status indicators, and direct solver links.
- **Application-Wide Navigation Update**:
  - Registered `/challenges` in `App.jsx` guarded by `<ProfileGuard>`.
  - Updated navbar and sidebar links in `DashBoard.jsx`, `Projects.jsx`, `Project.jsx`, and `About.jsx` from `/projects` to `/challenges`.

## Architecture Overview

```text
React Client (Vite :5173)
    │
    ├── / (Protected) ──▶ Dashboard.jsx
    │                       ├── Full-Width Stacked Cards (Your Journey on top, Continue Building below)
    │                       └── Continue Building (Strictly In-Progress Projects Filter)
    │
    ├── /projects (Protected) ──▶ Projects.jsx
    │                               ├── Abandon Project Action & Confirmation Dialog
    │                               └── Abandoned Filter Tab & Crimson Status Badges
    │
    ├── /challenges (Protected) ──▶ Challenges.jsx
    │                                 ├── Next Active Challenge Hero Banner (Direct /solve link)
    │                                 ├── Multi-Dimensional Filtering (Status, Difficulty, Project, Search)
    │                                 └── Unified Milestone Cards Grid
    │
    ├── /about (Protected) ──▶ About.jsx (Updated Nav)
    │
    └── /projects/:id/challenges/:id/solve ──▶ SolveChallenge.jsx (Monaco Workspace)
```

## Lessons learned

### Safe Destructive Action Triggers Inside Navigable Cards
When an entire card is a clickable navigation target (`onClick={() => navigate(...)}`), placing secondary or destructive action buttons inside it requires strict event management. Calling `e.stopPropagation()` on the button click handler prevents accidental routing, allowing confirmation modals to be safely mounted.

### Flattening Relational Data for Specialized Views
Rather than requiring separate database endpoints for specialized pages like the Challenges Hub, leveraging relational includes (`include: { challenges: true }` in `getProjects()`) and flattening them client-side (`projects.flatMap(...)`) minimizes backend round-trips, keeps API surfaces compact, and ensures immediate responsiveness when filtering.

### Layout Resilience with Explicit Flex Column Directives
Relying on multi-column CSS grids for dynamic cards can cause unwanted layout shifts when elements are conditionally hidden or removed. Transitioning `.cards-grid` to a vertical flex column with `width: 100%` ensures cards consistently span the full viewport length from left to right without empty gaps.

## Current status updated

The platform now features a dedicated Challenges Hub for direct milestone solving, full-width responsive dashboard cards focusing on active builds, an intuitive project abandonment flow, and themed loading transitions across all pages.

---

# Day 14 - Mobile-First Responsiveness & Ergonomic Cross-Device Navigation

## Summary

Implemented a comprehensive mobile responsiveness update across all 8 pages of the application (`Dashboard`, `Projects`, `Project Roadmap`, `Challenges Hub`, `Solve Challenge`, `About`, `Profile`, and `Auth`). Overhauled the top navigation bar from a hidden mobile state to an ergonomic two-row layout, added media queries for tablet and mobile breakpoints (`768px`, `640px`, and `480px`), and ensured touch-friendly sizing across buttons, cards, and input fields.

## What was built

### 1. Unified Mobile Top Navigation
- **Problem**: Previously, `.nav-links { display: none; }` hid main navigation on screens under `768px`, stranding mobile users on secondary pages.
- **Solution**: Implemented a responsive two-row topbar across all pages:
  - **Row 1**: Brand logo/title and Profile dropdown chip.
  - **Row 2**: Full-width horizontal navigation tabs (`Home | Projects | Challenges | About`) with smooth horizontal scrolling (`overflow-x: auto`), active indicator pills, and comfortable touch padding.

### 2. Page-by-Page Mobile Optimizations
- **Global (`index.css`)**:
  - Enforced `html, body { max-width: 100%; overflow-x: hidden; }` to eliminate unwanted horizontal viewport shifts.
- **Dashboard (`DashBoard.css`)**:
  - Scaled hero titles from `40px` down to `28px / 24px`.
  - Transformed the 4-column Journey stats row into a balanced 2x2 grid (`repeat(2, 1fr)`) on `< 640px` with individual card styling.
  - Adapted the *Continue Building* list with compact thumbnail icons (`42px`) and legible progress bars.
  - Allowed sidebar navigation links to scroll horizontally with hidden scrollbars.
- **Projects Explorer (`Projects.css`)**:
  - Stretched the `+ New Project` button full-width on mobile viewports for easy thumb access.
  - Allowed category filter tabs to scroll horizontally without wrapping.
  - Switched the projects grid to a single column (`1fr`) on `< 640px`, eliminating `minmax(340px)` horizontal card overflow.
  - Sized the project abandonment modal for small mobile viewports with full-width stacked action buttons.
- **Project Details & Roadmap (`Project.css`)**:
  - Scaled the project hero title and wrapped metadata badges cleanly.
  - Stacked the *Generate More Challenges* banner with full-width adaptive button.
  - Aligned challenge milestone cards to `flex-start` with compact index emblems (`36px`) and wrapping objective pills.
- **Challenges Hub (`Challenges.css`)**:
  - Wrapped summary metric pills into a 3-column responsive grid.
  - Stacked the featured Next Active Challenge banner with a full-width solver button.
  - Stacked toolbar search inputs, project selectors, status tabs, and difficulty chips into full-width mobile controls.
  - Converted the challenge cards grid into a single column on `< 640px`.
- **Solve Challenge Monaco Workspace (`SolveChallenge.css`)**:
  - Transformed the workspace layout from horizontal side-by-side flex to vertical stacking (`flex-direction: column`) on tablet and mobile viewports.
  - Reorganized the subbar actions (Language selector, Reset code, Run/Submit) into a responsive grid.
  - Constrained Monaco editor height to `400px` (tablet) and `350px` (mobile) to maintain drawer visibility.
  - Placed the AI Mentorship drawer beneath the editor with full width and touch-friendly hint, pseudocode, and solution buttons.
- **About (`About.css`)**:
  - Collapsed 3-column and 2-column feature grids (`.about-card-grid`, `.features-showcase-grid`, `.tech-matrix-grid`) to a single column on tablet and mobile screens.
  - Stacked workflow step badges above step text on `< 520px`.
  - Converted the call-to-action banner to full-width stacked buttons.
- **Profile (`Profile.css`)**:
  - Switched the layout grid to a single column on `< 860px`.
  - Stretched the Edit Profile toggle, Save, and Cancel buttons to 100% width on `< 600px`.
  - Formatted badges in an accessible 2-column grid.
- **Auth (`Auth.css`)**:
  - Reduced card padding to `24px 18px` on screens under `480px`.
  - Set input font size to `16px` to prevent automatic zooming on iOS Safari when tapping form inputs.

## Lessons learned

### Mobile Topbars Need Navigation Preservation
Hiding desktop navigation links on mobile (`display: none`) without providing an accessible alternative breaks core user flows. Converting top navigation into a two-row flex container (Row 1 for brand & profile, Row 2 for full-width navigation tabs) preserves complete navigational autonomy on small screens without requiring complex hamburger overlay dependencies.

### Form Input Font Sizing on Mobile Safari
Setting input font size below `16px` triggers automatic viewport zoom in iOS Safari when an input field receives focus, which can distort layout alignment. Setting `font-size: 16px` inside mobile media queries prevents this behavior.

### Responsive Grids with MinMax Overflow Risks
Using CSS grid rules like `grid-template-columns: repeat(auto-fill, minmax(340px, 1fr))` causes horizontal overflow on screens smaller than 360px (such as iPhone SE at 375px with 16px padding = 343px available). Explicitly setting `grid-template-columns: 1fr` within `@media (max-width: 640px)` guarantees cards scale fluidly without clipping.

## Current status updated

The platform is fully mobile-responsive across all primary and secondary routes, verified through automated production builds and ready for multi-device testing.

Current next step:
**Set up automated unit and integration tests for API services, configure Docker containerization, and prepare production deployment manifests.**
