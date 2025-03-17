# nextPortal

**nextPortal** is a unified library that bridges Next.js API routes with any React frontend. With type-safe endpoint definitions, robust request validation, and built-in hooks for API interactions, nextPortal empowers you to build reliable and scalable applications quickly.

## Features

- **Typed Endpoints:** Define and validate API endpoints using a simple, expressive API and Zod schemas.
- **Unified Client API:** Use custom hooks like `useApiQuery` and `useApiMutation` for fetching and mutating data.
- **Authentication Integration:** Easily manage authentication state with a dedicated Auth Context and client functions.
- **Error Handling:** Centralized error logging and parsing utilities for consistent error management.
- **Next.js Friendly:** Integrates seamlessly with Next.js API routes and can be used in any React application.

## Installation

Install the package via npm or yarn:

```bash
npm install next-portal
# or
yarn add next-portal
```

Getting Started
Defining an API Route (Next.js)

Create an API route using the provided apiHandler:

```ts
// app/api/me/route.ts
import { apiHandler } from 'next-portal/api/api-handler';
import { meEndpoint } from 'next-portal/api/endpoints';
import { getUser } from 'next-portal/api/handlers';

export const GET = apiHandler({
  endpoint: meEndpoint,
  handler: getUser,
});

```

Define your endpoint using typedEndpoint:

```ts
// src/api/endpoints.ts
import { typedEndpoint } from 'next-portal/api/typed-endpoint';
import { loginResponseSchema } from 'next-portal/api/schemas';
import { UserRoleValue } from 'next-portal/types';

export const meEndpoint = typedEndpoint({
  description: "Get current authenticated user's information",
  path: ["v1", "auth", "me"],
  method: "GET",
  requestSchema: undefined,
  responseSchema: loginResponseSchema,
  requestUrlSchema: undefined,
  allowedRoles: [
    UserRoleValue.CUSTOMER,
    UserRoleValue.ADMIN,
    UserRoleValue.DRIVER,
    UserRoleValue.RESTAURANT_ADMIN,
    UserRoleValue.RESTAURANT_EMPLOYEE,
  ],
  errorCodes: {
    401: "Not authenticated",
    500: "Internal server error",
  },
});
```


Using the Client API in a React Frontend

Wrap your application with the AuthProvider:

```tsx
// src/client/auth/auth-context.ts
import { AuthProvider } from 'next-portal/client/auth/auth-context';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
```

Use the custom hooks to interact with your API endpoints:

```tsx
// Example component
import { useApiQuery } from 'next-portal/client/api/api-client';
import { meEndpoint } from 'next-portal/api/endpoints';

export default function UserProfile() {
  const { data: user, isLoading } = useApiQuery(["user"], meEndpoint);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      {/* Additional user details */}
    </div>
  );
}
```

Folder Structure

The project is organized as follows:

/next-portal
├── /src
│   ├── /api         # API handlers, endpoints, and schemas
│   ├── /client      # React hooks, auth context, and client utilities
│   ├── /types       # Shared TypeScript type definitions
│   └── /utils       # Utility functions for error handling, etc.
├── /examples        # Sample projects for Next.js and React integrations
├── package.json
├── tsconfig.json
└── README.md

Contributing

Contributions are welcome! Please follow these steps:

    Fork the repository.
    Create a feature branch.
    Commit your changes with clear commit messages.
    Open a pull request describing your changes.

License

MIT License

For more detailed examples, please refer to the examples folder in this repository.

Happy coding with nextPortal!