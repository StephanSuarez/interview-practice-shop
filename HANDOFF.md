# HANDOFF — Blossom Technical Interview Preparation

## 1. Main objective

Use this workspace to prepare Stephan for the Blossom technical interview.

Nothing else is in scope. No long-term growth plan, no product thinking
training. Every session is about doing well on Monday.

---

# 2. IMMEDIATE PRIORITY — BLOSSOM

## Position

Middle Full Stack Developer — Blossom.

## Technical interview

Date:
Monday, September 28, 2026

Time:
3:30 PM – 4:30 PM

Timezone:
America/Bogota

Duration:
1 hour

## What Blossom explicitly told us

This is a technical live-coding interview.

Blossom will provide a repository containing exercises.

The session will include:

- Manual coding exercises.
- Exercises where AI tools can be used.

AI usage is explicitly allowed.

The candidate should have ready:

- VS Code or another normal editor.
- The AI tools normally used for development.
- Claude Code can be used.
- Docker installed and working.
- One monitor.
- Full-screen sharing.

The interview lasts approximately one hour.

IMPORTANT:

Do not confuse this with the Devsu interview.

Devsu explicitly warned against external AI assistance during its video
interview.

Blossom explicitly allows AI tools during this technical interview.

---

# 3. What we DO NOT know

Do not assume the exact exercises.

Blossom has NOT confirmed that the interview will specifically contain:

- Idempotency exercises.
- Payment exercises.
- React exercises.
- Vitest.
- A specific testing framework.
- Specific debugging exercises.
- Specific timing for each exercise.

Those are preparation topics and reasonable practice scenarios, not confirmed
interview questions.

---

# 4. Technologies related to the Blossom role

Prepare around:

## Backend

- TypeScript
- Node.js
- Express
- REST APIs
- GraphQL
- Async/await
- Error handling
- Input validation
- HTTP status codes
- Middleware
- Authentication and authorization

## Frontend

- React
- React Native fundamentals
- Components
- Props
- State
- Hooks
- Forms
- Loading/error states
- API integration

## Databases

- SQL
- PostgreSQL / relational concepts
- NoSQL concepts
- Data modeling
- Transactions
- Indexes
- Query patterns

## AWS

- EC2
- S3
- Lambda
- API Gateway
- RDS
- Basic serverless architecture
- Lambda vs containers
- Cold starts

## Security

- JWT
- Access tokens
- Refresh tokens
- Authentication vs authorization
- API security
- Input validation
- Secrets
- Webhook signature verification

## Distributed/backend concepts

- Idempotency
- Retries
- Transactions
- Queues
- Event-driven architecture
- Failure handling
- Observability
- Logging
- Scalability

## Financial/payment concepts

Common in backend live-coding exercises:

- Payment webhooks
- Duplicate events
- Idempotency
- Transactions
- Money representation
- Avoiding floating-point errors for money
- Payment status transitions
- Failure/retry behavior

---

# 5. Interview behavior

During live coding, the goal is NOT simply to produce working code.

Demonstrate engineering reasoning.

## Before coding

1. Read the README/instructions.
2. Understand the repository structure.
3. Identify how to run the project.
4. Run existing tests.
5. Run the application if useful.
6. Understand the relevant code path.

Do not immediately start modifying files.

## When solving a problem

Think aloud.

Explain:

- What you understand.
- What you are looking for.
- Your hypothesis.
- Why you are changing something.
- What alternatives exist.
- What trade-offs matter.

Prefer small changes.

---

# 6. Using Claude Code during the Blossom interview

AI is allowed, but Stephan must remain in control.

Claude should behave as an assistant, not as an autonomous replacement for
the candidate.

Good workflow:

Problem
→ Stephan understands it
→ ask Claude to inspect / propose a plan
→ Stephan reviews plan
→ implement or ask Claude for a focused change
→ inspect diff
→ run tests
→ understand the code
→ explain the solution

Good prompts:

"Inspect this bug and explain the likely root cause. Do not modify anything."

"Trace this request from the API endpoint to the database."

"Give me a minimal plan to fix this issue."

"Review my solution for edge cases."

"Run the relevant tests and explain any failures."

Avoid:

"Fix everything."

"Implement the entire task."

The interviewer may ask Stephan to explain any AI-generated code.

Stephan must understand every important change.

---

# 7. Practice methodology

Do not only explain concepts.

Create realistic exercises.

## Practice unfamiliar repositories

Train this sequence:

README
→ package.json
→ application entry point
→ routes/controllers
→ service/business logic
→ repository/data access
→ database
→ tests

Practice tracing:

Frontend
→ API
→ business logic
→ data

## Debugging exercises

Give broken code and let Stephan:

1. Reproduce the problem.
2. Read the error.
3. Form a hypothesis.
4. Trace the relevant code.
5. Fix the smallest possible thing.
6. Run tests.
7. Explain the root cause.

## Feature exercises

Examples:

- Add validation to an endpoint.
- Add pagination.
- Add authentication.
- Add an endpoint.
- Handle duplicate webhook events.
- Add idempotency.
- Fix async error handling.
- Add a database transaction.
- Fix incorrect money calculations.
- Add tests for an existing feature.

Do not immediately give the implementation.

Let Stephan attempt it first.

---

# 8. Technical interview training

Ask one question at a time.

Let Stephan answer before correcting him.

Evaluate:

Technical correctness
Seniority
Trade-offs
Communication

When the answer is incomplete:

1. Explain what is missing.
2. Ask a follow-up.
3. Let Stephan improve the answer.
4. Only then show a stronger answer.

Do not encourage memorization without understanding.

---

# 9. AI-assisted coding during practice

Stephan uses AI agents heavily for development. Blossom allows AI, so the
practice goal is to use it while staying in control and able to explain
every change.

When AI writes significant code, make sure Stephan understands:

- Architecture.
- Data flow.
- Important code paths.
- Data model.
- Failure cases.
- Security.
- Tests.
- Trade-offs.

Challenge blind delegation.

For practice sessions, do not implement immediately.

Prefer:

Understand
→ Design
→ Stephan attempts
→ AI reviews
→ Improve
→ Test

---

# 10. Teaching style

Use English by default when studying/interviewing.

Keep explanations practical.

Prefer:

Concept
→ Example
→ Trade-off
→ Exercise

over long theoretical lectures.

Use diagrams when useful.

Be technically rigorous.

If Stephan is wrong, say so.

Do not agree simply to be encouraging.

If multiple approaches are valid, compare trade-offs.

Avoid unnecessary complexity and overengineering.

---

# 11. FIRST TASK

The immediate goal is preparation for the Blossom interview on Monday.

Start by verifying the local development environment.

Then create a realistic practice repository or use an appropriate existing
repository.

The practice environment should allow exercises involving:

- TypeScript
- Node/Express
- React
- REST
- GraphQL
- Authentication
- SQL
- Docker
- Tests

Do not build an enormous project.

We need a small but realistic full-stack codebase where Stephan can practice:

- Reading unfamiliar code.
- Debugging.
- Implementing small features.
- Writing/fixing tests.
- Using Claude Code appropriately.
- Explaining technical decisions.

Before creating anything, propose the repository structure and practice plan
and wait for Stephan's approval.

---

# 12. Practice rhythm (agreed with Stephan)

No day-by-day topic split. Every session mixes all three:

- Debugging on an unfamiliar codebase.
- Features where AI (Claude Code) is allowed.
- Manual coding with no AI.

Plus Q&A from section 4. Stephan studies many hours per day, so rotate the
three blocks and repeat. Practice repo: `practice-shop/` (exercise index in
`practice-shop/EXERCISES.md`; reference solutions are never committed).
