import "server-only";

import { z } from "zod";

export const envSchema = z.object({
  NEXT_PUBLIC_FRONTEND_APP_URL: z.string(),
  JWT_SECRET_KEY: z.string(),
  DATABASE_URL: z.string(),
  NODE_ENV: z.string(),
  EMAIL_FROM: z.string(),
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.string(),
  EMAIL_USER: z.string(),
  EMAIL_PASS: z.string(),
  DEBUG_TESTS: z.string().optional(),
  TEST_SERVER_URL: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export const validateEnv = (): Env => {
  return envSchema.parse(process.env);
};

// Export validated environment for use throughout the application
export const env = validateEnv();
