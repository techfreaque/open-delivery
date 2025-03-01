import { z } from "zod";

// Define schema for environment variables
const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET_KEY: z.string().min(32),
});

export type Env = z.infer<typeof envSchema>;

export const validateEnv = (env: Record<string, string | undefined>): Env => {
  return envSchema.parse(env);
};
