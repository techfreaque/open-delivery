/* eslint-disable no-console */
/**
 * Seed script for test database
 * This creates sample data for testing purposes
 */
import bcrypt from "bcryptjs";

import { createOrder } from "@/app/api/v1/orders/route";

import { env } from "../env";
import { examples } from "../examples/data";
import { getCoordinatesFromAddress } from "../geo/distance";
import { prisma } from "./prisma";
// Initialize Prisma client

export default async function seedTestDatabase(): Promise<void> {
  await cleanDatabase();
  console.log("🌱 Seeding test database...");

  // Use test data from examples
  const {
    userExamples,
    restaurantExamples,
    menuItemExamples,
    orderExamples,
    driverExamples,
    addressExamples,
    cartExamples,
    categoryExamples,
  } = examples.testData;

  // Create test users
  for (const userData of Object.values(userExamples)) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        console.log(`⚠️ Skipping user ${userData.email}: Already exists`);
        continue;
      }

      const newUser = await prisma.user.upsert({
        where: { id: userData.id },
        update: {
          email: userData.email,
          password: hashedPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
        },
        create: {
          id: userData.id,
          email: userData.email,
          password: hashedPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
          userRoles: {
            create: userData.userRoles,
          },
        },
      });

      console.log(`👤 Created user: ${newUser.firstName} (${newUser.email})`);
    } catch (error) {
      throw new Error(`Failed to create user ${userData.email}: ${error}`);
    }
  }
  console.log(`✅ Created ${Object.values(userExamples).length} test users`);

  // create languages

  const languages = [
    {
      code: "de",
      name: "Deutsch",
    },
    {
      code: "en",
      name: "English",
    },
  ];

  for (const language of languages) {
    try {
      await prisma.languages.upsert({
        where: { code: language.code },
        update: {},
        create: {
          code: language.code,
          name: language.name,
        },
      });
    } catch (error) {
      throw new Error(`Failed to create language ${language.name}: ${error}`);
    }
  }

  // Create countries
  const countries = [
    {
      name: "Deutschland",
      code: "DE",
    },
    {
      name: "Österreich",
      code: "AT",
    },
  ];

  for (const country of countries) {
    try {
      await prisma.country.upsert({
        where: { code: country.code },
        update: {},
        create: {
          name: country.name,
          code: country.code,
          languages: {
            connect: languages.map((l) => ({ code: l.code })),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      throw new Error(`Failed to create country ${country.name}: ${error}`);
    }
  }

  // Create categories (required for restaurants and menu items)

  for (const category of Object.values(categoryExamples)) {
    try {
      await prisma.category.upsert({
        where: { id: category.id },
        update: {},
        create: {
          id: category.id,
          name: category.name,
          image: category.image,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      throw new Error(`Failed to create category ${category.name}: ${error}`);
    }
  }

  // Create addresses
  for (const address of Object.values(addressExamples)) {
    try {
      await prisma.address.upsert({
        where: { id: address.id },
        update: {
          userId: address.userId,
          label: address.label,
          street: address.street,
          streetNumber: address.streetNumber,
          city: address.city,
          zip: address.zip,
          phone: address.phone,
          isDefault: address.isDefault || false,
          countryId: address.countryId,
          name: address.name,
          message: address.message,
        },
        create: {
          id: address.id,
          userId: address.userId,
          label: address.label,
          street: address.street,
          streetNumber: address.streetNumber,
          city: address.city,
          zip: address.zip,
          phone: address.phone,
          isDefault: address.isDefault || false,
          countryId: address.countryId,
          name: address.name,
          message: address.message,
        },
      });
    } catch (error) {
      throw new Error(`Failed to create address: ${error}`);
    }
  }
  console.log(
    `✅ Created ${Object.values(addressExamples).length} test addresses`,
  );

  // Create restaurants
  for (const restaurant of Object.values(restaurantExamples)) {
    try {
      const coordinates = await getCoordinatesFromAddress(restaurant);
      if ("error" in coordinates) {
        throw new Error(
          `Failed to get coordinates for restaurant ${restaurant.name}: ${coordinates.error}`,
        );
      }
      const { latitude, longitude } = coordinates;
      const createdRestaurant = await prisma.restaurant.upsert({
        where: { id: restaurant.id },
        update: {
          name: restaurant.name,
          description: restaurant.description,
          image: restaurant.image,
          phone: restaurant.phone,
          email: restaurant.email,
          street: restaurant.street,
          streetNumber: restaurant.streetNumber || "1",
          city: restaurant.city,
          zip: restaurant.zip,
          countryId: restaurant.countryId,
          userRoles: {
            create: restaurant.userRoles,
          },
          mainCategoryId: restaurant.mainCategoryId,
          latitude: latitude,
          longitude: longitude,
          published: restaurant.published,
          updatedAt: new Date(),
        },
        create: {
          id: restaurant.id,
          name: restaurant.name,
          description: restaurant.description,
          image: restaurant.image,
          phone: restaurant.phone,
          email: restaurant.email,
          street: restaurant.street,
          streetNumber: restaurant.streetNumber || "1",
          city: restaurant.city,
          zip: restaurant.zip,
          countryId: restaurant.countryId,
          userRoles: {
            create: restaurant.userRoles,
          },
          mainCategoryId: restaurant.mainCategoryId,
          latitude: latitude,
          longitude: longitude,
          published: restaurant.published,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      console.log(`🍔 Created restaurant: ${createdRestaurant.name}`);
    } catch (error) {
      throw new Error(
        `Failed to create restaurant ${restaurant.name}: ${error}`,
      );
    }
  }
  console.log(
    `✅ Created ${Object.values(restaurantExamples).length} test restaurants`,
  );

  // Create menu items
  for (const menuItem of Object.values(menuItemExamples)) {
    try {
      // Remove the category check that's causing errors
      const createdMenuItem = await prisma.menuItem.upsert({
        where: { id: menuItem.id },
        update: {
          name: menuItem.name,
          description: menuItem.description,
          price: menuItem.price,
          image: menuItem.image,
          taxPercent: menuItem.taxPercent,
          published: menuItem.published,
          restaurantId: menuItem.restaurantId,
          categoryId: menuItem.categoryId,
          availableFrom: menuItem.availableFrom,
          availableTo: menuItem.availableTo,
          updatedAt: new Date(),
        },
        create: {
          id: menuItem.id,
          name: menuItem.name,
          description: menuItem.description,
          price: menuItem.price,
          image: menuItem.image,
          taxPercent: menuItem.taxPercent,
          published: menuItem.published,
          restaurantId: menuItem.restaurantId,
          categoryId: menuItem.categoryId,
          availableFrom: menuItem.availableFrom,
          availableTo: menuItem.availableTo,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      console.log(`🍕 Created menu item: ${createdMenuItem.name}`);
    } catch (error) {
      throw new Error(`Failed to create menu item ${menuItem.name}: ${error}`);
    }
  }
  console.log(
    `✅ Created ${Object.values(menuItemExamples).length} test menu items`,
  );

  // Create cartExamples
  for (const cartItem of Object.values(cartExamples)) {
    try {
      await prisma.cartItem.upsert({
        where: { id: cartItem.id },
        update: {
          quantity: cartItem.quantity,
        },
        create: {
          id: cartItem.id,
          userId: cartItem.userId,
          menuItemId: cartItem.menuItemId,
          restaurantId: cartItem.restaurantId,
          quantity: cartItem.quantity,
        },
      });
    } catch (error) {
      throw new Error(`Failed to create cart item ${cartItem.id}: ${error}`);
    }
  }
  console.log(
    `✅ Created ${Object.values(addressExamples).length} test addresses`,
  );

  // Create orders and order items only if the restaurants exist
  for (const order of Object.values(orderExamples)) {
    try {
      await createOrder(order, order.id);
    } catch (err) {
      const error = err as Error;
      throw new Error(`Failed to create order ${order.id}: ${error.message}`);
    }
  }
  console.log(`✅ Created ${Object.values(orderExamples).length} test orders`);

  // Create driver profiles
  for (const driver of Object.values(driverExamples)) {
    const coordinates = await getCoordinatesFromAddress(driver);
    if ("error" in coordinates) {
      throw new Error(
        `Failed to get coordinates for driver ${driver.id}: ${coordinates.error}`,
      );
    }
    const { latitude, longitude } = coordinates;
    try {
      const createdDriver = await prisma.driver.upsert({
        where: { userId: driver.userId },
        update: {
          vehicle: driver.vehicle,
          licensePlate: driver.licensePlate,
          isActive: true,
          street: driver.street,
          streetNumber: driver.streetNumber,
          zip: driver.zip,
          city: driver.city,
          countryId: driver.countryId,
          radius: driver.radius,
          latitude,
          longitude,
          updatedAt: new Date(),
        },
        create: {
          id: driver.id,
          userId: driver.userId,
          vehicle: driver.vehicle,
          licensePlate: driver.licensePlate,
          isActive: true,
          street: driver.street,
          streetNumber: driver.streetNumber,
          zip: driver.zip,
          city: driver.city,
          countryId: driver.countryId,
          radius: driver.radius,
          latitude,
          longitude,
          updatedAt: new Date(),
        },
      });
      console.log(`🚗 Created driver profile: ${createdDriver.id}`);
    } catch (error) {
      throw new Error(`Failed to create driver profile: ${error}`);
    }
  }
  console.log(
    `✅ Created ${Object.values(driverExamples).length} test driver profiles`,
  );

  console.log("✅ Test database seeded successfully!");
}

async function cleanDatabase(): Promise<void> {
  // Clear all data to start fresh
  console.log("Cleaning database before tests...");
  if (env.NODE_ENV === "production") {
    throw new Error("Cannot clean production database");
  }
  try {
    await prisma.$transaction([
      // First delete items that depend on orders
      prisma.orderItem.deleteMany({}),
      // Then delete the delivery records
      prisma.delivery.deleteMany({}),
      // Then delete orders
      prisma.order.deleteMany({}),
      // Then delete other tables with less dependencies
      prisma.cartItem.deleteMany({}),
      prisma.menuItem.deleteMany({}),
      prisma.earning.deleteMany({}),
      prisma.restaurant.deleteMany({}),
      prisma.driver.deleteMany({}),
      prisma.userRole.deleteMany({}),
      prisma.session.deleteMany({}),
      prisma.address.deleteMany({}),
      prisma.passwordReset.deleteMany({}),
      prisma.code.deleteMany({}),
      prisma.like.deleteMany({}),
      prisma.bugReport.deleteMany({}),
      prisma.subPrompt.deleteMany({}),
      prisma.uI.deleteMany({}),
      prisma.user.deleteMany({}),
    ]);

    console.log("Database cleaned successfully");
  } catch (error) {
    console.error("Error cleaning database:", error);
    throw error;
  }
}

// If this script is run directly
if (require.main === module) {
  seedTestDatabase()
    .catch((e) => {
      console.error("Error seeding database:", e);
      process.exit(1);
    })
    .finally(() => {
      void prisma.$disconnect();
    });
}
