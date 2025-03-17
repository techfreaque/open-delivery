import type { FullUserType } from "@/client-package/types/types";
import { prisma } from "@/next-portal/db";

const fullUserQuery = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  password: true,
  imageUrl: true,
  userRoles: {
    select: {
      role: true,
      id: true,
      restaurantId: true,
    },
  },
  createdAt: true,
  updatedAt: true,
  addresses: {
    select: {
      id: true,
      userId: true,
      label: true,
      name: true,
      message: true,
      street: true,
      streetNumber: true,
      zip: true,
      city: true,
      phone: true,
      isDefault: true,
      country: {
        select: {
          code: true,
          name: true,
        },
      },
    },
  },
  cartItems: {
    select: {
      id: true,
      quantity: true,
      menuItem: {
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          taxPercent: true,
          image: true,
          published: true,
          availableFrom: true,
          availableTo: true,
          createdAt: true,
          updatedAt: true,
          category: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
      restaurant: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  },
};

export async function getFullUser(userId: string): Promise<FullUserType> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: fullUserQuery,
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}
