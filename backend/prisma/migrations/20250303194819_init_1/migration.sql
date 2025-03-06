/*
  Warnings:

  - You are about to drop the column `created_at` on the `drivers` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `drivers` table. All the data in the column will be lost.
  - You are about to drop the column `license_plate` on the `drivers` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `drivers` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `drivers` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `drivers` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `earnings` table. All the data in the column will be lost.
  - You are about to drop the column `driver_id` on the `earnings` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `menu_items` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `menu_items` table. All the data in the column will be lost.
  - You are about to drop the column `is_available` on the `menu_items` table. All the data in the column will be lost.
  - You are about to drop the column `restaurant_id` on the `menu_items` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `menu_items` table. All the data in the column will be lost.
  - You are about to drop the column `menu_item_id` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `order_id` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `customer_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `delivered_at` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `delivery_fee` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `driver_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `restaurant_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `tax` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `restaurants` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `restaurants` table. All the data in the column will be lost.
  - You are about to drop the column `cuisine` on the `restaurants` table. All the data in the column will be lost.
  - You are about to drop the column `is_open` on the `restaurants` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `restaurants` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `restaurants` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `restaurants` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - Added the required column `city` to the `drivers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryId` to the `drivers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `licensePlate` to the `drivers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `radius` to the `drivers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `drivers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streetNumber` to the `drivers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `drivers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `drivers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip` to the `drivers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `earnings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `menu_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `menu_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `published` to the `menu_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurantId` to the `menu_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxPercent` to the `menu_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `menu_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `menuItemId` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxPercent` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryFee` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurantId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `restaurants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryId` to the `restaurants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `restaurants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mainCategoryId` to the `restaurants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `restaurants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streetNumber` to the `restaurants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `restaurants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `restaurants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip` to the `restaurants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "password_resets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "password_resets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "restaurantId" TEXT,
    CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_roles_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "streetNumber" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "phone" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "countryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Address_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "opening_times" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "day" TEXT NOT NULL,
    "open" TEXT NOT NULL,
    "close" TEXT NOT NULL,
    "validFrom" DATETIME,
    "validTo" DATETIME,
    "restaurantId" TEXT NOT NULL,
    CONSTRAINT "opening_times_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "countries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "languages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "languages_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ratings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" REAL NOT NULL,
    "userId" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    CONSTRAINT "ratings_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_ratings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" REAL NOT NULL,
    "userId" TEXT NOT NULL,
    "ratedUserId" TEXT NOT NULL,
    CONSTRAINT "user_ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "user_ratings_ratedUserId_fkey" FOREIGN KEY ("ratedUserId") REFERENCES "drivers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "menuItemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    CONSTRAINT "cart_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "cart_items_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "cart_items_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "menu_items" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "deliveries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ASSIGNED',
    "message" TEXT,
    "estimatedDelivery" DATETIME NOT NULL,
    "deliveredAt" DATETIME,
    "estimatedTime" INTEGER,
    "distance" REAL NOT NULL,
    "pickupAddress" TEXT,
    "dropAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "driverId" TEXT,
    CONSTRAINT "deliveries_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_drivers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "vehicle" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "radius" REAL NOT NULL,
    "street" TEXT NOT NULL,
    "streetNumber" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "drivers_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "drivers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_drivers" ("id", "vehicle") SELECT "id", "vehicle" FROM "drivers";
DROP TABLE "drivers";
ALTER TABLE "new_drivers" RENAME TO "drivers";
CREATE UNIQUE INDEX "drivers_userId_key" ON "drivers"("userId");
CREATE TABLE "new_earnings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "amount" REAL NOT NULL,
    "deliveries" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "earnings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_earnings" ("amount", "date", "deliveries", "id") SELECT "amount", "date", "deliveries", "id" FROM "earnings";
DROP TABLE "earnings";
ALTER TABLE "new_earnings" RENAME TO "earnings";
CREATE TABLE "new_menu_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "taxPercent" REAL NOT NULL,
    "image" TEXT,
    "published" BOOLEAN NOT NULL,
    "availableFrom" DATETIME,
    "availableTo" DATETIME,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "categoryId" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    CONSTRAINT "menu_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "menu_items_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_menu_items" ("description", "id", "image", "name", "price") SELECT "description", "id", "image", "name", "price" FROM "menu_items";
DROP TABLE "menu_items";
ALTER TABLE "new_menu_items" RENAME TO "menu_items";
CREATE TABLE "new_order_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "message" TEXT,
    "quantity" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "taxPercent" REAL NOT NULL,
    "orderId" TEXT NOT NULL,
    "menuItemId" TEXT NOT NULL,
    CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "order_items_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "menu_items" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_order_items" ("id", "price", "quantity") SELECT "id", "price", "quantity" FROM "order_items";
DROP TABLE "order_items";
ALTER TABLE "new_order_items" RENAME TO "order_items";
CREATE TABLE "new_orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "message" TEXT,
    "status" TEXT NOT NULL,
    "total" REAL NOT NULL,
    "deliveryFee" REAL NOT NULL,
    "driverTip" REAL,
    "restaurantTip" REAL,
    "projectTip" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "restaurantId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "deliveryId" TEXT NOT NULL,
    CONSTRAINT "orders_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "orders_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "deliveries" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_orders" ("id", "status", "total") SELECT "id", "status", "total" FROM "orders";
DROP TABLE "orders";
ALTER TABLE "new_orders" RENAME TO "orders";
CREATE TABLE "new_restaurants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "streetNumber" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "countryId" TEXT NOT NULL,
    "mainCategoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "restaurants_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "restaurants_mainCategoryId_fkey" FOREIGN KEY ("mainCategoryId") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "restaurants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_restaurants" ("description", "email", "id", "image", "name", "phone") SELECT "description", "email", "id", "image", "name", "phone" FROM "restaurants";
DROP TABLE "restaurants";
ALTER TABLE "new_restaurants" RENAME TO "restaurants";
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "driverId" TEXT
);
INSERT INTO "new_users" ("email", "id", "name", "password") SELECT "email", "id", "name", "password" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "password_resets_userId_key" ON "password_resets"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_userId_role_restaurantId_key" ON "user_roles"("userId", "role", "restaurantId");

-- CreateIndex
CREATE UNIQUE INDEX "ratings_userId_restaurantId_key" ON "ratings"("userId", "restaurantId");

-- CreateIndex
CREATE UNIQUE INDEX "user_ratings_userId_ratedUserId_key" ON "user_ratings"("userId", "ratedUserId");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_userId_menuItemId_restaurantId_key" ON "cart_items"("userId", "menuItemId", "restaurantId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");
