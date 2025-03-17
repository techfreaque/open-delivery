import { z } from "zod";

import { DatabaseProvider } from "@/client-package/types/types";
import { validateData } from "@/next-portal/api/api-response";

export const envSchema = z.object({
  NEXT_PUBLIC_FRONTEND_APP_URL: z.string(),
  NEXT_PUBLIC_BACKEND_URL: z.string(),
  JWT_SECRET_KEY: z.string(),
  DATABASE_PROVIDER: z.nativeEnum(DatabaseProvider),
  DATABASE_URL: z.string(),
  NODE_ENV: z.string(),
  EMAIL_FROM: z.string(),
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.string(),
  EMAIL_USER: z.string(),
  EMAIL_PASS: z.string(),
  DEBUG_TESTS: z.string().optional(),
  TEST_SERVER_URL: z.string(),
  GOOGLE_MAPS_API_KEY: z.string(),
  OPENAI_API_KEY: z.string(),
  OPENAI_API_URL: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CLIENT_EMAIL: z.string(),
  AZURE_RESOURCE_NAME: z.string(),
  AZURE_API_KEY: z.string(),
  AWS_REGION: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_SESSION_TOKEN: z.string(),
  ANTHROPIC_API_URL: z.string(),
  ANTHROPIC_API_KEY: z.string(),
  GOOGLE_GENERATIVE_AI_API_URL: z.string(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
  GOOGLE_VERTEX_PROJECT: z.string(),
  GOOGLE_VERTEX_LOCATION: z.string(),
  MISTRAL_API_URL: z.string(),
  MISTRAL_API_KEY: z.string(),
  CODESTRAL_API_URL: z.string(),
  CODESTRAL_API_KEY: z.string(),
  COHERE_API_URL: z.string(),
  COHERE_API_KEY: z.string(),
  GROQ_API_URL: z.string(),
  GROQ_API_KEY: z.string(),
  OLLAMA_API_URL: z.string(),
  GITHUB_OPENAI_API_URL: z.string(),
  GITHUB_OPENAI_API_KEY: z.string(),
  GITHUB_MISTRAL_API_URL: z.string(),
  GITHUB_MISTRAL_API_KEY: z.string(),
  OPENROUTER_API_URL: z.string(),
  OPENROUTER_API_KEY: z.string(),
  TOGETHER_API_URL: z.string(),
  TOGETHER_API_KEY: z.string(),
  GLHF_API_URL: z.string(),
  GLHF_API_KEY: z.string(),
  ANTHROPIC_VERTEX_PROJECT: z.string(),
  ANTHROPIC_VERTEX_LOCATION: z.string(),
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
