import { z } from "zod";

import {
  addressCreateSchema,
  addressResponseSchema,
  cartItemUpdateSchema,
  deliveryCreateSchema,
  deliveryResponseSchema,
  driverCreateSchema,
  driverPublicResponseSchema,
  menuItemCreateSchema,
  orderCreateSchema,
  orderItemResponseSchema,
  orderResponseSchema,
  restaurantCreateSchema,
  restaurantProfileSchema,
  restaurantResponseSchema,
} from "@/schemas";
import type { ApiEndpoint, DeliveryType } from "@/types/types";
import {
  type AddressCreateType,
  type CartItemUpdateType,
  type DeliveryCreateType,
  type DeliveryResponseType,
  DeliveryStatus,
  type DriverCreateType,
  type DriverPrivateResponseType,
  type LoginFormType,
  type MenuItemCreateType,
  type MenuItemResponseType,
  type OrderCreateType,
  type OrderItemResponseType,
  OrderStatus,
  type RegisterType,
  type ResetPasswordConfirmType,
  type ResetPasswordRequestType,
  type RestaurantCreateType,
  type RestaurantProfileType,
  type RestaurantResponseType,
  type UserResponseType,
  UserRoleValue,
} from "@/types/types";

class Examples {
  // API examples for documentation
  private restaurantExamples: RestaurantCreateType[] = [
    {
      restaurantId: "550e8400-e29b-41d4-a716-446655440000",
      name: "Pizza Palace",
      description: "Delicious pizzas made with fresh ingredients",
      mainCategoryId: "todo",
      streetNumber: "123",
      street: "Main St",
      city: "City",
      zip: "123",
      countryId: "DE",
      phone: "+1234567890",
      email: "contact@pizzapalace.com",
      image: "https://example.com/pizzapalace.jpg",
      userRoles: [],
      // Add new required fields
    },
  ];

  private menuItemExamples: MenuItemCreateType[] = [
    {
      name: "Margherita Pizza",
      description: "Classic cheese and tomato pizza",
      price: 9.99,
      image: "https://example.com/margherita.jpg",
      taxPercent: 8.0,
      published: true,
      availableFrom: null,
      availableTo: null,
      categoryId: "todo",
      restaurantId: "550e8400-e29b-41d4-a716-446655440000",
    },
  ];

  private orderExamples: OrderCreateType[] = [
    {
      restaurantId: "550e8400-e29b-41d4-a716-446655440000",
      items: [
        {
          menuItemId: "550e8400-e29b-41d4-a716-446655440001",
          quantity: 2,
          message: "without cheese",
        },
      ],
      message: "ring the doorbell",
      deliveryFee: 2,
      driverTip: 1,
      restaurantTip: 1,
      projectTip: 1,
    },
  ];

  private driverExamples: DriverCreateType[] = [
    {
      userId: "550e8400-e29b-41d4-a716-446655440004",
      vehicle: "Toyota Corolla",
      licensePlate: "ABC-123",
    },
  ];

  private addressExamples: AddressCreateType[] = [
    {
      userId: "550e8400-e29b-41d4-a716-446655440002",
      label: "Home",
      isDefault: false,
      street: "street",
      streetNumber: "43",
      zip: "435435",
      city: "dfgdf",
      phone: "+1234567890",
      countryId: "DE",
    },
  ];

  private deliveryExamples: DeliveryCreateType[] = [
    {
      orderId: "550e8400-e29b-41d4-a716-446655440003",
      distance: 3.5,
      estimatedTime: 25,
      pickupLat: 37.7749,
      pickupLng: -122.4194,
      dropoffLat: 37.7735,
      dropoffLng: -122.4162,
    },
  ];

  private userExamples: Partial<UserResponseType>[] = [
    {
      id: "550e8400-e29b-41d4-a716-446655440002",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      roles: [UserRoleValue.CUSTOMER],
    },
  ];

  private authExamples = {
    login: {
      email: "user@example.com",
      password: "Password123",
    } as LoginFormType,
    register: {
      name: "New User",
      email: "newuser@example.com",
      password: "Password123",
      confirmPassword: "Password123",
    } as RegisterType,
    resetRequest: {
      email: "user@example.com",
    } as ResetPasswordRequestType,
    resetConfirm: {
      token: "reset-token-example",
      password: "NewPassword123",
      confirmPassword: "NewPassword123",
    } as ResetPasswordConfirmType,
  };

  private cartExamples: CartItemUpdateType[] = [
    {
      menuItemId: "550e8400-e29b-41d4-a716-446655440001",
      restaurantId: "550e8400-e29b-41d4-a716-446655440000",
      quantity: 2,
    },
  ];

  // Test data collections for seeding the database
  private testUsers = [
    {
      id: "e6f5f3f0-3aa7-4b50-9450-a1e88c590b44",
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      password: "password",
      roleValue: UserRoleValue.ADMIN,
    },
    {
      id: "36d7d08a-db1e-4db7-bd9d-25136adeb46f",
      firstName: "Customer",
      lastName: "User",
      email: "customer@example.com",
      password: "password",
      roleValue: UserRoleValue.CUSTOMER,
    },
    {
      id: "1f4b3d55-36b1-43c2-8456-7b1f9a36a81f",
      firstName: "Restaurant",
      lastName: "Owner",
      email: "restaurant@example.com",
      password: "password",
      roleValue: UserRoleValue.RESTAURANT_ADMIN,
    },
    {
      id: "8d6765be-1929-4985-8634-cac0e3a87034",
      firstName: "Delivery",
      lastName: "Driver",
      email: "driver@example.com",
      password: "password",
      roleValue: UserRoleValue.DRIVER,
    },
  ];

  private testAddresses = [
    {
      id: "a0e3f2d1-c5b4-4a3e-8d7c-6f5e4d3c2b1a",
      street: "123 Main St",
      streetNumber: "12",
      city: "Cityville",
      zip: "12345",
      country: "DE",
      latitude: 40.7128,
      longitude: -74.006,
      userId: "36d7d08a-db1e-4db7-bd9d-25136adeb46f", // Customer
      name: "Home",
      label: "Home",
      address: "123 Main St, Cityville, Stateland 12345, USA",
      isDefault: true,
      phone: "+1234567890",
      message: "Ring the doorbell",
    },
    {
      id: "b1f4e3d2-c6a5-4b3e-9d8c-7f6e5d4c3b2a",
      street: "456 Restaurant Ave",
      streetNumber: "12",
      city: "Foodville",
      zip: "54321",
      country: "DE",
      latitude: 40.712,
      longitude: -74.005,
      userId: "1f4b3d55-36b1-43c2-8456-7b1f9a36a81f", // Restaurant owner
      name: "Work",
      label: "Work",
      address: "456 Restaurant Ave, Foodville, Tasteland 54321, USA",
      isDefault: true,
      phone: "+1234567890",
      message: "Ring the doorbell",
    },
    {
      id: "c2f5e4d3-b6a5-4c3e-9d8c-7f6e5d4c3b2a",
      street: "789 Delivery Rd",
      streetNumber: "12",
      city: "Driverville",
      zip: "67890",
      country: "DE",
      latitude: 40.711,
      longitude: -74.004,
      userId: "8d6765be-1929-4985-8634-cac0e3a87034", // Driver
      name: "Home",
      label: "Home",
      address: "789 Delivery Rd, Driverville, Routeland 67890, USA",
      isDefault: true,
      phone: "+1234567890",
      message: "Ring the doorbell",
    },
  ];

  private testRestaurants = [
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
      userId: "1f4b3d55-36b1-43c2-8456-7b1f9a36a81f", // Restaurant owner
      // Add new required fields
      street: "456 Restaurant Ave",
      city: "Foodville",
      state: "Tasteland",
      zipCode: "54321",
      country: "USA",
      latitude: 40.712,
      longitude: -74.005,
    } as RestaurantResponseType,
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
      userId: "1f4b3d55-36b1-43c2-8456-7b1f9a36a81f", // Restaurant owner
      // Add new required fields
      street: "789 Beef St",
      city: "Foodville",
      state: "Tasteland",
      zipCode: "54322",
      country: "USA",
      latitude: 40.713,
      longitude: -74.007,
    } as RestaurantResponseType,
  ];

  private testMenuItems = [
    {
      id: "f5g8h7i6-e9d8-7c6b-2f1e-0g9h8i7j6k5l",
      name: "Margherita Pizza",
      description: "Classic cheese and tomato pizza",
      price: 9.99,
      image: "https://example.com/margherita.jpg",
      category: "Pizza",
      restaurantId: "d3f6e5d4-c7b6-5a4e-0d9c-8f7g6e5d4c3b",
      isAvailable: true,
      // Add new required field
      taxPercent: 8.0,
    } as MenuItemResponseType,
    {
      id: "g6h9i8j7-f0e9-8d7c-3g2f-1h0i9j8k7l6m",
      name: "Pepperoni Pizza",
      description: "Pizza with pepperoni toppings",
      price: 11.99,
      image: "https://example.com/pepperoni.jpg",
      category: "Pizza",
      restaurantId: "d3f6e5d4-c7b6-5a4e-0d9c-8f7g6e5d4c3b",
      isAvailable: true,
      // Add new required field
      taxPercent: 8.0,
    } as MenuItemResponseType,
    {
      id: "h7i0j9k8-g1f0-9e8d-4h3g-2i1j0k9l8m7n",
      name: "Classic Burger",
      description: "Beef patty with lettuce, tomato, and cheese",
      price: 8.99,
      image: "https://example.com/classic-burger.jpg",
      category: "Burgers",
      restaurantId: "e4f7g6e5-d8c7-6b5a-1e0d-9f8g7e6f5d4c",
      isAvailable: true,
      // Add new required field
      taxPercent: 8.0,
    } as MenuItemResponseType,
  ];

  private testOrders = [
    {
      id: "i8j1k0l9-h2g1-0f9e-5i4h-3j2k1l0m9n8o",
      total: 21.98,
      tax: 2.0,
      deliveryFee: 3.99,
      status: OrderStatus.NEW,
      customerId: "36d7d08a-db1e-4db7-bd9d-25136adeb46f", // Customer
      restaurantId: "d3f6e5d4-c7b6-5a4e-0d9c-8f7g6e5d4c3b",
      address: "123 Main St, Cityville, Stateland 12345, USA",
      createdAt: "2023-01-01T12:00:00Z",
      deliveredAt: null,
    },
    {
      id: "j9k2l1m0-i3h2-1g0f-6j5i-4k3l2m1n0o9p",
      total: 12.98,
      tax: 1.0,
      deliveryFee: 2.99,
      status: OrderStatus.DELIVERED,
      customerId: "36d7d08a-db1e-4db7-bd9d-25136adeb46f", // Customer
      restaurantId: "e4f7g6e5-d8c7-6b5a-1e0d-9f8g7e6f5d4c",
      address: "123 Main St, Cityville, Stateland 12345, USA",
      createdAt: "2023-01-02T12:00:00Z",
      deliveredAt: "2023-01-02T13:30:00Z",
    },
  ];

  private testOrderItems = [
    {
      id: "k0l3m2n1-j4i3-2h1g-7k6j-5l4m3n2o1p0q",
      quantity: 2,
      price: 9.99,
      menuItemId: "f5g8h7i6-e9d8-7c6b-2f1e-0g9h8i7j6k5l",
      orderId: "i8j1k0l9-h2g1-0f9e-5i4h-3j2k1l0m9n8o",
      menuItem: this.testMenuItems[0],
      // Add new required field
      taxPercent: 8.0,
    } as OrderItemResponseType,
    {
      id: "l1m4n3o2-k5j4-3i2h-8l7k-6m5n4o3p2q1r",
      quantity: 1,
      price: 8.99,
      menuItemId: "h7i0j9k8-g1f0-9e8d-4h3g-2i1j0k9l8m7n",
      orderId: "j9k2l1m0-i3h2-1g0f-6j5i-4k3l2m1n0o9p",
      menuItem: this.testMenuItems[2],
      // Add new required field
      taxPercent: 8.0,
    } as OrderItemResponseType,
  ];

  private testDeliveries = [
    {
      id: "m2n5o4p3-l6k5-4j3i-9m8l-7n6o5p4q3r2s",
      orderId: "i8j1k0l9-h2g1-0f9e-5i4h-3j2k1l0m9n8o",
      status: DeliveryStatus.ASSIGNED,
      estimatedDelivery: "2023-01-01T12:45:00Z",
      estimatedTime: 30,
      distance: 2.5,
      tip: 3.0,
      pickupLat: 40.712,
      pickupLng: -74.005,
      dropoffLat: 40.7128,
      dropoffLng: -74.006,
      createdAt: "2023-01-01T12:05:00Z",
      updatedAt: "2023-01-01T12:05:00Z",
      // Add new required field
      type: "STANDARD" as DeliveryType,
    } as DeliveryResponseType,
    {
      id: "n3o6p5q4-m7l6-5k4j-0n9m-8o7p6q5r4s3t",
      orderId: "j9k2l1m0-i3h2-1g0f-6j5i-4k3l2m1n0o9p",
      status: DeliveryStatus.DELIVERED,
      estimatedDelivery: "2023-01-02T13:15:00Z",
      estimatedTime: 25,
      distance: 1.8,
      tip: 2.5,
      pickupLat: 40.711,
      pickupLng: -74.004,
      dropoffLat: 40.7128,
      dropoffLng: -74.006,
      createdAt: "2023-01-02T12:30:00Z",
      updatedAt: "2023-01-02T13:30:00Z",
      // Add new required field
      type: "EXPRESS" as DeliveryType,
    } as DeliveryResponseType,
  ];

  private testDrivers = [
    {
      id: "o4p7q6r5-n8m7-6l5k-1o0n-9p8q7r6s5t4u",
      userId: "8d6765be-1929-4985-8634-cac0e3a87034", // Driver user
      vehicle: "Toyota Prius",
      licensePlate: "DRV-123",
      isActive: true,
      rating: 4.8,
      createdAt: "2023-01-01T09:00:00Z",
      updatedAt: "2023-01-01T09:00:00Z",
    } as DriverPrivateResponseType,
  ];

  private testRestaurantProfiles = [
    {
      name: "Pizza Palace",
      description: "Best pizza in town!",
      address: "456 Restaurant Ave",
      city: "Foodville",
      state: "Tasteland",
      zipCode: "54321",
      phone: "+1234567890",
      email: "contact@pizzapalace.com",
      openingHours: "Mon-Sun: 11am-10pm",
      cuisineType: "Italian",
      deliveryRadius: 5,
      isActive: true,
    } as RestaurantProfileType,
  ];

  // Public accessors for API examples
  get restaurants(): RestaurantCreateType[] {
    return this.restaurantExamples;
  }

  get menuItems(): MenuItemCreateType[] {
    return this.menuItemExamples;
  }

  get orders(): OrderCreateType[] {
    return this.orderExamples;
  }

  get drivers(): DriverCreateType[] {
    return this.driverExamples;
  }

  get addresses(): AddressCreateType[] {
    return this.addressExamples;
  }

  get deliveries(): DeliveryCreateType[] {
    return this.deliveryExamples;
  }

  get users(): Partial<UserResponseType>[] {
    return this.userExamples;
  }

  get auth() {
    return this.authExamples;
  }

  get cart(): CartItemUpdateType[] {
    return this.cartExamples;
  }

  get restaurantProfiles(): RestaurantProfileType[] {
    return this.testRestaurantProfiles;
  }

  // Test data for database seeding
  get testData() {
    return {
      users: this.testUsers,
      addresses: this.testAddresses,
      restaurants: this.testRestaurants,
      menuItems: this.testMenuItems,
      orders: this.testOrders,
      orderItems: this.testOrderItems,
      deliveries: this.testDeliveries,
      drivers: this.testDrivers,
      restaurantProfiles: this.testRestaurantProfiles,
    };
  }

  // Get example data for a specific endpoint based on path
  getExampleForEndpoint(path: string): ApiEndpoint {
    // Extract the resource type from the path
    const resourcePath = path.replace(/^\/api\/v1\//, "").split("/")[0];

    switch (resourcePath) {
      case "restaurants":
        if (path.includes("profile")) {
          return this.restaurantProfiles[0];
        } else if (path.includes("POST") || path.endsWith("restaurants")) {
          return this.restaurants[0];
        } else {
          return { id: this.testRestaurants[0].id };
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

  // Validate example data against schemas
  validateExamples(): void {
    try {
      // Validate API documentation examples
      z.array(restaurantCreateSchema).parse(this.restaurants);
      z.array(menuItemCreateSchema).parse(this.menuItems);
      z.array(orderCreateSchema.partial()).parse(this.orders);
      z.array(driverCreateSchema.partial()).parse(this.drivers);
      z.array(addressCreateSchema.partial()).parse(this.addresses);
      z.array(deliveryCreateSchema.partial()).parse(this.deliveries);
      z.array(cartItemUpdateSchema).parse(this.cart);
      z.array(restaurantProfileSchema).parse(this.restaurantProfiles);

      // Validate test data if needed
      z.array(restaurantResponseSchema).parse(this.testRestaurants);
      z.array(menuItemCreateSchema).parse(this.testMenuItems);
      z.array(orderResponseSchema.partial()).parse(this.testOrders);
      z.array(orderItemResponseSchema.partial()).parse(this.testOrderItems);
      z.array(deliveryResponseSchema.partial()).parse(this.testDeliveries);
      z.array(driverPublicResponseSchema.partial()).parse(this.testDrivers);
      z.array(addressResponseSchema.partial()).parse(this.testAddresses);

      console.log("All examples validated successfully");
    } catch (error) {
      console.error("Example validation failed:", error);
      throw error;
    }
  }
}

// Create and export a singleton instance
export const examples = new Examples();

// Export test data for easier access
export const testUsers = examples.testData.users;
export const testAddresses = examples.testData.addresses;
export const testRestaurants = examples.testData.restaurants;
export const testMenuItems = examples.testData.menuItems;
export const testOrders = examples.testData.orders;
export const testOrderItems = examples.testData.orderItems;
export const testDeliveries = examples.testData.deliveries;
export const testDrivers = examples.testData.drivers;
export const testRestaurantProfiles = examples.testData.restaurantProfiles;

// Helper function type for API explorer
export type ExampleData = ReturnType<typeof examples.getExampleForEndpoint>;

// Helper function for API explorer
export function getExampleForEndpoint(path: string): ApiEndpoint {
  return examples.getExampleForEndpoint(path);
}

// Helper function for validation
export function validateExamples(): void {
  examples.validateExamples();
}
