import { examples } from "@/client-package/schema/api/examples/data";
import { typedEndpoint } from "@/next-portal/api/endpoint";
import { undefinedSchema } from "@/next-portal/types/common.schema";
import { UserRoleValue } from "@/next-portal/types/enums";

import { loginResponseSchema, loginSchema } from "./login.schema";

export const loginEndpoint = typedEndpoint({
  description: "Authenticate a user and generate a JWT token",
  path: ["v1", "auth", "public", "login"],
  method: "POST",
  requestSchema: loginSchema,
  requestUrlSchema: undefinedSchema,
  responseSchema: loginResponseSchema,
  apiQueryOptions: {
    queryKey: ["user"],
  },
  fieldDescriptions: {
    email: "User's email address",
    password: "User's password",
  },
  errorCodes: {
    400: "Invalid request data",
    401: "Invalid credentials",
    500: "Internal server error",
  },
  allowedRoles: [UserRoleValue.PUBLIC],
  examples: {
    payloads: examples.testData.userExamples,
    urlPathVariables: undefined,
  },
});
