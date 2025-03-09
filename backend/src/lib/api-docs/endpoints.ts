import {
  loginResponseSchema,
  loginSchema,
  orderCreateSchema,
  registerSchema,
  restaurantCreateSchema,
} from "@/schemas";
import type { LoginFormType } from "@/types/types";

import { examples, type ExamplesList } from "../examples/data";

class ApiExamples {
  // Get example data for a specific endpoint based on path
  getExampleForEndpoint(path: string[]): ApiEndpoint {
    // Extract the resource type from the path

    switch (resourcePath) {
      case "restaurants":
        if (path.includes("profile")) {
          return this.restaurantProfiles[0];
        } else if (path.includes("POST") || path.endsWith("restaurants")) {
          return this.restaurants[0];
        } else {
          return { id: this.restaurantExamples.example1.id };
        }

      case "menu-items":
        return path.includes("POST")
          ? this.menuItems[0]
          : { id: this.testMenuItems[0].id };

      case "orders":
        return path.includes("POST")
          ? this.orders[0]
          : { id: this.testOrders[0].id };

      case "drivers":
        return path.includes("POST")
          ? this.drivers[0]
          : { id: this.testDrivers[0].id };

      case "addresses":
        return {
          ...this.addresses[0],
          userId: this.users[0].id,
        };

      case "deliveries":
        return {
          ...this.deliveries[0],
          orderId: this.orders[0].id,
        };

      case "cart":
        return {
          menuItemId: this.testMenuItems[0].id,
          restaurantId: this.testRestaurants[0].id,
          quantity: 2,
        };

      case "auth":
        if (path.includes("login")) {
          return this.auth.login;
        }
        if (path.includes("register")) {
          return this.auth.register;
        }
        if (path.includes("password-reset/request")) {
          return this.auth.resetRequest;
        }
        if (path.includes("password-reset/confirm")) {
          return this.auth.resetConfirm;
        }
        return {};

      case "users":
        if (path.includes("me")) {
          return { id: "current-user" };
        }
        return { id: this.testUsers[0].id };

      case "search":
        return { search: "pizza" };

      case "statistics":
        return {
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date().toISOString().split("T")[0],
        };

      default:
        if (path.includes("{id}")) {
          return { id: "550e8400-e29b-41d4-a716-446655440000" };
        }
        return {};
    }
  }
  // Helper function for API explorer
  private endpoints = {
    // Auth endpoints
    auth: {
      login: {
        POST: {
          path: "/api/auth/login",
          method: "POST",
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
        } satisfies ApiEndpoint<
          typeof loginSchema.shape,
          typeof loginResponseSchema.shape,
          LoginFormType
        >,
      },

      signup: {
        POST: {
          path: "/api/auth/signup",
          method: "POST",
          description: "Register a new user account",
          requestSchema: registerSchema.shape,
          responseSchema: {
            id: "uuid",
            email: "user@example.com",
            name: "User Name",
            roles: ["CUSTOMER"],
            createdAt: "timestamp",
            updatedAt: "timestamp",
          },
          requiredFields: ["name", "email", "password", "confirmPassword"],
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
          validation: "signupSchema",
        },
      },
      me: {
        GET: {
          path: "/api/auth/me",
          method: "GET",
          description: "Get current authenticated user's information",
          responseSchema: {
            id: "uuid",
            email: "user@example.com",
            name: "User Name",
            roles: ["ROLE"],
            createdAt: "timestamp",
            updatedAt: "timestamp",
          },
          requiresAuth: true,
          errorCodes: {
            401: "Not authenticated",
            500: "Internal server error",
          },
        },
      },
    },

    // Restaurant endpoints
    restaurants: {
      GET: {
        path: "/api/restaurants",
        method: "GET",
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
        requiresAuth: false,
        errorCodes: {
          500: "Internal server error",
        },
      },
    },
    restaurant: {
      GET: {
        path: "/api/restaurant",
        method: "GET",
        description: "Get restaurant by ID",
        responseSchema: {
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
          menuItems: [
            {
              id: "uuid",
              name: "Menu Item Name",
              description: "Menu item description",
              price: 9.99,
              image: "image_url",
              category: "Menu item category",
              isAvailable: true,
            },
          ],
          createdAt: "timestamp",
          updatedAt: "timestamp",
        },
        requiresAuth: false,
        errorCodes: {
          404: "Restaurant not found",
          500: "Internal server error",
        },
      },
      POST: {
        path: "/api/restaurants",
        method: "POST",
        description: "Create a new restaurant",
        requestSchema: restaurantCreateSchema.shape,
        responseSchema: {
          id: "uuid",
          name: "Restaurant Name",
          description: "Restaurant description",
          address: "Restaurant address",
          phone: "Restaurant phone",
          email: "restaurant@example.com",
          image: "image_url",
          rating: 0,
          cuisine: "Restaurant cuisine",
          isOpen: false,
          createdAt: "timestamp",
          updatedAt: "timestamp",
        },
        requiredFields: ["name", "address", "phone", "email"],
        fieldDescriptions: {
          name: "Restaurant name",
          description: "Restaurant description",
          address: "Restaurant physical address",
          phone: "Restaurant contact phone",
          email: "Restaurant contact email",
          image: "Restaurant image URL",
          cuisine: "Restaurant cuisine type",
        },
        requiresAuth: true,
        errorCodes: {
          400: "Invalid request data",
          401: "Not authenticated",
          403: "Not authorized",
          500: "Internal server error",
        },
        validation: "restaurantCreateSchema",
      },
    },

    // Orders endpoints
    orders: {
      GET: {
        path: "/api/orders",
        method: "GET",
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
        path: "/api/orders",
        method: "POST",
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
        requiredFields: ["restaurantId", "items", "address"],
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
        validation: "orderCreateSchema",
      },
    },
  };
}

const apiDocs = new ApiExamples();

export function getExampleForEndpoint(
  path: string[],
): ApiEndpoint<any, any, any> {
  return apiDocs.getExampleForEndpoint(path);
}

export interface ApiEndpoint<TRequestSchema, TResponseSchema, TExampleSchema> {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  description: string;
  requestSchema: TRequestSchema;
  responseSchema: TResponseSchema;
  fieldDescriptions: Record<string, string>;
  requiresAuth: boolean;
  errorCodes: Record<string, string>;
  examples: ExamplesList<TExampleSchema>;
}
