import { z } from "zod";

import {
  addressCreateSchema,
  deliveryCreateSchema,
  driverCreateSchema,
  menuItemCreateSchema,
  orderCreateSchema,
  restaurantCreateSchema,
} from "@/schemas";

// Type-safe examples that can be used for both seeding and API documentation
export const examples = {
  restaurants: [
    {
      name: "Pizza Palace",
      address: "123 Main St, City",
      phone: "+1234567890",
      email: "contact@pizzapalace.com",
      cuisine: "Italian",
      openingTime: "09:00",
      closingTime: "22:00",
      isActive: true,
    },
  ],
  menuItems: [
    {
      name: "Margherita Pizza",
      description: "Classic cheese and tomato pizza",
      price: 9.99,
      category: "Pizza",
      image: "https://example.com/margherita.jpg",
      isAvailable: true,
    },
  ],
  orders: [
    {
      restaurantId: "550e8400-e29b-41d4-a716-446655440000",
      address: "456 Park Ave, City",
      items: [
        {
          menuItemId: "550e8400-e29b-41d4-a716-446655440001",
          quantity: 2,
        },
      ],
    },
  ],
  drivers: [
    {
      userId: "550e8400-e29b-41d4-a716-446655440004",
      vehicle: "Toyota Corolla",
      licensePlate: "ABC-123",
    },
  ],
  addresses: [
    {
      label: "Home",
      address: "789 Residential Ave, City, State, 12345",
      isDefault: true,
    },
  ],
  deliveries: [
    {
      distance: 3.5,
      estimatedTime: 25,
      pickupLat: 37.7749,
      pickupLng: -122.4194,
      dropoffLat: 37.7735,
      dropoffLng: -122.4162,
    },
  ],
  users: [
    {
      name: "John Doe",
      email: "john@example.com",
      password: "securePassword123",
    },
  ],
  auth: {
    login: {
      email: "user@example.com",
      password: "Password123",
    },
    register: {
      name: "New User",
      email: "newuser@example.com",
      password: "Password123",
    },
    resetRequest: {
      email: "user@example.com",
    },
    resetConfirm: {
      token: "reset-token-example",
      newPassword: "NewPassword123",
    },
  },
  cart: [
    {
      menuItemId: "550e8400-e29b-41d4-a716-446655440001",
      quantity: 2,
    },
  ],
};

// Validate examples against schemas
export function validateExamples() {
  // This function can be used during testing to ensure examples match schemas
  z.array(restaurantCreateSchema).parse(examples.restaurants);
  z.array(menuItemCreateSchema).parse(examples.menuItems);
  z.array(orderCreateSchema).partial().parse(examples.orders);
  z.array(driverCreateSchema).partial().parse(examples.drivers);
  z.array(addressCreateSchema).partial().parse(examples.addresses);
  z.array(deliveryCreateSchema).partial().parse(examples.deliveries);
}

// Helper to get typed examples for a specific endpoint
export function getExampleForEndpoint(path: string) {
  // Extract the resource type from the path
  const pathParts = path.split("/");
  const resourceType = pathParts[pathParts.length - 1].split("{")[0]; // Handle paths with parameters

  // For paths like /api/v1/restaurants, use the last meaningful segment
  const resourcePath = path.replace(/^\/api\/v1\//, "").split("/")[0];

  // Determine what type of resource we're dealing with
  switch (resourcePath) {
    case "restaurants":
      return path.includes("POST") || path.endsWith("restaurants")
        ? examples.restaurants[0]
        : { id: "550e8400-e29b-41d4-a716-446655440000" };

    case "menu-items":
      return path.includes("POST")
        ? examples.menuItems[0]
        : { id: "550e8400-e29b-41d4-a716-446655440001" };

    case "orders":
      return path.includes("POST")
        ? examples.orders[0]
        : { id: "550e8400-e29b-41d4-a716-446655440003" };

    case "drivers":
      return examples.drivers[0];

    case "addresses":
      return {
        ...examples.addresses[0],
        userId: "550e8400-e29b-41d4-a716-446655440002", // Example ID
      };

    case "deliveries":
      return {
        ...examples.deliveries[0],
        orderId: "550e8400-e29b-41d4-a716-446655440003", // Example ID
      };

    case "cart":
      return {
        menuItemId: "550e8400-e29b-41d4-a716-446655440001", // Example ID
        quantity: 2,
      };

    case "auth":
      if (path.includes("login")) {
        return examples.auth.login;
      }
      if (path.includes("register")) {
        return examples.auth.register;
      }
      if (path.includes("password-reset/request")) {
        return examples.auth.resetRequest;
      }
      if (path.includes("password-reset/confirm")) {
        return examples.auth.resetConfirm;
      }
      return {};

    case "users":
      if (path.includes("me")) {
        return { id: "current-user" };
      }
      return { id: "550e8400-e29b-41d4-a716-446655440004" };

    case "search":
      return { search: "pizza" };

    case "statistics":
      return {
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
      };

    default:
      // Extract ID for paths with parameters
      if (path.includes("{id}")) {
        return { id: "550e8400-e29b-41d4-a716-446655440000" };
      }
      return {};
  }
}
