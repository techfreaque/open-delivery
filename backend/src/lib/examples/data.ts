import { DeliveryStatus, OrderStatus, UserRoleValue } from "@prisma/client";
import { z } from "zod";

import {
  addressCreateSchema,
  deliveryCreateSchema,
  driverCreateSchema,
  menuItemCreateSchema,
  orderCreateSchema,
  restaurantCreateSchema,
} from "@/schemas";

// Test users with predefined IDs and roles
export const testUsers = [
  {
    id: "e6f5f3f0-3aa7-4b50-9450-a1e88c590b44",
    name: "Admin User",
    email: "admin@example.com",
    password: "password",
    roleValue: UserRoleValue.ADMIN, // Use the actual enum
  },
  {
    id: "36d7d08a-db1e-4db7-bd9d-25136adeb46f",
    name: "Customer User",
    email: "customer@example.com",
    password: "password",
    roleValue: UserRoleValue.CUSTOMER, // Use the actual enum
  },
  {
    id: "1f4b3d55-36b1-43c2-8456-7b1f9a36a81f",
    name: "Restaurant Owner",
    email: "restaurant@example.com",
    password: "password",
    roleValue: UserRoleValue.RESTAURANT_ADMIN, // Use the actual enum with correct value
  },
  {
    id: "8d6765be-1929-4985-8634-cac0e3a87034",
    name: "Delivery Driver",
    email: "driver@example.com",
    password: "password",
    roleValue: UserRoleValue.DRIVER, // Use the actual enum
  },
];

// Test addresses
export const testAddresses = [
  {
    id: "a0e3f2d1-c5b4-4a3e-8d7c-6f5e4d3c2b1a",
    street: "123 Main St",
    city: "Cityville",
    state: "Stateland",
    zipCode: "12345",
    country: "USA",
    latitude: 40.7128,
    longitude: -74.006,
    userId: testUsers[1].id, // Customer
    label: "Home", // Added label field
    address: "123 Main St, Cityville, Stateland 12345, USA", // Added combined address
  },
  {
    id: "b1f4e3d2-c6a5-4b3e-9d8c-7f6e5d4c3b2a",
    street: "456 Restaurant Ave",
    city: "Foodville",
    state: "Tasteland",
    zipCode: "54321",
    country: "USA",
    latitude: 40.712,
    longitude: -74.005,
    userId: testUsers[2].id, // Restaurant owner
    label: "Work", // Added label field
    address: "456 Restaurant Ave, Foodville, Tasteland 54321, USA", // Added combined address
  },
  {
    id: "c2f5e4d3-b6a5-4c3e-9d8c-7f6e5d4c3b2a",
    street: "789 Delivery Rd",
    city: "Driverville",
    state: "Routeland",
    zipCode: "67890",
    country: "USA",
    latitude: 40.711,
    longitude: -74.004,
    userId: testUsers[3].id, // Driver
    label: "Home", // Added label field
    address: "789 Delivery Rd, Driverville, Routeland 67890, USA", // Added combined address
  },
];

// Test restaurants
export const testRestaurants = [
  {
    id: "d3f6e5d4-c7b6-5a4e-0d9c-8f7g6e5d4c3b",
    name: "Pizza Palace",
    description: "Best pizza in town!",
    image: "https://example.com/pizza-palace.jpg",
    address: "456 Restaurant Ave, Foodville, Tasteland, 54321",
    phone: "+1234567890",
    email: "contact@pizzapalace.com",
    cuisine: "Italian",
    rating: 4.5,
    isOpen: true,
    ownerId: testUsers[2].id, // Restaurant owner
  },
  {
    id: "e4f7g6e5-d8c7-6b5a-1e0d-9f8g7e6f5d4c",
    name: "Burger Barn",
    description: "Juicy burgers and great fries!",
    image: "https://example.com/burger-barn.jpg",
    address: "789 Beef St, Foodville, Tasteland, 54322",
    phone: "+1234567891",
    email: "contact@burgerbarn.com",
    cuisine: "American",
    rating: 4.2,
    isOpen: true,
    ownerId: testUsers[2].id, // Restaurant owner
  },
];

// Test menu items
export const testMenuItems = [
  {
    id: "f5g8h7i6-e9d8-7c6b-2f1e-0g9h8i7j6k5l",
    name: "Margherita Pizza",
    description: "Classic cheese and tomato pizza",
    price: 9.99,
    image: "https://example.com/margherita.jpg",
    category: "Pizza",
    restaurantId: testRestaurants[0].id,
    isAvailable: true,
  },
  {
    id: "g6h9i8j7-f0e9-8d7c-3g2f-1h0i9j8k7l6m",
    name: "Pepperoni Pizza",
    description: "Pizza with pepperoni toppings",
    price: 11.99,
    image: "https://example.com/pepperoni.jpg",
    category: "Pizza",
    restaurantId: testRestaurants[0].id,
    isAvailable: true,
  },
  {
    id: "h7i0j9k8-g1f0-9e8d-4h3g-2i1j0k9l8m7n",
    name: "Classic Burger",
    description: "Beef patty with lettuce, tomato, and cheese",
    price: 8.99,
    image: "https://example.com/classic-burger.jpg",
    category: "Burgers",
    restaurantId: testRestaurants[1].id,
    isAvailable: true,
  },
];

// Test orders
export const testOrders = [
  {
    id: "i8j1k0l9-h2g1-0f9e-5i4h-3j2k1l0m9n8o",
    total: 21.98,
    tax: 2.0,
    deliveryFee: 3.99,
    status: OrderStatus.NEW,
    customerId: testUsers[1].id, // Customer
    restaurantId: testRestaurants[0].id,
    deliveryAddressId: testAddresses[0].id,
    createdAt: "2023-01-01T12:00:00Z",
    updatedAt: "2023-01-01T12:00:00Z",
    deliveredAt: null,
  },
  {
    id: "j9k2l1m0-i3h2-1g0f-6j5i-4k3l2m1n0o9p",
    total: 12.98,
    tax: 1.0,
    deliveryFee: 2.99,
    status: OrderStatus.DELIVERED,
    customerId: testUsers[1].id, // Customer
    restaurantId: testRestaurants[1].id,
    deliveryAddressId: testAddresses[0].id,
    createdAt: "2023-01-02T12:00:00Z",
    updatedAt: "2023-01-02T13:00:00Z",
    deliveredAt: "2023-01-02T13:30:00Z",
  },
];

// Test order items
export const testOrderItems = [
  {
    id: "k0l3m2n1-j4i3-2h1g-7k6j-5l4m3n2o1p0q",
    quantity: 2,
    price: 9.99,
    menuItemId: testMenuItems[0].id,
    orderId: testOrders[0].id,
  },
  {
    id: "l1m4n3o2-k5j4-3i2h-8l7k-6m5n4o3p2q1r",
    quantity: 1,
    price: 8.99,
    menuItemId: testMenuItems[2].id,
    orderId: testOrders[1].id,
  },
];

// Test deliveries
export const testDeliveries = [
  {
    id: "m2n5o4p3-l6k5-4j3i-9m8l-7n6o5p4q3r2s",
    orderId: testOrders[0].id,
    driverId: testUsers[3].id, // Driver
    status: DeliveryStatus.ASSIGNED,
    estimatedDelivery: "2023-01-01T12:45:00Z",
    estimatedTime: 30,
    distance: 2.5,
    tip: 3.0,
    pickupLat: 40.712,
    pickupLng: -74.005,
    dropoffLat: 40.7128,
    dropoffLng: -74.006,
  },
  {
    id: "n3o6p5q4-m7l6-5k4j-0n9m-8o7p6q5r4s3t",
    orderId: testOrders[1].id,
    driverId: testUsers[3].id, // Driver
    status: DeliveryStatus.DELIVERED,
    estimatedDelivery: "2023-01-02T13:15:00Z",
    estimatedTime: 25,
    distance: 1.8,
    tip: 2.5,
    pickupLat: 40.711,
    pickupLng: -74.004,
    dropoffLat: 40.7128,
    dropoffLng: -74.006,
  },
];

// Example data for API documentation and UI prototyping
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
export function validateExamples(): void {
  // This function can be used during testing to ensure examples match schemas
  z.array(restaurantCreateSchema).parse(examples.restaurants);
  z.array(menuItemCreateSchema).parse(examples.menuItems);
  z.array(orderCreateSchema.partial()).parse(examples.orders);
  z.array(driverCreateSchema.partial()).parse(examples.drivers);
  z.array(addressCreateSchema.partial()).parse(examples.addresses);
  z.array(deliveryCreateSchema.partial()).parse(examples.deliveries);
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
