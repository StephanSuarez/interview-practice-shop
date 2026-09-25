# SHOP-140: Make the payment webhook idempotent

**Context:** our payment provider delivers webhooks *at least once*. It retries when we
are slow or return a non-2xx, and it can send events out of order.

**Problems seen in production:**
- Orders with two `payments` rows for the same provider event (revenue counted twice).
- A late `failed` event overwrote an order that was already `paid`.

**Required:**
- The same `eventId` is processed at most once, **also under concurrent delivery**.
- Valid transitions only: `pending -> paid | failed`, `failed -> paid`. `paid` is final.
- Duplicates and ignored transitions still answer `200`, so the provider stops retrying.

New tests in `api/tests/webhooks.test.ts` describe the behavior and currently fail.

**Be ready to explain:** why an in-memory `Set` of seen ids is not enough, and what makes
your solution safe when two identical requests arrive at the same moment.
