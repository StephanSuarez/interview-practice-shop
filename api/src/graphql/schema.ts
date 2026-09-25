import { createSchema, createYoga } from 'graphql-yoga';
import { GraphQLError } from 'graphql';
import { pool } from '../db';
import { HttpError } from '../errors';
import { userFromHeader, type AuthUser } from '../auth';
import { listProducts } from '../repos/products';
import { createOrderSchema } from '../routes/orders';
import * as orders from '../services/orders';

interface Context {
  user: AuthUser | null;
}

const typeDefs = /* GraphQL */ `
  type Product {
    id: Int!
    name: String!
    priceCents: Int!
    stock: Int!
  }

  type Order {
    id: Int!
    status: String!
    totalCents: Int!
    createdAt: String!
  }

  input OrderItemInput {
    productId: Int!
    quantity: Int!
  }

  type Query {
    products: [Product!]!
    myOrders: [Order!]!
  }

  type Mutation {
    createOrder(items: [OrderItemInput!]!): Order!
  }
`;

function requireUser(ctx: Context): AuthUser {
  if (!ctx.user) throw new GraphQLError('Unauthorized', { extensions: { code: 'UNAUTHENTICATED' } });
  return ctx.user;
}

// Yoga hides unknown errors as "Unexpected error." Re-throw our own as GraphQLErrors so clients see them.
function exposeHttpErrors(err: unknown): never {
  if (err instanceof HttpError) {
    throw new GraphQLError(err.message, { extensions: { code: 'BAD_REQUEST', http: { status: err.status } } });
  }
  throw err;
}

const resolvers = {
  Query: {
    products: () => listProducts(pool),
    myOrders: (_: unknown, __: unknown, ctx: Context) => orders.listOrders(requireUser(ctx).id),
  },
  Mutation: {
    createOrder: async (_: unknown, args: { items: orders.CreateOrderItem[] }, ctx: Context) => {
      const user = requireUser(ctx);
      const parsed = createOrderSchema.safeParse(args);
      if (!parsed.success) {
        throw new GraphQLError('Invalid input', { extensions: { code: 'BAD_USER_INPUT' } });
      }
      return orders.createOrder(user.id, parsed.data.items).catch(exposeHttpErrors);
    },
  },
  Order: {
    createdAt: (o: { createdAt: Date }) => o.createdAt.toISOString(),
  },
};

export const yoga = createYoga<{}, Context>({
  schema: createSchema({ typeDefs, resolvers }),
  context: ({ request }) => ({ user: userFromHeader(request.headers.get('authorization')) }),
  graphiql: true,
});
