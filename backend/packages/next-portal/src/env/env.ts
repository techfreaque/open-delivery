import { z } from "zod";

import { validateData } from "../api/api-response";

export const envSchema = z.object({
  NODE_ENV: z.string(),
  JWT_SECRET_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export const validateEnv = (): Env => {
  const { data, error } = validateData<Env>(
    // eslint-disable-next-line node/no-process-env
    process.env as unknown as Env,
    envSchema,
  );
  if (!data || error) {
    throw new Error(`Environment validation error: ${error}`);
  }
  return data;
};

// Export validated environment for use throughout the application
export const env = validateEnv();
