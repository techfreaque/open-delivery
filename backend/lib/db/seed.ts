import { hash } from "bcryptjs";

import { prisma } from "./prisma";

async function seedDatabase(): Promise<void> {
  // eslint-disable-next-line no-console
  console.log("Seeding database...");

  // Clear existing data
  await prisma.earning.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();

  // Create users with different roles
  const customerPassword = await hash("password123", 10);
  const customer = await prisma.user.create({
    data: {
      name: "John Customer",
      email: "customer@example.com",
      password: customerPassword,
      role: "customer",
    },
  });

  const restaurantPassword = await hash("password123", 10);
  const restaurantUser = await prisma.user.create({
    data: {
      name: "Alice Restaurant",
      email: "restaurant@example.com",
      password: restaurantPassword,
      role: "restaurant",
    },
  });

  const driverPassword = await hash("password123", 10);
  const driverUser = await prisma.user.create({
    data: {
      name: "Bob Driver",
      email: "driver@example.com",
      password: driverPassword,
      role: "driver",
    },
  });

  // Create restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      userId: restaurantUser.id,
      name: "Alice's Restaurant",
      description: "A wonderful place to eat",
      address: "123 Main St, Anytown, USA",
      phone: "+12345678901",
      email: restaurantUser.email,
      image: "/restaurant-placeholder.jpg",
      cuisine: "American",
    },
  });

  // Create menu items
  const burger = await prisma.menuItem.create({
    data: {
      restaurantId: restaurant.id,
      name: "Classic Burger",
      description: "Juicy beef patty with all the fixings",
      price: 9.99,
      image: "/burger.jpg",
      category: "Main",
    },
  });

  const fries = await prisma.menuItem.create({
    data: {
      restaurantId: restaurant.id,
      name: "French Fries",
      description: "Crispy golden fries",
      price: 3.99,
      image: "/fries.jpg",
      category: "Side",
    },
  });

  // Create driver
  const driver = await prisma.driver.create({
    data: {
      userId: driverUser.id,
      vehicle: "Toyota Prius",
      licensePlate: "ECO123",
    },
  });

  // Create order
  const order = await prisma.order.create({
    data: {
      restaurantId: restaurant.id,
      customerId: customer.id,
      driverId: driverUser.id,
      status: "delivered",
      total: 15.98,
      deliveryFee: 2.99,
      tax: 1.0,
      address: "456 Oak St, Anytown, USA",
      deliveredAt: new Date(),
    },
  });

  // Create order items
  await prisma.orderItem.create({
    data: {
      orderId: order.id,
      menuItemId: burger.id,
      quantity: 1,
      price: 9.99,
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: order.id,
      menuItemId: fries.id,
      quantity: 1,
      price: 3.99,
    },
  });

  // Create earnings record
  await prisma.earning.create({
    data: {
      driverId: driver.id,
      date: new Date(),
      amount: 5.99,
      deliveries: 1,
    },
  });

  // eslint-disable-next-line no-console
  console.log("Seeding complete!");
}

seedDatabase()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
