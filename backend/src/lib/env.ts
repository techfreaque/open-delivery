import { z } from "zod";

// Define environment schema with more flexible validation
export const envSchema = z.object({
  // Required in production, but provide a default for development
  JWT_SECRET_KEY: process.env.NODE_ENV === "production" 
    ? z.string()
    : z.string().optional().default("development-secret-key-not-for-production"),
  
  DATABASE_URL: z.string().optional(),
  // ... any other environment variables
});

export type Env = z.infer<typeof envSchema>;

export const validateEnv = (): Env => {
  return envSchema.parse(process.env);
};

// Export validated environment for use throughout the application
export const env = validateEnv();
