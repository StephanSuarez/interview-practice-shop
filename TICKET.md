# SHOP-150: Paginate GET /orders

**Context:** some B2B accounts have thousands of orders. `GET /orders` returns all of
them, and the web app gets slow.

**Required:**
- `GET /orders` accepts a page size, default 20, max 100. Invalid values are `400`.
- The response lets the client ask for the next page, and tells it when there are no more.
- Newest first, and no order is skipped or repeated when new orders are created while the
  client is paging.
- The web app keeps working.

No tests are provided. Write them.

**Be ready to explain:** offset vs cursor pagination, which one you chose, and why. Also
which index supports your query.
