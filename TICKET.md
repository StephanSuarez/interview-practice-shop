# SHOP-155: GraphQL query for a single order with its items

**Context:** the mobile app uses GraphQL and needs an order detail screen.

**Required:**
```graphql
query {
  order(id: 1) {
    id status totalCents
    items { quantity unitPriceCents product { id name } }
  }
}
```
- Requires auth. Only the owner can read it. For others or unknown ids, return `null`
  for `order`, not an error.
- Reuse the existing service code. Don't duplicate the ownership rule.

No tests are provided. Write at least one, in `api/tests/graphql.test.ts`.

**Be ready to explain:** how many SQL queries your resolver runs for an order with 10
items, and what the N+1 problem is.
