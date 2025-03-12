import type { Prisma } from "@prisma/client";
import type { z } from "zod";

import type {
  addressCreateSchema,
  addressResponseSchema,
  addressUpdateSchema,
  adminRegisterSchema,
  cartItemsResponseSchema,
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
  loginSchema,
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
  restaurantGetSchema,
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

export type ResponseType<TResponseData> =
  | SuccessResponse<TResponseData>
  | ErrorResponse;

export type SuccessResponse<T> = {
  success: true;
  data: T;
};

export type ErrorResponse = {
  success: false;
  message: string;
};

// Re-export all schema types for easier access
export type MessageResponseType = z.infer<typeof messageResponseSchema>;
export type ErrorResponseType = z.infer<typeof errorResponseSchema>;
export type SuccessResponseType = z.infer<typeof successResponseSchema>;

export type UserPublicResponseType = z.infer<typeof userPublicResponseSchema>;
export type UserPublicDetailedResponseType = z.infer<
  typeof userPublicDetailedResponseSchema
>;
export type UserResponseMinimalType = z.infer<typeof userResponseMinimalSchema>;
export type UserResponseType = z.infer<typeof userResponseSchema>;
export type LoginResponseType = z.infer<typeof loginResponseSchema>;
export type LoginFormType = z.infer<typeof loginSchema>;
export type RegisterType = z.infer<typeof registerSchema>;
export type AdminRegisterType = z.infer<typeof adminRegisterSchema>;
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
export type RestaurantGetType = z.infer<typeof restaurantGetSchema>;
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
export type CategoryCreateType = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateType = z.infer<typeof categoryUpdateSchema>;
export type CategoryResponseType = z.infer<typeof categoryResponseSchema>;
export type CartItemUpdateType = z.infer<typeof cartItemUpdateSchema>;
export type CartItemsResponseType = z.infer<typeof cartItemsResponseSchema>;
export type AddressCreateType = z.infer<typeof addressCreateSchema>;
export type AddressUpdateType = z.infer<typeof addressUpdateSchema>;
export type AddressResponseType = z.infer<typeof addressResponseSchema>;

type Empty = Record<string, never>;

// Prisma types
export type DBUser = Prisma.UserGetPayload<Empty>;
export type DBUserRole = Prisma.UserRoleGetPayload<Empty>;
export type DBAddress = Prisma.AddressGetPayload<Empty>;
export type DBDriver = Prisma.DriverGetPayload<Empty>;
export type DBEarning = Prisma.EarningGetPayload<Empty>;
export type PasswordReset = Prisma.PasswordResetGetPayload<Empty>;
export type DBRestaurant = Prisma.RestaurantGetPayload<Empty>;
export type DBCategory = Prisma.CategoryGetPayload<Empty>;
export type DBOpeningTimes = Prisma.OpeningTimesGetPayload<Empty>;
export type DBCartItem = Prisma.CartItemGetPayload<Empty>;
export type DBMenuItem = Prisma.MenuItemGetPayload<Empty>;
export type DBOrder = Prisma.OrderGetPayload<Empty>;
export type DBOrderItem = Prisma.OrderItemGetPayload<Empty>;
export type DBDelivery = Prisma.DeliveryGetPayload<Empty>;
export type DBRestaurantRating = Prisma.RestaurantRatingGetPayload<Empty>;
export type DBDriverRating = Prisma.DriverRatingGetPayload<Empty>;
export type DBCountry = Prisma.CountryGetPayload<Empty>;
export type DBLanguages = Prisma.LanguagesGetPayload<Empty>;

// Extended types
export type DBCartItemExtended = Prisma.CartItemGetPayload<{
  select: {
    id: true;
    quantity: true;
    menuItem: {
      select: {
        id: true;
        name: true;
        description: true;
        price: true;
        taxPercent: true;
        image: true;
        restaurantId: true;
        category: {
          select: {
            id: true;
            name: true;
            image: true;
          };
        };
      };
    };
    restaurant: {
      select: {
        id: true;
        name: true;
        image: true;
      };
    };
  };
}>;

export type FullUserType = Prisma.UserGetPayload<{
  select: {
    id: true;
    firstName: true;
    lastName: true;
    email: true;
    password: true;
    userRoles: {
      select: {
        role: true;
        id: true;
        restaurantId: true;
      };
    };
    createdAt: true;
    updatedAt: true;
    addresses: {
      select: {
        id: true;
        userId: true;
        label: true;
        name: true;
        message: true;
        street: true;
        streetNumber: true;
        zip: true;
        city: true;
        phone: true;
        isDefault: true;
        country: {
          select: {
            code: true;
            name: true;
          };
        };
      };
    };
    cartItems: {
      select: {
        id: true;
        quantity: true;
        menuItem: {
          select: {
            id: true;
            name: true;
            description: true;
            price: true;
            taxPercent: true;
            image: true;
            published: true;
            availableFrom: true;
            availableTo: true;
            createdAt: true;
            updatedAt: true;
            category: {
              select: {
                id: true;
                name: true;
                image: true;
              };
            };
          };
        };
        restaurant: {
          select: {
            id: true;
            name: true;
            image: true;
          };
        };
      };
    };
  };
}>;

// prisma enums (cloned from prisma schema)
export enum OrderStatus {
  NEW = "NEW",
  PREPARING = "PREPARING",
  READY = "READY",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum DeliveryType {
  PICKUP = "PICKUP",
  DELIVERY = "DELIVERY",
}

export enum DeliveryStatus {
  ASSIGNED = "ASSIGNED",
  PICKED_UP = "PICKED_UP",
  DELIVERED = "DELIVERED",
}

export enum PaymentMethod {
  CARD = "CARD",
  CASH = "CASH",
}

export enum UserRoleValue {
  CUSTOMER = "CUSTOMER",
  RESTAURANT_ADMIN = "RESTAURANT_ADMIN",
  RESTAURANT_EMPLOYEE = "RESTAURANT_EMPLOYEE",
  DRIVER = "DRIVER",
  ADMIN = "ADMIN",
}

export enum DatabaseProvider {
  SQLITE = "sqlite",
  POSTGRESQL = "postgresql",
  MYSQL = "mysql",
  MONGODB = "mongodb",
}
