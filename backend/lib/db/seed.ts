import { db } from "./index"
import * as schema from "./schema"
import { v4 as uuidv4 } from "uuid"
import { hash } from "bcryptjs"

async function seed() {
  console.log("🌱 Seeding database...")

  // Clear existing data
  await db.delete(schema.earnings)
  await db.delete(schema.orderItems)
  await db.delete(schema.orders)
  await db.delete(schema.menuItems)
  await db.delete(schema.drivers)
  await db.delete(schema.restaurants)
  await db.delete(schema.users)

  console.log("🧹 Cleared existing data")

  // Create admin user
  const adminPassword = await hash("adm", 10)
  const adminId = uuidv4()
  await db.insert(schema.users).values({
    id: adminId,
    email: "adm",
    password: adminPassword,
    name: "Admin User",
    role: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  console.log("👤 Created admin user")

  // Create restaurant user
  const restaurantPassword = await hash("password", 10)
  const restaurantUserId = uuidv4()
  await db.insert(schema.users).values({
    id: restaurantUserId,
    email: "restaurant@example.com",
    password: restaurantPassword,
    name: "Restaurant Owner",
    role: "restaurant",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  // Create restaurant
  const restaurantId = uuidv4()
  await db.insert(schema.restaurants).values({
    id: restaurantId,
    userId: restaurantUserId,
    name: "Tasty Bites",
    description: "Delicious food for everyone",
    address: "123 Main St, Anytown, USA",
    phone: "555-123-4567",
    email: "restaurant@example.com",
    image: "/placeholder.svg?height=100&width=100",
    rating: 4.5,
    cuisine: "American",
    isOpen: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  console.log("🍔 Created restaurant")

  // Create menu items
  const menuItem1Id = uuidv4()
  const menuItem2Id = uuidv4()
  const menuItem3Id = uuidv4()

  await db.insert(schema.menuItems).values([
    {
      id: menuItem1Id,
      restaurantId: restaurantId,
      name: "Cheeseburger",
      description: "Juicy beef patty with cheese",
      price: 9.99,
      image: "/placeholder.svg?height=100&width=100",
      category: "Main",
      isAvailable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: menuItem2Id,
      restaurantId: restaurantId,
      name: "Caesar Salad",
      description: "Fresh romaine lettuce with Caesar dressing",
      price: 7.99,
      image: "/placeholder.svg?height=100&width=100",
      category: "Salads",
      isAvailable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: menuItem3Id,
      restaurantId: restaurantId,
      name: "French Fries",
      description: "Crispy golden fries",
      price: 3.99,
      image: "/placeholder.svg?height=100&width=100",
      category: "Sides",
      isAvailable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ])

  console.log("🍟 Created menu items")

  // Create driver user
  const driverPassword = await hash("password", 10)
  const driverUserId = uuidv4()
  await db.insert(schema.users).values({
    id: driverUserId,
    email: "driver@example.com",
    password: driverPassword,
    name: "John Driver",
    role: "driver",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  // Create driver
  const driverId = uuidv4()
  await db.insert(schema.drivers).values({
    id: driverId,
    userId: driverUserId,
    vehicle: "Honda Civic",
    licensePlate: "ABC123",
    isActive: true,
    rating: 4.8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  console.log("🚗 Created driver")

  // Create orders
  const order1Id = uuidv4()
  const order2Id = uuidv4()
  const order3Id = uuidv4()

  await db.insert(schema.orders).values([
    {
      id: order1Id,
      restaurantId: restaurantId,
      customerId: "c1",
      driverId: driverUserId,
      status: "delivered",
      total: 23.97,
      deliveryFee: 2.99,
      tax: 1.92,
      address: "456 Oak St, Anytown, USA",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      deliveredAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(), // 23 hours ago
    },
    {
      id: order2Id,
      restaurantId: restaurantId,
      customerId: "c2",
      driverId: driverUserId,
      status: "in_progress",
      total: 10.98,
      deliveryFee: 2.99,
      tax: 0.87,
      address: "789 Pine St, Anytown, USA",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      deliveredAt: null,
    },
    {
      id: order3Id,
      restaurantId: restaurantId,
      customerId: "c3",
      driverId: null,
      status: "pending",
      total: 20.97,
      deliveryFee: 2.99,
      tax: 1.8,
      address: "101 Maple St, Anytown, USA",
      createdAt: new Date().toISOString(),
      deliveredAt: null,
    },
  ])

  console.log("📦 Created orders")

  // Create order items
  await db.insert(schema.orderItems).values([
    {
      id: uuidv4(),
      orderId: order1Id,
      menuItemId: menuItem1Id,
      quantity: 2,
      price: 9.99,
    },
    {
      id: uuidv4(),
      orderId: order1Id,
      menuItemId: menuItem3Id,
      quantity: 1,
      price: 3.99,
    },
    {
      id: uuidv4(),
      orderId: order2Id,
      menuItemId: menuItem2Id,
      quantity: 1,
      price: 7.99,
    },
    {
      id: uuidv4(),
      orderId: order3Id,
      menuItemId: menuItem1Id,
      quantity: 1,
      price: 9.99,
    },
    {
      id: uuidv4(),
      orderId: order3Id,
      menuItemId: menuItem2Id,
      quantity: 1,
      price: 7.99,
    },
  ])

  console.log("🛒 Created order items")

  // Create earnings
  const today = new Date()
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    return date.toISOString().split("T")[0]
  })

  await db.insert(schema.earnings).values(
    dates.map((date, index) => ({
      id: uuidv4(),
      driverId: driverId,
      date,
      amount: 85 + Math.random() * 60,
      deliveries: 7 + Math.floor(Math.random() * 7),
      createdAt: new Date().toISOString(),
    })),
  )

  console.log("💰 Created earnings")

  console.log("✅ Seed completed successfully")
}

seed().catch(console.error)

