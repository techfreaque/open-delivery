import {
  loginResponseSchema,
  loginSchema,
  orderCreateSchema,
  registerBaseSchema,
  restaurantCreateSchema,
  restaurantGetSchema,
  restaurantResponseSchema,
} from "@/schemas";

import { examples, type ExamplesList } from "../examples/data";

class ApiExamples {
  // Get example data for a specific endpoint based on path
  getExampleForEndpoint(path: string[]): ActiveApiEndpoint {
    const method = path[path.length - 1];
    const _path = path.slice(0, -1);
    let endpoint: ApiEndpoint = this.endpoints as unknown as ApiEndpoint;
    for (const p of path) {
      endpoint = endpoint[p] as ApiEndpoint;
    }
    return {
      endpoint,
      method,
      path: ["api", "v1", ..._path],
      fullPath: path,
    };
  }
  // Helper function for API explorer
  public endpoints = {
    // Auth endpoints
    auth: {
      login: {
        POST: {
          description: "Authenticate user and generate JWT token",
          requestSchema: loginSchema.shape,
          responseSchema: loginResponseSchema.shape,
          fieldDescriptions: {
            email: "User's email address",
            password: "User's password",
          },
          requiresAuth: false,
          errorCodes: {
            400: "Invalid request data",
            401: "Invalid credentials",
            500: "Internal server error",
          },
          examples: examples.testData.userExamples,
        },
      } satisfies ApiEndpoints,
      register: {
        POST: {
          description: "Register a new user account",
          requestSchema: registerBaseSchema.shape,
          responseSchema: loginResponseSchema.shape,
          fieldDescriptions: {
            name: "User's full name",
            email: "User's email address",
            password: "User's password (min 8 characters)",
            confirmPassword: "Confirm password (must match password)",
          },
          requiresAuth: false,
          errorCodes: {
            400: "Invalid request data",
            409: "Email already in use",
            500: "Internal server error",
          },
        },
      },

      me: {
        GET: {
          description: "Get current authenticated user's information",
          requestSchema: undefined,
          examples: undefined,
          fieldDescriptions: undefined,
          responseSchema: loginResponseSchema.shape,
          requiresAuth: true,
          errorCodes: {
            401: "Not authenticated",
            500: "Internal server error",
          },
        },
      } satisfies ApiEndpoints,
    },

    // Restaurant endpoints
    restaurants: {
      GET: {
        description: "Get all restaurants",
        responseSchema: [
          {
            id: "uuid",
            name: "Restaurant Name",
            description: "Restaurant description",
            address: "Restaurant address",
            phone: "Restaurant phone",
            email: "restaurant@example.com",
            image: "image_url",
            rating: 4.5,
            cuisine: "Restaurant cuisine",
            isOpen: true,
            createdAt: "timestamp",
            updatedAt: "timestamp",
          },
        ],
        requestSchema: undefined,
        examples: undefined,
        fieldDescriptions: undefined,
        requiresAuth: false,
        errorCodes: {
          500: "Internal server error",
        },
      },
    } satisfies ApiEndpoints,
    restaurant: {
      GET: {
        description: "Get restaurant by ID",
        requestSchema: restaurantGetSchema.shape,
        responseSchema: restaurantResponseSchema.shape,
        requiresAuth: false,
        examples: examples.testData.restaurantExamples,
        fieldDescriptions: {
          search: "Search query",
          countryCode: "Country code",
          zip: "ZIP code",
          street: "Street name",
          streetNumber: "Street number",
          radius: "Search radius in km",
          rating: "Minimum rating",
          currentlyOpen: "Only show currently open restaurants",
          page: "Page number",
          limit: "Number of results per page",
        },
        errorCodes: {
          404: "Restaurant not found",
          500: "Internal server error",
        },
      },
      POST: {
        description: "Create a new restaurant",
        requestSchema: restaurantCreateSchema.shape,
        responseSchema: restaurantResponseSchema.shape,
        fieldDescriptions: {
          name: "Restaurant name",
          description: "Restaurant description",
          street: "Street name",
          streetNumber: "Street number",
          zip: "ZIP code",
          city: "City",
          phone: "Phone number",
          email: "Email address",
          image: "Image URL",
          published: "Published status",
          countryId: "Country ID",
          mainCategoryId: "Main category ID",
          userRoles: "User roles",
        },
        examples: examples.testData.restaurantExamples,
        requiresAuth: true,
        errorCodes: {
          400: "Invalid request data",
          401: "Not authenticated",
          403: "Not authorized",
          500: "Internal server error",
        },
      },
    } satisfies ApiEndpoints,

    // Orders endpoints
    orders: {
      GET: {
        description: "Get all orders for the authenticated user",
        responseSchema: [
          {
            id: "uuid",
            restaurantId: "uuid",
            customerId: "uuid",
            driverId: "uuid",
            status: "PENDING",
            total: 29.99,
            deliveryFee: 4.99,
            tax: 2.5,
            address: "123 Main St",
            items: [
              {
                id: "uuid",
                menuItemId: "uuid",
                quantity: 2,
                price: 9.99,
                name: "Menu Item Name",
              },
            ],
            createdAt: "timestamp",
            deliveredAt: null,
          },
        ],
        requiresAuth: true,
        errorCodes: {
          401: "Not authenticated",
          500: "Internal server error",
        },
      },
      POST: {
        description: "Create a new order",
        requestSchema: orderCreateSchema.shape,
        responseSchema: {
          id: "uuid",
          restaurantId: "uuid",
          customerId: "uuid",
          status: "PENDING",
          total: 24.99,
          deliveryFee: 4.99,
          tax: 2.0,
          address: "123 Main St",
          items: [
            {
              id: "uuid",
              menuItemId: "uuid",
              quantity: 2,
              price: 9.99,
              name: "Menu Item Name",
            },
          ],
          createdAt: "timestamp",
          deliveredAt: null,
        },
        fieldDescriptions: {
          restaurantId: "ID of the restaurant",
          items: "Array of order items (menuItemId and quantity)",
          address: "Delivery address",
        },
        requiresAuth: true,
        errorCodes: {
          400: "Invalid request data",
          401: "Not authenticated",
          404: "Restaurant or menu item not found",
          500: "Internal server error",
        },
      },
    } satisfies ApiEndpoints,
  };
}

export const apiDocsData = new ApiExamples();

export function getExampleForEndpoint(path: string[]): ActiveApiEndpoint {
  return apiDocsData.getExampleForEndpoint(path);
}

export type ActiveApiEndpoint = {
  endpoint: ApiEndpoint;
  method: string;
  path: string[];
  fullPath: string[];
};

export type ApiEndpoint = {
  description: string;
  requestSchema: Record<string, any> | undefined;
  responseSchema: Record<string, any>;
  fieldDescriptions: Record<string, string> | undefined;
  requiresAuth: boolean;
  errorCodes: Record<string, string>;
  examples: ExamplesList<Record<string, any>> | undefined;
};

export type ApiEndpoints = {
  [method in "GET" | "POST" | "PUT" | "DELETE" | "PATCH"]?: ApiEndpoint;
};
