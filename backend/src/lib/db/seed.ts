/* eslint-disable no-console */
import { PrismaClient, type UserRoleValue } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function seedDatabase(): Promise<void> {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.userRole.deleteMany({});
  await prisma.user.deleteMany({});

  // Create users with different roles
  const password = await hash("password", 10);

  // Create customer user
  const customer = await prisma.user.create({
    data: {
      id: "customer",
      name: "John Customer",
      email: "customer@example.com",
      password: password,
      userRoles: {
        create: [
          {
            role: "CUSTOMER" as UserRoleValue,
          },
        ],
      },
    },
  });
  console.log(`Created customer user: ${customer.email}`);

  // Create restaurant owner
  const restaurantOwner = await prisma.user.create({
    data: {
      id: "restaurantOwner",
      name: "Jane Restaurant",
      email: "restaurant@example.com",
      password: password,
      userRoles: {
        create: [
          {
            role: "RESTAURANT_ADMIN" as UserRoleValue,
          },
        ],
      },
    },
  });
  console.log(`Created restaurant owner user: ${restaurantOwner.email}`);

  // Create restaurant employee
  await prisma.user.create({
    data: {
      id: "restaurantEmployee",
      name: "Jane Restaurant Employee",
      email: "restaurant_employee@example.com",
      password: password,
      userRoles: {
        create: [
          {
            role: "RESTAURANT_EMPLOYEE" as UserRoleValue,
          },
        ],
      },
    },
  });

  // Create driver
  const driver = await prisma.user.create({
    data: {
      id: "driver",
      name: "Sam Driver",
      email: "driver@example.com",
      password: password,
      userRoles: {
        create: [
          {
            role: "DRIVER" as UserRoleValue,
          },
        ],
      },
    },
  });
  console.log(`Created driver user: ${driver.email}`);

  // Create admin with multiple roles
  const admin = await prisma.user.create({
    data: {
      id: "admin",
      name: "Admin User",
      email: "admin@example.com",
      password: password,
      userRoles: {
        create: [
          {
            role: "ADMIN" as UserRoleValue,
          },
        ],
      },
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  console.log("Database seeding completed successfully!");
}

seedDatabase()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
