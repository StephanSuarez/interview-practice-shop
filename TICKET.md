# SHOP-121: Orders with no items and wrong stock

**Reported by:** Support

We found `pending` orders that have a total but zero or only some items. Stock for
some products is also lower than what was actually sold. It seems to happen when a
customer orders several products and one of them is out of stock: they get the
"out of stock" error, but something is left behind.

CI is green.

**Done when:** a failed order leaves no trace in the database, with a test that proves it.
