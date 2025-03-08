/* eslint-disable no-console */
/**
 * Seed script for test database
 * This creates sample data for testing purposes
 */
import bcrypt from "bcryptjs";

import { DeliveryStatus, DeliveryType } from "@/types/types";

import { examples } from "../examples/data";
import { prisma } from "./prisma";
// Initialize Prisma client

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

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        console.log(`⚠️ Skipping user ${userData.email}: Already exists`);
        continue;
      }

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
      const createdAddress = await prisma.address.upsert({
        where: { id: address.id },
        update: {
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
        create: {
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
          zip: "12345",
          countryId: "DE",
          mainCategoryId: "cat-pizza",
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
          zip: "12345",
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
      // Remove the category check that's causing errors
      const createdMenuItem = await prisma.menuItem.upsert({
        where: { id: menuItem.id },
        update: {
          name: menuItem.name,
          description: menuItem.description,
          price: menuItem.price,
          image: menuItem.image || "",
          taxPercent: menuItem.taxPercent,
          published: true,
          restaurantId: menuItem.restaurantId,
          categoryId: "cat-pizza",
          updatedAt: new Date(),
        },
        create: {
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

  // Create orders and order items only if the restaurants exist
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

    // For order items, we should check both order and menu item
    // Only attempt to create order items for orders that were successfully created
    try {
      // Create order with delivery
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
          order: {
            create: {
              id: order.id,
              status: order.status,
              total: order.total,
              deliveryFee: order.deliveryFee || 2.99,
              message: "Ring the doorbell",
              restaurantId: order.restaurantId,
              customerId: order.customerId,
              // Use a known existing address ID
              addressId: createdAddresses[0]?.id || addresses[0]?.id,
              createdAt: new Date(),
            },
          },
        },
        include: {
          order: true,
        },
      });

      // Now we can safely create order items for this order
      if (delivery.order) {
        const createdOrder = delivery.order;
        ordersCreated.push(createdOrder);
        console.log(`📦 Created order: ${createdOrder.id}`);

        // Find and create order items for this order
        const itemsForOrder = orderItems.filter(
          (item) => item.orderId === createdOrder.id,
        );
        for (const item of itemsForOrder) {
          try {
            // Check if menu item exists
            const menuItem = menuItemsCreated.find(
              (m) => m.id === item.menuItemId,
            );
            if (!menuItem) {
              console.warn(`⚠️ Skipping order item: Menu item not found`);
              continue;
            }

            await prisma.orderItem.create({
              data: {
                id: item.id,
                quantity: item.quantity,
                price: item.price,
                taxPercent: item.taxPercent,
                menuItemId: item.menuItemId,
                orderId: createdOrder.id,
                message: "No extra cheese please",
              },
            });
            console.log(`📝 Created order item`);
          } catch (itemError) {
            console.error(`Failed to create order item:`, itemError);
          }
        }
      }
    } catch (error) {
      console.error(`Failed to create order ${order.id}:`, error);
    }
  }
  console.log(`✅ Created ${ordersCreated.length} test orders`);

  // Create driver profiles
  const driversCreated = [];
  for (const driver of drivers) {
    try {
      const createdDriver = await prisma.driver.upsert({
        where: { userId: driver.userId },
        update: {
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
        create: {
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
    .finally(() => {
      void prisma.$disconnect();
    });
}
