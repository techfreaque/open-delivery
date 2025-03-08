import { PrismaClient } from "@prisma/client";

import { env, validateEnv } from "../env";

validateEnv();
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

// Only cache the prisma instance in development
if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
