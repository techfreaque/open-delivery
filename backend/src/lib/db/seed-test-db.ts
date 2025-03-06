/* eslint-disable no-console */

import type { DeliveryStatus, DeliveryType, OrderStatus } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

import {
  testAddresses,
  testDeliveries,
  testMenuItems,
  testOrderItems,
  testOrders,
  testRestaurants,
  testUsers,
} from "@/lib/examples/data";

// Create a new PrismaClient instance for seeding
const prisma = new PrismaClient();

/**
 * Seeds the test database with standard test data
 */
export async function seedTestDatabase(): Promise<void> {
  console.log("🌱 Seeding test database...");

  try {
    // Clear existing data
    await prisma.$transaction([
      prisma.orderItem.deleteMany(),
      prisma.order.deleteMany(),
      prisma.cartItem.deleteMany(),
      prisma.menuItem.deleteMany(),
      prisma.delivery.deleteMany(),
      prisma.restaurant.deleteMany(),
      prisma.userRole.deleteMany(),
      prisma.address.deleteMany(),
      prisma.user.deleteMany(),
    ]);

    // Create users (no roles)
    const createdUsers = {};
    if (testUsers && Array.isArray(testUsers)) {
      for (const user of testUsers) {
        const hashedPassword = await hash(user.password, 10);

        try {
          const createdUser = await prisma.user.create({
            data: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              password: hashedPassword,
            },
          });

          createdUsers[user.id] = createdUser;
          console.log(`👤 Created user: ${user.name} (${user.email})`);

          // Add user roles
          if (user.roleValue) {
            await prisma.userRole.create({
              data: {
                userId: createdUser.id,
                role: user.roleValue,
              },
            });
            console.log(`👑 Added role ${user.roleValue} to ${user.email}`);
          }
        } catch (userError) {
          console.error(`Failed to create user ${user.email}:`, userError);
          throw userError;
        }
      }
      console.log(`✅ Created ${testUsers.length} test users`);
    }

    // Create test addresses
    if (testAddresses && Array.isArray(testAddresses)) {
      const addresses = [];
      for (const address of testAddresses) {
        try {
          // Create combined address string from individual components
          const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;

          const createdAddress = await prisma.address.create({
            data: {
              id: address.id,
              label: address.label,
              address: address.address || fullAddress, // Use provided address or generate it
              userId: address.userId,
              // Add the required fields
              street: address.street || "Unknown Street",
              city: address.city || "Unknown City",
              state: address.state || "Unknown State",
              zipCode: address.zipCode || "00000",
              country: address.country || "Unknown Country",
              latitude: address.latitude || 0,
              longitude: address.longitude || 0,
            },
          });

          addresses.push(createdAddress);
          console.log(`📍 Created address: ${fullAddress}`);
        } catch (error) {
          console.error(`Failed to create address:`, error);
        }
      }
      console.log(`✅ Created ${addresses.length} test addresses`);
    }

    // Create test restaurants
    if (testRestaurants && Array.isArray(testRestaurants)) {
      const restaurants = [];

      for (const restaurant of testRestaurants) {
        try {
          const createdRestaurant = await prisma.restaurant.create({
            data: {
              id: restaurant.id,
              name: restaurant.name,
              description: restaurant.description,
              image: restaurant.image,
              phone: restaurant.phone,
              email: restaurant.email,
              cuisine: restaurant.cuisine,
              rating: restaurant.rating,
              isOpen: restaurant.isOpen,
              userId: restaurant.userId || restaurant.ownerId, // Connect to owner
              // Add the required fields
              street: restaurant.street || "123 Restaurant St",
              city: restaurant.city || "Restaurant City",
              state: restaurant.state || "Restaurant State",
              zipCode: restaurant.zipCode || "12345",
              country: restaurant.country || "Restaurant Country",
              latitude: restaurant.latitude || 0,
              longitude: restaurant.longitude || 0,
            },
          });

          restaurants.push(createdRestaurant);
          console.log(`🍽️ Created restaurant: ${restaurant.name}`);
        } catch (error) {
          console.error(
            `Failed to create restaurant ${restaurant.name}:`,
            error,
          );
        }
      }

      console.log(`✅ Created ${restaurants.length} test restaurants`);
    }

    // Create test menu items
    if (testMenuItems && Array.isArray(testMenuItems)) {
      const menuItems = [];
      for (const menuItem of testMenuItems) {
        try {
          const createdMenuItem = await prisma.menuItem.create({
            data: {
              id: menuItem.id,
              name: menuItem.name,
              description: menuItem.description,
              price: menuItem.price,
              image: menuItem.image,
              category: menuItem.category,
              restaurantId: menuItem.restaurantId,
              isAvailable: menuItem.isAvailable,
              // Add the required field
              taxPercent: menuItem.taxPercent || 8.0, // Default 8% tax
            },
          });

          menuItems.push(createdMenuItem);
          console.log(`🍕 Created menu item: ${menuItem.name}`);
        } catch (error) {
          console.error(`Failed to create menu item ${menuItem.name}:`, error);
        }
      }

      console.log(`✅ Created ${menuItems.length} test menu items`);
    }

    // Create test orders
    if (testOrders && Array.isArray(testOrders)) {
      const orders = [];

      for (const order of testOrders) {
        try {
          // For each order, find the address to use as text
          const deliveryAddress = testAddresses.find(
            (addr) => addr.id === order.deliveryAddressId,
          );
          const addressText = deliveryAddress
            ? deliveryAddress.address
            : "Default Address";

          // Check if restaurant exists
          const restaurant = await prisma.restaurant.findUnique({
            where: { id: order.restaurantId },
          });

          if (restaurant) {
            const createdOrder = await prisma.order.create({
              data: {
                id: order.id,
                total: order.total,
                tax: order.tax,
                deliveryFee: order.deliveryFee,
                status: order.status as OrderStatus,
                customerId: order.customerId,
                address: addressText,
                createdAt: order.createdAt
                  ? new Date(order.createdAt)
                  : undefined,
                deliveredAt: order.deliveredAt
                  ? new Date(order.deliveredAt)
                  : null,
                restaurant: {
                  connect: { id: order.restaurantId },
                },
              },
            });

            orders.push(createdOrder);
            console.log(`🛒 Created order: ${order.id}`);
          } else {
            console.log(`⚠️ Skipping order ${order.id}: Restaurant not found`);
          }
        } catch (error) {
          console.error(`Failed to create order ${order.id}:`, error);
        }
      }

      console.log(`✅ Created ${orders.length} test orders`);
    }

    // Create test order items - only after orders exist
    if (testOrderItems && Array.isArray(testOrderItems)) {
      const orderItems = [];

      for (const item of testOrderItems) {
        try {
          const createdItem = await prisma.orderItem.create({
            data: {
              id: item.id,
              quantity: item.quantity,
              price: item.price,
              menuItemId: item.menuItemId,
              orderId: item.orderId,
              // Add the required field
              taxPercent: item.taxPercent || 8.0, // Default 8% tax
            },
          });

          orderItems.push(createdItem);
          console.log(`🍔 Created order item: ${item.id}`);
        } catch (error) {
          console.error(`Failed to create order item ${item.id}:`, error);
        }
      }

      console.log(`✅ Created ${orderItems.length} test order items`);
    }

    // Create test deliveries
    if (testDeliveries && Array.isArray(testDeliveries)) {
      const deliveries = [];

      for (const delivery of testDeliveries) {
        try {
          const createdDelivery = await prisma.delivery.create({
            data: {
              id: delivery.id,
              orderId: delivery.orderId,
              status: delivery.status as DeliveryStatus,
              estimatedDelivery: delivery.estimatedDelivery
                ? new Date(delivery.estimatedDelivery)
                : null,
              estimatedTime: delivery.estimatedTime,
              distance: delivery.distance,
              tip: delivery.tip,
              pickupLat: delivery.pickupLat,
              pickupLng: delivery.pickupLng,
              dropoffLat: delivery.dropoffLat,
              dropoffLng: delivery.dropoffLng,
              // Add the required field
              type: delivery.type || ("STANDARD" as DeliveryType),
            },
          });

          deliveries.push(createdDelivery);
          console.log(`🚚 Created delivery: ${delivery.id}`);
        } catch (error) {
          console.error(`Failed to create delivery ${delivery.id}:`, error);
        }
      }

      console.log(`✅ Created ${deliveries.length} test deliveries`);
    }

    console.log("✅ Test database seeded successfully!");
  } catch (error) {
    console.error("Error seeding test database:", error);
    throw error;
  } finally {
    // Disconnect prisma client to avoid hanging connections
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  // Only run when directly executed
  void seedTestDatabase().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export default seedTestDatabase;
