# Exercises

Each exercise lives on its own branch with a `TICKET.md` at the repo root.

```bash
git switch bug/money-rounding     # start
cat TICKET.md
git switch main                   # when done (commit or `git stash` first)
```

**Do not** run `git diff main`, `git log -p` or read commits on exercise branches.
That is reading the answer. On Monday you won't have it.

## How to work every exercise

1. Read the ticket. Restate the problem in one sentence, out loud.
2. Orient: README → package.json → entry point → route → service → repo → tests.
3. Reproduce (test, curl, or the UI) before changing anything.
4. Hypothesis → trace → smallest fix.
5. Add or fix a test that fails without your fix.
6. Run `npm test` and `npm run typecheck`.
7. Explain root cause, fix, and trade-offs in under a minute.

## Bugs (15–20 min each)

| Branch | Area | AI |
|---|---|---|
| `bug/money-rounding` | api | no |
| `bug/missing-await` | api | no |
| `bug/no-transaction` | api | allowed |
| `bug/order-leak` | api, security | no |
| `bug/list-not-refreshing` | web | no |

## Features (20–30 min each)

| Branch | Area | AI |
|---|---|---|
| `feat/idempotent-webhook` | api | allowed |
| `feat/pagination` | api + web | allowed |
| `feat/cancel-order` | api | allowed |
| `feat/graphql-order` | api | allowed |
| `feat/orders-error-state` | web | allowed |
| `feat/dockerize-api` | infra | allowed |

"AI allowed" means Claude Code as an assistant: ask it to inspect, trace, plan or review.
You must be able to explain every line it writes.

## Manual coding

`katas/` — 8 small functions, no AI. See `katas/README.md`.
