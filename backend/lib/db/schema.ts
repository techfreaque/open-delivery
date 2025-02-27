import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core"

// Users table (for all types of users: restaurant owners, drivers, admins)
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(), // 'restaurant', 'driver', 'admin'
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
})

// Restaurants table
export const restaurants = sqliteTable("restaurants", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  image: text("image").notNull(),
  rating: real("rating").notNull().default(0),
  cuisine: text("cuisine").notNull(),
  isOpen: integer("is_open", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
})

// Menu items table
export const menuItems = sqliteTable("menu_items", {
  id: text("id").primaryKey(),
  restaurantId: text("restaurant_id")
    .notNull()
    .references(() => restaurants.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  image: text("image").notNull(),
  category: text("category").notNull(),
  isAvailable: integer("is_available", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
})

// Orders table
export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  restaurantId: text("restaurant_id")
    .notNull()
    .references(() => restaurants.id),
  customerId: text("customer_id").notNull(),
  driverId: text("driver_id").references(() => users.id),
  status: text("status").notNull(), // 'pending', 'in_progress', 'delivered'
  total: real("total").notNull(),
  deliveryFee: real("delivery_fee").notNull(),
  tax: real("tax").notNull(),
  address: text("address").notNull(),
  createdAt: text("created_at").notNull(),
  deliveredAt: text("delivered_at"),
})

// Order items table
export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id),
  menuItemId: text("menu_item_id")
    .notNull()
    .references(() => menuItems.id),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
})

// Drivers table
export const drivers = sqliteTable("drivers", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  vehicle: text("vehicle").notNull(),
  licensePlate: text("license_plate").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  rating: real("rating").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
})

// Earnings table
export const earnings = sqliteTable("earnings", {
  id: text("id").primaryKey(),
  driverId: text("driver_id")
    .notNull()
    .references(() => drivers.id),
  date: text("date").notNull(),
  amount: real("amount").notNull(),
  deliveries: integer("deliveries").notNull(),
  createdAt: text("created_at").notNull(),
})

