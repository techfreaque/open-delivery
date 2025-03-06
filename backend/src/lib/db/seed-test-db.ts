/* eslint-disable no-console */
/**
 * Seed script for test database
 * This creates sample data for testing purposes
 */
import { DeliveryStatus, DeliveryType, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { examples } from "../examples/data";

// Initialize Prisma client
const prisma = new PrismaClient();

export default async function seedTestDatabase(): Promise<void> {
  console.log("🌱 Seeding test database...");

  // Use test data from examples
  const {
    users,
    addresses,
    restaurants,
    menuItems,
    orders,
    orderItems,
    deliveries,
    drivers,
  } = examples.testData;

  // Create test users
  const createdUsers = [];
  for (const userData of users) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const newUser = await prisma.user.create({
        data: {
          id: userData.id,
          email: userData.email,
          password: hashedPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
        },
      });

      console.log(`👤 Created user: ${newUser.firstName} (${newUser.email})`);

      // Add user role
      await prisma.userRole.create({
        data: {
          userId: newUser.id,
          role: userData.roleValue,
        },
      });

      console.log(`👑 Added role ${userData.roleValue} to ${newUser.email}`);

      createdUsers.push(newUser);
    } catch (error) {
      console.error(`Failed to create user ${userData.email}:`, error);
    }
  }
  console.log(`✅ Created ${createdUsers.length} test users`);

  // Create countries first (required for addresses)
  const countries = [
    {
      name: "Germany",
      code: "DE",
    },
    {
      name: "United States",
      code: "US",
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
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error(`Failed to create country ${country.name}:`, error);
    }
  }

  // Create categories (required for restaurants and menu items)
  const categories = [
    {
      id: "cat-pizza",
      name: "Pizza",
      image: "/categories/pizza.jpg",
    },
    {
      id: "cat-burger",
      name: "Burgers",
      image: "/categories/burger.jpg",
    },
  ];

  for (const category of categories) {
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
      console.error(`Failed to create category ${category.name}:`, error);
    }
  }

  // Create addresses
  const createdAddresses = [];
  for (const address of addresses) {
    try {
      // Create combined address string from individual components
      const createdAddress = await prisma.address.create({
        data: {
          id: address.id,
          userId: address.userId,
          label: address.label,
          street: address.street,
          streetNumber: address.streetNumber,
          city: address.city,
          zip: address.zip,
          phone: address.phone,
          isDefault: address.isDefault,
          countryId: address.country,
          name: address.name,
          message: address.message,
        },
      });

      createdAddresses.push(createdAddress);
    } catch (error) {
      console.error(`Failed to create address:`, error);
    }
  }
  console.log(`✅ Created ${createdAddresses.length} test addresses`);

  // Create restaurants
  const createdRestaurants = [];
  for (const restaurant of restaurants) {
    try {
      const createdRestaurant = await prisma.restaurant.create({
        data: {
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
          countryId: "DE",
          userRoles: {
            create: [
              {
                role: "RESTAURANT_ADMIN",
                userId: restaurant.userId,
              },
            ],
          },
          mainCategoryId: "cat-pizza", // Use created category
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      createdRestaurants.push(createdRestaurant);
      console.log(`🍔 Created restaurant: ${createdRestaurant.name}`);
    } catch (error) {
      console.error(`Failed to create restaurant ${restaurant.name}:`, error);
    }
  }
  console.log(`✅ Created ${createdRestaurants.length} test restaurants`);

  // Create menu items
  const menuItemsCreated = [];
  for (const menuItem of menuItems) {
    try {
      const createdMenuItem = await prisma.menuItem.create({
        data: {
          id: menuItem.id,
          name: menuItem.name,
          description: menuItem.description,
          price: menuItem.price,
          image: menuItem.image || "",
          taxPercent: menuItem.taxPercent,
          published: true,
          restaurantId: menuItem.restaurantId,
          categoryId: "cat-pizza", // Using pizza for all for simplicity
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      menuItemsCreated.push(createdMenuItem);
      console.log(`🍕 Created menu item: ${createdMenuItem.name}`);
    } catch (error) {
      console.error(`Failed to create menu item ${menuItem.name}:`, error);
    }
  }
  console.log(`✅ Created ${menuItemsCreated.length} test menu items`);

  // Create orders
  const ordersCreated = [];
  for (const order of orders) {
    // Check if restaurant exists
    const restaurant = createdRestaurants.find(
      (r) => r.id === order.restaurantId,
    );
    if (!restaurant) {
      console.warn(`⚠️ Skipping order ${order.id}: Restaurant not found`);
      continue;
    }

    try {
      // Create a delivery first (required for order)
      const delivery = await prisma.delivery.create({
        data: {
          type: DeliveryType.DELIVERY,
          status: DeliveryStatus.ASSIGNED,
          estimatedDelivery: new Date(),
          distance: 2.5,
          message: "Please deliver quickly",
          updatedAt: new Date(),
          createdAt: new Date(),
          dropAddress: "123 Delivery St",
        },
      });

      // Create order
      const createdOrder = await prisma.order.create({
        data: {
          id: order.id,
          status: order.status,
          total: order.total,
          deliveryFee: order.deliveryFee || 2.99,
          message: "Ring the doorbell",
          restaurantId: order.restaurantId,
          customerId: order.customerId,
          deliveryId: delivery.id,
          createdAt: new Date(),
        },
      });

      ordersCreated.push(createdOrder);
      console.log(`📦 Created order: ${createdOrder.id}`);
    } catch (error) {
      console.error(`Failed to create order ${order.id}:`, error);
    }
  }
  console.log(`✅ Created ${ordersCreated.length} test orders`);

  // Create order items
  const orderItemsCreated = [];
  for (const item of testOrderItems) {
    try {
      const createdItem = await prisma.orderItem.create({
        data: {
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          taxPercent: item.taxPercent,
          menuItemId: item.menuItemId,
          orderId: item.orderId,
          message: "No extra cheese please",
        },
      });

      orderItemsCreated.push(createdItem);
    } catch (error) {
      console.error(`Failed to create order item ${item.id}:`, error);
    }
  }
  console.log(`✅ Created ${orderItemsCreated.length} test order items`);

  // Create driver profiles
  const driversCreated = [];
  for (const driver of drivers) {
    try {
      const createdDriver = await prisma.driver.create({
        data: {
          id: driver.id,
          userId: driver.userId,
          vehicle: driver.vehicle,
          licensePlate: driver.licensePlate,
          isActive: true,
          street: "123 Driver St",
          streetNumber: "1",
          zip: "12345",
          city: "Driver City",
          countryId: "DE",
          radius: 10.0, // Delivery radius in km
          updatedAt: new Date(),
        },
      });

      driversCreated.push(createdDriver);
      console.log(`🚗 Created driver profile: ${createdDriver.id}`);
    } catch (error) {
      console.error(`Failed to create driver ${driver.id}:`, error);
    }
  }
  console.log(`✅ Created ${driversCreated.length} test driver profiles`);

  console.log("✅ Test database seeded successfully!");
}

// If this script is run directly
if (require.main === module) {
  seedTestDatabase()
    .catch((e) => {
      console.error("Error seeding database:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
