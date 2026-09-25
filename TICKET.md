# SHOP-118: POST /orders returns an empty body, API restarts

**Reported by:** Mobile team + on-call

1. The mobile app says `POST /orders` answers `201` but the body is `{}`, so it can't
   show the order number. The order does appear later in `GET /orders`.
2. On-call saw the API process restart several times today, around the time customers
   tried to buy products that were out of stock.

**Done when:** the endpoint returns the created order, errors return proper status
codes, and tests are green.
