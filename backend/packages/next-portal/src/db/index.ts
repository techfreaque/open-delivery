import { PrismaClient } from "@prisma/client";

import { env } from "../env/env";

// import { env } from "../env/env";

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
