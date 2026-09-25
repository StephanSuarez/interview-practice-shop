# SHOP-125 [SECURITY]: Users can see other customers' orders

**Reported by:** Bug bounty

"I logged in with my account, opened `GET /orders/5`, then changed the id to 4 and
got an order that is not mine, with its items and total."

CI is green.

**Done when:** a user can only read their own orders, a test proves it, and you can
explain which status code you return for someone else's order and why.
