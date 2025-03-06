import { examples } from "@/lib/examples/data";
import {
  addressCreateSchema,
  addressResponseSchema,
  addressUpdateSchema,
  cartItemResponseSchema,
  cartItemUpdateSchema,
  dateRangeSchema,
  deliveryCreateSchema,
  deliveryResponseSchema,
  deliveryUpdateSchema,
  driverCreateSchema,
  driverPublicResponseSchema,
  driverUpdateSchema,
  loginResponseSchema,
  loginSchema,
  menuItemCreateSchema,
  menuItemSchema,
  menuItemSearchSchema,
  menuItemUpdateSchema,
  messageResponseSchema,
  orderCreateSchema,
  orderResponseSchema,
  orderUpdateSchema,
  registerSchema,
  resetPasswordConfirmSchema,
  resetPasswordRequestSchema,
  restaurantCreateSchema,
  restaurantResponseSchema,
  restaurantUpdateSchema,
  searchSchema,
  successResponseSchema,
  userResponseSchema,
} from "@/schemas";
import type { ApiEndpoint } from "@/types/types";

// Define API endpoints using your schema types
export const ENDPOINTS: ApiEndpoint[] = [
  {
    path: "/api/v1/restaurants",
    method: "GET",
    description: "Get a list of all restaurants",
    responseSchema: { type: "array", items: restaurantResponseSchema.shape },
    requiresAuth: true,
    errorCodes: {
      401: "Unauthorized - Authentication required",
      403: "Forbidden - Insufficient permissions",
      500: "Internal Server Error",
    },
    // Add examples from the examples object
    examples: {
      default: examples.restaurants,
    },
  },
  {
    path: "/api/v1/restaurants/{id}",
    method: "GET",
    description: "Get restaurant details by ID",
    requestSchema: { id: "UUID of the restaurant" },
    responseSchema: restaurantResponseSchema.shape,
    requiresAuth: true,
    errorCodes: {
      401: "Unauthorized - Authentication required",
      404: "Not Found - Restaurant does not exist",
      500: "Internal Server Error",
    },
    examples: {
      default: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
  },
  {
    path: "/api/v1/restaurants",
    method: "POST",
    description: "Create a new restaurant",
    requestSchema: restaurantCreateSchema.shape,
    responseSchema: restaurantResponseSchema.shape,
    requiredFields: ["name", "address", "phone", "email", "cuisine"],
    requiresAuth: true,
    errorCodes: {
      400: "Bad Request - Invalid data",
      401: "Unauthorized - Authentication required",
      403: "Forbidden - Insufficient permissions",
      500: "Internal Server Error",
    },
    examples: {
      default: examples.restaurants[0],
    },
  },
  {
    path: "/api/v1/menu-items",
    method: "GET",
    description: "Get menu items by restaurant ID",
    requestSchema: { restaurantId: "UUID of the restaurant" },
    responseSchema: { items: [menuItemUpdateSchema.shape] },
    requiredFields: ["restaurantId"],
    requiresAuth: true,
    errorCodes: {
      400: "Bad Request - Missing restaurant ID",
      401: "Unauthorized - Authentication required",
      404: "Not Found - Restaurant not found",
      500: "Internal Server Error",
    },
    examples: {
      default: { restaurantId: "550e8400-e29b-41d4-a716-446655440000" },
    },
  },
  {
    path: "/api/v1/menu-items/{id}",
    method: "GET",
    description: "Get a specific menu item by ID",
    requestSchema: { id: "UUID of the menu item" },
    responseSchema: menuItemUpdateSchema.shape,
    requiresAuth: true,
    errorCodes: {
      401: "Unauthorized - Authentication required",
      404: "Not Found - Menu item does not exist",
      500: "Internal Server Error",
    },
    examples: {
      default: { id: "550e8400-e29b-41d4-a716-446655440001" },
    },
  },
  {
    path: "/api/v1/menu-items",
    method: "POST",
    description: "Create a new menu item",
    requestSchema: menuItemCreateSchema.shape,
    responseSchema: menuItemUpdateSchema.shape,
    requiredFields: ["name", "description", "price", "category"],
    requiresAuth: true,
    errorCodes: {
      400: "Bad Request - Invalid menu item data",
      401: "Unauthorized - Authentication required",
      403: "Forbidden - Not authorized to add menu items",
      500: "Internal Server Error",
    },
    examples: {
      default: examples.menuItems[0],
    },
  },
  {
    path: "/api/v1/orders",
    method: "POST",
    description: "Create a new order",
    requestSchema: orderCreateSchema.shape,
    responseSchema: orderResponseSchema.shape,
    requiredFields: ["restaurantId", "items", "address"],
    requiresAuth: true,
    errorCodes: {
      400: "Bad Request - Invalid order data",
      401: "Unauthorized - Authentication required",
      404: "Not Found - Restaurant not found",
      500: "Internal Server Error",
    },
    examples: {
      default: examples.orders[0],
    },
  },
  {
    path: "/api/v1/orders/{id}",
    method: "GET",
    description: "Get order details by ID",
    requestSchema: { id: "UUID of the order" },
    responseSchema: orderResponseSchema.shape,
    requiresAuth: true,
    errorCodes: {
      401: "Unauthorized - Authentication required",
      403: "Forbidden - Not authorized to view this order",
      404: "Not Found - Order does not exist",
      500: "Internal Server Error",
    },
    examples: {
      default: { id: "550e8400-e29b-41d4-a716-446655440003" },
    },
  },
  {
    path: "/api/v1/drivers",
    method: "POST",
    description: "Register as a driver",
    requestSchema: driverCreateSchema.shape,
    responseSchema: driverPublicResponseSchema.shape,
    requiredFields: ["userId", "vehicle", "licensePlate"],
    requiresAuth: true,
    errorCodes: {
      400: "Bad Request - Invalid driver data",
      401: "Unauthorized - Authentication required",
      409: "Conflict - User is already registered as a driver",
      500: "Internal Server Error",
    },
    examples: {
      default: examples.drivers[0],
    },
  },
  {
    path: "/api/v1/drivers/{id}",
    method: "GET",
    description: "Get driver details by ID",
    requestSchema: { id: "UUID of the driver" },
    responseSchema: driverPublicResponseSchema.shape,
    requiresAuth: true,
    errorCodes: {
      401: "Unauthorized - Authentication required",
      404: "Not Found - Driver not found",
      500: "Internal Server Error",
    },
    examples: {
      default: { id: "550e8400-e29b-41d4-a716-446655440004" },
    },
  },
  {
    path: "/api/v1/deliveries",
    method: "POST",
    description: "Create a new delivery",
    requestSchema: deliveryCreateSchema.shape,
    responseSchema: deliveryResponseSchema.shape,
    requiredFields: ["orderId", "distance"],
    requiresAuth: true,
    errorCodes: {
      400: "Bad Request - Invalid delivery data",
      401: "Unauthorized - Authentication required",
      404: "Not Found - Order not found",
      500: "Internal Server Error",
    },
    examples: {
      default: {
        ...examples.deliveries[0],
        orderId: "550e8400-e29b-41d4-a716-446655440003",
      },
    },
  },
  {
    path: "/api/v1/deliveries/{id}",
    method: "GET",
    description: "Get delivery details by ID",
    requestSchema: { id: "UUID of the delivery" },
    responseSchema: deliveryResponseSchema.shape,
    requiresAuth: true,
    errorCodes: {
      401: "Unauthorized - Authentication required",
      404: "Not Found - Delivery not found",
      500: "Internal Server Error",
    },
    examples: {
      default: { id: "550e8400-e29b-41d4-a716-446655440005" },
    },
  },
  {
    path: "/api/v1/addresses",
    method: "POST",
    description: "Add a new address",
    requestSchema: addressCreateSchema.shape,
    responseSchema: addressResponseSchema.shape,
    requiredFields: ["userId", "label", "address"],
    requiresAuth: true,
    errorCodes: {
      400: "Bad Request - Invalid address data",
      401: "Unauthorized - Authentication required",
      500: "Internal Server Error",
    },
    examples: {
      default: examples.addresses[0],
    },
  },
  {
    path: "/api/v1/addresses/{id}",
    method: "GET",
    description: "Get address by ID",
    requestSchema: { id: "UUID of the address" },
    responseSchema: addressResponseSchema.shape,
    requiresAuth: true,
    errorCodes: {
      401: "Unauthorized - Authentication required",
      404: "Not Found - Address not found",
      500: "Internal Server Error",
    },
    examples: {
      default: { id: "550e8400-e29b-41d4-a716-446655440006" },
    },
  },
  // Authentication endpoints
  {
    path: "/api/v1/auth/login",
    method: "POST",
    description: "Login with email and password",
    requestSchema: loginSchema.shape,
    responseSchema: loginResponseSchema.shape,
    requiredFields: ["email", "password"],
    requiresAuth: false,
    errorCodes: {
      400: "Bad Request - Invalid credentials",
      401: "Unauthorized - Invalid email or password",
      500: "Internal Server Error",
    },
    examples: {
      default: examples.auth.login,
    },
  },
  {
    path: "/api/v1/auth/register",
    method: "POST",
    description: "Register a new user account",
    requestSchema: registerSchema.shape,
    responseSchema: userResponseSchema.shape,
    requiredFields: ["name", "email", "password"],
    requiresAuth: false,
    errorCodes: {
      400: "Bad Request - Invalid registration data",
      409: "Conflict - Email already exists",
      500: "Internal Server Error",
    },
    examples: {
      default: examples.auth.register,
    },
  },
  {
    path: "/api/v1/auth/password-reset/request",
    method: "POST",
    description: "Request a password reset link",
    requestSchema: resetPasswordRequestSchema.shape,
    responseSchema: messageResponseSchema.shape,
    requiredFields: ["email"],
    requiresAuth: false,
    errorCodes: {
      400: "Bad Request - Invalid email",
      404: "Not Found - Email not found",
      500: "Internal Server Error",
    },
    examples: {
      default: examples.auth.resetRequest,
    },
  },
  {
    path: "/api/v1/auth/password-reset/confirm",
    method: "POST",
    description: "Reset password with token",
    requestSchema: resetPasswordConfirmSchema.shape,
    responseSchema: messageResponseSchema.shape,
    requiredFields: ["token", "newPassword"],
    requiresAuth: false,
    errorCodes: {
      400: "Bad Request - Invalid or expired token",
      500: "Internal Server Error",
    },
    examples: {
      default: examples.auth.resetConfirm,
    },
  },
  {
    path: "/api/v1/users/me",
    method: "GET",
    description: "Get current user profile",
    responseSchema: userResponseSchema.shape,
    requiresAuth: true,
    errorCodes: {
      401: "Unauthorized - Authentication required",
      404: "Not Found - User not found",
      500: "Internal Server Error",
    },
    examples: {
      default: { id: "current-user" },
    },
  },

  // Address update endpoint
  {
    path: "/api/v1/addresses/{id}",
    method: "PUT",
    description: "Update an existing address",
    requestSchema: addressUpdateSchema.shape,
    responseSchema: addressResponseSchema.shape,
    requiresAuth: true,
    errorCodes: {
      400: "Bad Request - Invalid address data",
      401: "Unauthorized - Authentication required",
      403: "Forbidden - Not authorized to update this address",
      404: "Not Found - Address not found",
      500: "Internal Server Error",
    },
    examples: {
      default: {
        id: "550e8400-e29b-41d4-a716-446655440006",
        ...examples.addresses[0],
      },
    },
  },

  // Cart endpoints
  {
    path: "/api/v1/cart",
    method: "GET",
    description: "Get user's shopping cart",
    responseSchema: { items: [cartItemResponseSchema.shape] },
    requiresAuth: true,
    errorCodes: {
      401: "Unauthorized - Authentication required",
      500: "Internal Server Error",
    },
    examples: {
      default: { items: examples.cart },
    },
  },
  {
    path: "/api/v1/cart/items",
    method: "POST",
    description: "Add an item to the shopping cart",
    requestSchema: cartItemUpdateSchema.shape,
    responseSchema: cartItemResponseSchema.shape,
    requiredFields: ["menuItemId", "quantity"],
    requiresAuth: true,
    errorCodes: {
      400: "Bad Request - Invalid cart item data",
      401: "Unauthorized - Authentication required",
      404: "Not Found - Menu item not found",
      500: "Internal Server Error",
    },
    examples: {
      default: examples.cart[0],
    },
  },
  {
    path: "/api/v1/cart/items/{id}",
    method: "PUT",
    description: "Update cart item quantity",
    requestSchema: { quantity: "Number of items" },
    responseSchema: cartItemResponseSchema.shape,
    requiredFields: ["quantity"],
    requiresAuth: true,
    errorCodes: {
      400: "Bad Request - Invalid quantity",
      401: "Unauthorized - Authentication required",
      404: "Not Found - Cart item not found",
      500: "Internal Server Error",
    },
  },
  {
    path: "/api/v1/cart/items/{id}",
    method: "DELETE",
    description: "Remove item from cart",
    requestSchema: { id: "UUID of the cart item" },
    responseSchema: successResponseSchema.shape,
    requiresAuth: true,
    errorCodes: {
      401: "Unauthorized - Authentication required",
      404: "Not Found - Cart item not found",
      500: "Internal Server Error",
    },
  },

  // Restaurant update endpoint
  {
    path: "/api/v1/restaurants/{id}",
    method: "PUT",
    description: "Update restaurant details",
    requestSchema: restaurantUpdateSchema.shape,
    responseSchema: restaurantResponseSchema.shape,
    requiresAuth: true,
    errorCodes: {
      400: "Bad Request - Invalid restaurant data",
      401: "Unauthorized - Authentication required",
      403: "Forbidden - Not authorized to update this restaurant",
      404: "Not Found - Restaurant not found",
      500: "Internal Server Error",
    },
  },

  // Menu item endpoints
  {
    path: "/api/v1/menu-items/{id}",
    method: "PUT",
    description: "Update a menu item",
    requestSchema: menuItemUpdateSchema.shape,
    responseSchema: menuItemSchema.shape,
    requiresAuth: true,
    errorCodes: {
      400: "Bad Request - Invalid menu item data",
      401: "Unauthorized - Authentication required",
      403: "Forbidden - Not authorized to update this menu item",
      404: "Not Found - Menu item not found",
      500: "Internal Server Error",
    },
  },
  {
    path: "/api/v1/menu-items/search",
    method: "GET",
    description: "Search for menu items",
    requestSchema: menuItemSearchSchema.shape,
    responseSchema: { items: [menuItemSchema.shape] },
    requiresAuth: false,
    errorCodes: {
      400: "Bad Request - Invalid search parameters",
      500: "Internal Server Error",
    },
  },

  // Order endpoints
  {
    path: "/api/v1/orders/{id}",
    method: "PUT",
    description: "Update order status",
    requestSchema: orderUpdateSchema.shape,
    responseSchema: orderResponseSchema.shape,
    requiresAuth: true,
    errorCodes: {
      400: "Bad Request - Invalid order data",
      401: "Unauthorized - Authentication required",
      403: "Forbidden - Not authorized to update this order",
      404: "Not Found - Order not found",
      500: "Internal Server Error",
    },
  },

  // Delivery update endpoint
  {
    path: "/api/v1/deliveries/{id}",
    method: "PUT",
    description: "Update delivery status",
    requestSchema: deliveryUpdateSchema.shape,
    responseSchema: deliveryResponseSchema.shape,
    requiresAuth: true,
    errorCodes: {
      400: "Bad Request - Invalid delivery data",
      401: "Unauthorized - Authentication required",
      403: "Forbidden - Not authorized to update this delivery",
      404: "Not Found - Delivery not found",
      500: "Internal Server Error",
    },
  },

  // Driver update endpoint
  {
    path: "/api/v1/drivers/{id}",
    method: "PUT",
    description: "Update driver information",
    requestSchema: driverUpdateSchema.shape,
    responseSchema: driverPublicResponseSchema.shape,
    requiresAuth: true,
    errorCodes: {
      400: "Bad Request - Invalid driver data",
      401: "Unauthorized - Authentication required",
      403: "Forbidden - Not authorized to update this driver",
      404: "Not Found - Driver not found",
      500: "Internal Server Error",
    },
  },

  // Utility endpoints
  {
    path: "/api/v1/search",
    method: "GET",
    description: "Search across multiple resources",
    requestSchema: searchSchema.shape,
    responseSchema: { results: "Mixed result types based on search" },
    requiresAuth: false,
    errorCodes: {
      400: "Bad Request - Invalid search parameters",
      500: "Internal Server Error",
    },
    examples: {
      default: { search: "pizza" },
    },
  },
  {
    path: "/api/v1/statistics",
    method: "GET",
    description: "Get platform statistics within a date range",
    requestSchema: dateRangeSchema.shape,
    responseSchema: { statistics: "Platform statistics data" },
    requiresAuth: true,
    errorCodes: {
      400: "Bad Request - Invalid date range",
      401: "Unauthorized - Authentication required",
      403: "Forbidden - Insufficient permissions",
      500: "Internal Server Error",
    },
    examples: {
      default: {
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
      },
    },
  },
];
