# SHOP-112: Some orders are charged one cent less

**Reported by:** Finance

Reconciliation found orders whose `total_cents` is one cent lower than the sum of
their item lines. Example from support: a customer bought one "Pour-over filter"
($1.15) and the order total was $1.14. Most orders look fine.

CI is green.

**Done when:** totals always equal the sum of item lines, and a test proves it.
