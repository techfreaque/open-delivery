import type { Prisma } from "@prisma/client";
import {
  DeliveryStatus,
  OrderStatus,
  PaymentMethod,
  UserRoleValue,
} from "@prisma/client";
import type { z } from "zod";

import type {
  addressCreateSchema,
  addressResponseSchema,
  addressUpdateSchema,
  cartItemResponseSchema,
  cartItemSchema,
  dateRangeSchema,
  deliveryCreateSchema,
  deliveryResponseSchema,
  deliveryUpdateSchema,
  driverCreateSchema,
  driverResponseSchema,
  driverUpdateSchema,
  errorResponseSchema,
  idSchema,
  loginResponseSchema,
  loginSchema,
  menuItemCreateSchema,
  menuItemSchema,
  menuItemSearchSchema,
  menuItemUpdateSchema,
  messageResponseSchema,
  orderCreateSchema,
  orderItemResponseSchema,
  orderItemSchema,
  orderResponseSchema,
  orderUpdateSchema,
  paginationSchema,
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

// Re-export all schema types for easier access
export type MessageResponse = z.infer<typeof messageResponseSchema>;

export type AddressCreateFormData = z.infer<typeof addressCreateSchema>;
export type AddressUpdateFormData = z.infer<typeof addressUpdateSchema>;
export type AddressResponse = z.infer<typeof addressResponseSchema>;

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type ResetPasswordResetRequestData = z.infer<
  typeof resetPasswordRequestSchema
>;
export type ResetPasswordResetConfirmData = z.infer<
  typeof resetPasswordConfirmSchema
>;

export type CartItem = z.infer<typeof cartItemSchema>;
export type CartItemResponse = z.infer<typeof cartItemResponseSchema>;

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type SuccessResponse = z.infer<typeof successResponseSchema>;
export type IdParams = z.infer<typeof idSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
export type SearchParams = z.infer<typeof searchSchema>;
export type DateRangeParams = z.infer<typeof dateRangeSchema>;

export type DeliveryCreate = z.infer<typeof deliveryCreateSchema>;
export type DeliveryUpdate = z.infer<typeof deliveryUpdateSchema>;
export type DeliveryResponse = z.infer<typeof deliveryResponseSchema>;

export type DriverCreateFormData = z.infer<typeof driverCreateSchema>;
export type DriverUpdateFormData = z.infer<typeof driverUpdateSchema>;
export type DriverResponse = z.infer<typeof driverResponseSchema>;

export type MenuItem = z.infer<typeof menuItemSchema>;
export type MenuItemCreate = z.infer<typeof menuItemCreateSchema>;
export type MenuItemUpdate = z.infer<typeof menuItemUpdateSchema>;
export type MenuItemSearch = z.infer<typeof menuItemSearchSchema>;

export type OrderItemFormData = z.infer<typeof orderItemSchema>;
export type OrderCreateFormData = z.infer<typeof orderCreateSchema>;
export type OrderUpdateFormData = z.infer<typeof orderUpdateSchema>;
export type OrderItemResponse = z.infer<typeof orderItemResponseSchema>;
export type OrderResponse = z.infer<typeof orderResponseSchema>;

export type RestaurantCreateFormData = z.infer<typeof restaurantCreateSchema>;
export type RestaurantUpdateFormData = z.infer<typeof restaurantUpdateSchema>;
export type RestaurantResponse = z.infer<typeof restaurantResponseSchema>;

type Empty = Record<string, never>;

// Prisma types
export type DBUser = Prisma.UserGetPayload<Empty>;
export type DBRestaurant = Prisma.RestaurantGetPayload<Empty>;
export type DBMenuItem = Prisma.MenuItemGetPayload<Empty>;
export type DBOrder = Prisma.OrderGetPayload<Empty>;
export type DBOrderItem = Prisma.OrderItemGetPayload<Empty>;
export type DBDelivery = Prisma.DeliveryGetPayload<Empty>;

// Extended types
export type DBUserWithRoles = Prisma.UserGetPayload<{
  include: { userRoles: { select: { role: true } } };
}>;
export type DBRestaurantWithMenuItems = DBRestaurant & {
  menuItems: MenuItem[];
};
export type DBOrderWithItems = DBOrder & { items: DBOrderItem[] };
export type DBDeliveryWithDetails = DBDelivery & {
  order: DBOrder;
  restaurant: { name: string; address: string };
  customer: { name: string };
};

// prisma enums
export { DeliveryStatus, OrderStatus, PaymentMethod, UserRoleValue };

// Response types

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  status: number;
};

export interface ApiEndpoint {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  description: string;
  requestSchema?: Record<string, unknown>;
  responseSchema?: Record<string, unknown>;
  requiredFields?: string[];
  fieldDescriptions?: Record<string, string>;
  requiresAuth?: boolean;
  errorCodes?: Record<string, string>;
}
