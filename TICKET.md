# SHOP-144: Customers can cancel pending orders

**Product:** customers want to cancel an order before paying.

**Required:** `POST /orders/:id/cancel`
- Only the owner can cancel. Someone else's order is `404`.
- Only `pending` orders can be cancelled. Anything else is `409`.
- Cancelling puts the items' quantities back in stock.
- Returns `200` with the updated order.

Tests are in `api/tests/cancel-order.test.ts` and currently fail.

**Be ready to explain:** what happens if a payment webhook for this order arrives while
the cancel is running, and how your code prevents a paid order from being cancelled.
