/* eslint-disable node/no-process-env */
import { z } from "zod";

export const envSchema = z.object({
  NEXT_PUBLIC_FRONTEND_APP_URL: z.string(),
  NEXT_PUBLIC_BACKEND_PROD: z.string(),
  NEXT_PUBLIC_BACKEND_DEV: z.string(),
  NEXT_PUBLIC_BACKEND_TEST: z.string(),
});

export type EnvFrontend = z.infer<typeof envSchema>;

const validateEnv = (): EnvFrontend => {
  return envSchema.parse({
    // explicitly use env variables so next.js can replace them
    NEXT_PUBLIC_FRONTEND_APP_URL: process.env.NEXT_PUBLIC_FRONTEND_APP_URL,
    NEXT_PUBLIC_BACKEND_PROD: process.env.NEXT_PUBLIC_BACKEND_PROD,
    NEXT_PUBLIC_BACKEND_DEV: process.env.NEXT_PUBLIC_BACKEND_DEV,
    NEXT_PUBLIC_BACKEND_TEST: process.env.NEXT_PUBLIC_BACKEND_TEST,
  });
};

// Export validated environment for use throughout the application
export const envClient = validateEnv();
