import { z } from "zod";

import { validateData } from "../utils/validation";

export const envSchema = z.object({
  NODE_ENV: z.string(),
  JWT_SECRET_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export const validateEnv = (): Env => {
  const { data, success, message } = validateData<Env>(
    // eslint-disable-next-line node/no-process-env
    process.env as unknown as Env,
    envSchema,
  );
  if (!success) {
    throw new Error(`Environment validation error: ${message}`);
  }
  return data;
};

// Export validated environment for use throughout the application
export const env = validateEnv();
