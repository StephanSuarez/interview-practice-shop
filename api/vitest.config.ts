import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Resolve packages like Node does. Otherwise Vite picks graphql's "development" build for our code
  // while graphql-yoga gets the normal build, and `instanceof GraphQLError` fails across the two copies.
  ssr: { resolve: { conditions: ['module', 'node'] } },
  test: {
    env: {
      DATABASE_URL: 'postgres://shop:shop@localhost:5433/shop_test',
      JWT_SECRET: 'test-jwt-secret',
      WEBHOOK_SECRET: 'test-webhook-secret',
    },
    setupFiles: ['./tests/setup.ts'],
    // All test files share one database, so run them one at a time.
    fileParallelism: false,
  },
});
