# practice-shop

Small shop: users log in, browse products, place orders. A payment provider
notifies us through a webhook.

- `api/` Express + TypeScript, REST and GraphQL, Postgres (plain SQL)
- `web/` React + Vite
- `katas/` standalone functions with tests

## Run

```bash
docker compose up -d          # Postgres on localhost:5433 (dbs: shop, shop_test)

cd api
npm install
npm run seed                  # demo@shop.test / password123
npm run dev                   # http://localhost:3000

cd web
npm install
npm run dev                   # http://localhost:5173 (proxies /api to :3000)
```

## Checks

```bash
npm test          # in api/, web/ or katas/ (api tests need Docker running)
npm run typecheck
```

## API

| Method | Path | Auth |
|---|---|---|
| POST | /auth/login | no |
| GET | /products | no |
| GET | /orders | Bearer |
| GET | /orders/:id | Bearer |
| POST | /orders | Bearer |
| POST | /webhooks/payments | HMAC `x-signature` |
| POST | /graphql | Bearer for orders |
