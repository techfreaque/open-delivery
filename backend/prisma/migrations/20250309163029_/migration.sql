/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `categories` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `cart_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cart_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "menuItemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cart_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "cart_items_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "cart_items_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "menu_items" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_cart_items" ("id", "menuItemId", "quantity", "restaurantId", "userId") SELECT "id", "menuItemId", "quantity", "restaurantId", "userId" FROM "cart_items";
DROP TABLE "cart_items";
ALTER TABLE "new_cart_items" RENAME TO "cart_items";
CREATE UNIQUE INDEX "cart_items_userId_menuItemId_restaurantId_key" ON "cart_items"("userId", "menuItemId", "restaurantId");
CREATE TABLE "new_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_categories" ("createdAt", "id", "image", "name") SELECT "createdAt", "id", "image", "name" FROM "categories";
DROP TABLE "categories";
ALTER TABLE "new_categories" RENAME TO "categories";
CREATE TABLE "new_countries" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_countries" ("code", "createdAt", "name", "updatedAt") SELECT "code", "createdAt", "name", "updatedAt" FROM "countries";
DROP TABLE "countries";
ALTER TABLE "new_countries" RENAME TO "countries";
CREATE TABLE "new_deliveries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ASSIGNED',
    "message" TEXT,
    "estimatedDeliveryTime" INTEGER,
    "estimatedPreparationTime" INTEGER NOT NULL,
    "distance" REAL,
    "street" TEXT,
    "streetNumber" TEXT,
    "zip" TEXT,
    "city" TEXT,
    "phone" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "countryId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "driverId" TEXT,
    "orderId" TEXT NOT NULL,
    CONSTRAINT "deliveries_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries" ("code") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "deliveries_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "deliveries_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_deliveries" ("city", "countryId", "createdAt", "distance", "driverId", "estimatedDeliveryTime", "estimatedPreparationTime", "id", "latitude", "longitude", "message", "orderId", "phone", "status", "street", "streetNumber", "type", "updatedAt", "zip") SELECT "city", "countryId", "createdAt", "distance", "driverId", "estimatedDeliveryTime", "estimatedPreparationTime", "id", "latitude", "longitude", "message", "orderId", "phone", "status", "street", "streetNumber", "type", "updatedAt", "zip" FROM "deliveries";
DROP TABLE "deliveries";
ALTER TABLE "new_deliveries" RENAME TO "deliveries";
CREATE UNIQUE INDEX "deliveries_orderId_key" ON "deliveries"("orderId");
CREATE TABLE "new_languages" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_languages" ("code", "createdAt", "name", "updatedAt") SELECT "code", "createdAt", "name", "updatedAt" FROM "languages";
DROP TABLE "languages";
ALTER TABLE "new_languages" RENAME TO "languages";
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "categoryId" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    CONSTRAINT "menu_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "menu_items_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_menu_items" ("availableFrom", "availableTo", "categoryId", "createdAt", "description", "id", "image", "name", "price", "published", "restaurantId", "taxPercent", "updatedAt") SELECT "availableFrom", "availableTo", "categoryId", "createdAt", "description", "id", "image", "name", "price", "published", "restaurantId", "taxPercent", "updatedAt" FROM "menu_items";
DROP TABLE "menu_items";
ALTER TABLE "new_menu_items" RENAME TO "menu_items";
CREATE TABLE "new_orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "tax" REAL NOT NULL,
    "total" REAL NOT NULL,
    "deliveryFee" REAL NOT NULL,
    "driverTip" REAL,
    "restaurantTip" REAL,
    "projectTip" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    CONSTRAINT "orders_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_orders" ("createdAt", "customerId", "deliveryFee", "driverTip", "id", "message", "projectTip", "restaurantId", "restaurantTip", "status", "tax", "total") SELECT "createdAt", "customerId", "deliveryFee", "driverTip", "id", "message", "projectTip", "restaurantId", "restaurantTip", "status", "tax", "total" FROM "orders";
DROP TABLE "orders";
ALTER TABLE "new_orders" RENAME TO "orders";
CREATE TABLE "new_ratings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" REAL NOT NULL,
    "userId" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ratings_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ratings" ("id", "rating", "restaurantId", "userId") SELECT "id", "rating", "restaurantId", "userId" FROM "ratings";
DROP TABLE "ratings";
ALTER TABLE "new_ratings" RENAME TO "ratings";
CREATE UNIQUE INDEX "ratings_userId_restaurantId_key" ON "ratings"("userId", "restaurantId");
CREATE TABLE "new_restaurants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "published" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "streetNumber" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "countryId" TEXT NOT NULL,
    "mainCategoryId" TEXT NOT NULL,
    CONSTRAINT "restaurants_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "restaurants_mainCategoryId_fkey" FOREIGN KEY ("mainCategoryId") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_restaurants" ("city", "countryId", "createdAt", "description", "email", "id", "image", "latitude", "longitude", "mainCategoryId", "name", "phone", "published", "street", "streetNumber", "updatedAt", "zip") SELECT "city", "countryId", "createdAt", "description", "email", "id", "image", "latitude", "longitude", "mainCategoryId", "name", "phone", "published", "street", "streetNumber", "updatedAt", "zip" FROM "restaurants";
DROP TABLE "restaurants";
ALTER TABLE "new_restaurants" RENAME TO "restaurants";
CREATE TABLE "new_user_ratings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "ratedUserId" TEXT NOT NULL,
    CONSTRAINT "user_ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "user_ratings_ratedUserId_fkey" FOREIGN KEY ("ratedUserId") REFERENCES "drivers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_user_ratings" ("id", "ratedUserId", "rating", "userId") SELECT "id", "ratedUserId", "rating", "userId" FROM "user_ratings";
DROP TABLE "user_ratings";
ALTER TABLE "new_user_ratings" RENAME TO "user_ratings";
CREATE UNIQUE INDEX "user_ratings_userId_ratedUserId_key" ON "user_ratings"("userId", "ratedUserId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
