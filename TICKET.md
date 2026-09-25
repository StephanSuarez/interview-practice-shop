# SHOP-130: New order doesn't show up in "My orders"

**Reported by:** QA

After clicking "Place order", nothing changes in "My orders". The order was created:
it appears after reloading the page. No errors in the console.

Run it: `docker compose up -d`, then `npm run dev` in `api/` and in `web/`.

**Done when:** the new order appears immediately, and you can explain why it didn't.
Bonus: a test that fails without your fix.
