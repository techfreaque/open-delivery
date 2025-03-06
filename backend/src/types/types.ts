import type { Prisma } from "@prisma/client";
import {
  DeliveryStatus,
  DeliveryType,
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
  cartItemUpdateSchema,
  categoryCreateSchema,
  categoryResponseSchema,
  categoryUpdateSchema,
  countryResponseSchema,
  countryUpdateSchema,
  dateRangeSchema,
  deliveryCreateSchema,
  deliveryResponseSchema,
  deliveryUpdateSchema,
  driverCreateSchema,
  driverPrivateResponseSchema,
  driverPublicResponseSchema,
  driverRatingCreateSchema,
  driverUpdateSchema,
  earningCreateSchema,
  earningResponseSchema,
  earningSearchSchema,
  earningsSummarySchema,
  earningUpdateSchema,
  errorResponseSchema,
  idSchema,
  languageCreateSchema,
  languageResponseSchema,
  languageUpdateSchema,
  loginResponseSchema,
  menuItemCreateSchema,
  menuItemResponseMinimalSchema,
  menuItemResponseSchema,
  menuItemSearchSchema,
  menuItemUpdateSchema,
  messageResponseSchema,
  minimalCountryResponseSchema,
  openingTimesCreateSchema,
  openingTimesResponseSchema,
  openingTimesUpdateSchema,
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
  restaurantProfileMinimalSchema,
  restaurantProfileSchema,
  restaurantRatingCreateSchema,
  restaurantResponseSchema,
  restaurantUpdateSchema,
  searchSchema,
  successResponseSchema,
  userPublicDetailedResponseSchema,
  userPublicResponseSchema,
  userResponseMinimalSchema,
  userResponseSchema,
  userRoleResponseSchema,
  userRoleRestaurantCreateSchema,
  userRoleRestaurantResponseSchema,
  userRoleRestaurantUpdateSchema,
} from "@/schemas";

export type SuccessResponse<T> = {
  success: true;
  data?: T | undefined;
};

export type ErrorResponse = {
  success: false;
  message?: string | undefined;
};

// Re-export all schema types for easier access
export type UserPublicResponseType = z.infer<typeof userPublicResponseSchema>;
export type UserPublicDetailedResponseType = z.infer<
  typeof userPublicDetailedResponseSchema
>;
export type UserResponseMinimalType = z.infer<typeof userResponseMinimalSchema>;
export type UserResponseType = z.infer<typeof userResponseSchema>;
export type LoginResponseType = z.infer<typeof loginResponseSchema>;
export type RegisterType = z.infer<typeof registerSchema>;
export type UserRoleRestaurantCreateType = z.infer<
  typeof userRoleRestaurantCreateSchema
>;
export type UserRoleRestaurantResponseType = z.infer<
  typeof userRoleRestaurantResponseSchema
>;
export type UserRoleRestaurantUpdateType = z.infer<
  typeof userRoleRestaurantUpdateSchema
>;
export type UserRoleResponseType = z.infer<typeof userRoleResponseSchema>;
export type ResetPasswordRequestType = z.infer<
  typeof resetPasswordRequestSchema
>;
export type ResetPasswordConfirmType = z.infer<
  typeof resetPasswordConfirmSchema
>;
export type RestaurantCreateType = z.infer<typeof restaurantCreateSchema>;
export type RestaurantUpdateType = z.infer<typeof restaurantUpdateSchema>;
export type RestaurantResponseType = z.infer<typeof restaurantResponseSchema>;
export type RestaurantProfileType = z.infer<typeof restaurantProfileSchema>;
export type RestaurantProfileMinimalType = z.infer<
  typeof restaurantProfileMinimalSchema
>;
export type RestaurantRatingCreateType = z.infer<
  typeof restaurantRatingCreateSchema
>;
export type DriverRatingCreateType = z.infer<typeof driverRatingCreateSchema>;
export type OrderItemType = z.infer<typeof orderItemSchema>;
export type OrderCreateType = z.infer<typeof orderCreateSchema>;
export type OrderUpdateType = z.infer<typeof orderUpdateSchema>;
export type OrderItemResponseType = z.infer<typeof orderItemResponseSchema>;
export type OrderResponseType = z.infer<typeof orderResponseSchema>;
export type OpeningTimesCreateType = z.infer<typeof openingTimesCreateSchema>;
export type OpeningTimesUpdateType = z.infer<typeof openingTimesUpdateSchema>;
export type OpeningTimesResponseType = z.infer<
  typeof openingTimesResponseSchema
>;
export type MenuItemResponseType = z.infer<typeof menuItemResponseSchema>;
export type MenuItemResponseMinimalType = z.infer<
  typeof menuItemResponseMinimalSchema
>;
export type MenuItemCreateType = z.infer<typeof menuItemCreateSchema>;
export type MenuItemUpdateType = z.infer<typeof menuItemUpdateSchema>;
export type MenuItemSearchType = z.infer<typeof menuItemSearchSchema>;
export type LanguageCreateType = z.infer<typeof languageCreateSchema>;
export type LanguageUpdateType = z.infer<typeof languageUpdateSchema>;
export type LanguageResponseType = z.infer<typeof languageResponseSchema>;
export type CountryUpdateType = z.infer<typeof countryUpdateSchema>;
export type CountryResponseType = z.infer<typeof countryResponseSchema>;
export type MinimalCountryResponseType = z.infer<
  typeof minimalCountryResponseSchema
>;
export type DriverCreateType = z.infer<typeof driverCreateSchema>;
export type DriverUpdateType = z.infer<typeof driverUpdateSchema>;
export type DriverPrivateResponseType = z.infer<
  typeof driverPrivateResponseSchema
>;
export type DriverPublicResponseType = z.infer<
  typeof driverPublicResponseSchema
>;
export type EarningCreateType = z.infer<typeof earningCreateSchema>;
export type EarningUpdateType = z.infer<typeof earningUpdateSchema>;
export type EarningResponseType = z.infer<typeof earningResponseSchema>;
export type EarningSearchType = z.infer<typeof earningSearchSchema>;
export type EarningsSummaryType = z.infer<typeof earningsSummarySchema>;
export type DeliveryCreateType = z.infer<typeof deliveryCreateSchema>;
export type DeliveryUpdateType = z.infer<typeof deliveryUpdateSchema>;
export type DeliveryResponseType = z.infer<typeof deliveryResponseSchema>;
export type IdType = z.infer<typeof idSchema>;
export type PaginationType = z.infer<typeof paginationSchema>;
export type SearchType = z.infer<typeof searchSchema>;
export type DateRangeType = z.infer<typeof dateRangeSchema>;
export type MessageResponseType = z.infer<typeof messageResponseSchema>;
export type ErrorResponseType = z.infer<typeof errorResponseSchema>;
export type SuccessResponseType = z.infer<typeof successResponseSchema>;
export type CategoryCreateType = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateType = z.infer<typeof categoryUpdateSchema>;
export type CategoryResponseType = z.infer<typeof categoryResponseSchema>;
export type CartItemUpdateType = z.infer<typeof cartItemUpdateSchema>;
export type CartItemResponseType = z.infer<typeof cartItemResponseSchema>;
export type AddressCreateType = z.infer<typeof addressCreateSchema>;
export type AddressUpdateType = z.infer<typeof addressUpdateSchema>;
export type AddressResponseType = z.infer<typeof addressResponseSchema>;

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
export {
  DeliveryStatus,
  DeliveryType,
  OrderStatus,
  PaymentMethod,
  UserRoleValue,
};

// Response types

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
  sampleResponse?: string;
  examples?: Record<string, unknown>;
  webhookEvents?: string[];
  webhookDescription?: string;
}

export enum DatabaseProvider {
  SQLITE = "sqlite",
  POSTGRESQL = "postgresql",
  MYSQL = "mysql",
  MONGODB = "mongodb",
}

// Custom API types
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  status: number;
};
