import { readFileSync, writeFileSync } from "fs";
import { z } from "zod";

import { DatabaseProvider } from "@/types/types";

const template = readFileSync("prisma/schema.prisma.template", "utf8");

const envSchema = z.object({
  DATABASE_PROVIDER: z.nativeEnum(DatabaseProvider),
});

export const validateEnv = (): z.infer<typeof envSchema> => {
  // eslint-disable-next-line node/no-process-env
  return envSchema.parse(process.env);
};

// Export validated environment for use throughout the application
export const env = validateEnv();

const provider = env.DATABASE_PROVIDER;

const schema = template.replace("__DB_PROVIDER__", provider);

writeFileSync("prisma/schema.prisma", schema);
// eslint-disable-next-line no-console
console.log(`Generated prisma/schema.prisma using provider: ${provider}`);
