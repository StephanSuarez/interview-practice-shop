# SHOP-160: "My orders" hides API errors

**Reported by:** QA

When the API is down or returns 500, "My orders" says "No orders yet." That's wrong
and scares customers. There is also no feedback while orders are loading.

**Required** (in `web/`):
- A loading state while orders are fetched.
- An error message with a "Retry" button when the request fails. Retry fetches again.
- "No orders yet." only when the request succeeded and returned an empty list.

No tests are provided. Write them with Testing Library, mocking `fetch` like
`src/App.test.tsx` does.

**Be ready to explain:** why a missing `.catch()` on a promise inside `useEffect` is a
problem, and what happens if the user logs out while the request is still in flight.
