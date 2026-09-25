// ponytail: dev defaults so the repo runs with zero setup. Never ship defaults like these.
export const config = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL ?? 'postgres://shop:shop@localhost:5433/shop',
  jwtSecret: process.env.JWT_SECRET ?? 'dev-jwt-secret',
  webhookSecret: process.env.WEBHOOK_SECRET ?? 'dev-webhook-secret',
};
