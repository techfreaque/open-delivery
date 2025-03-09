-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "deliveries_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_deliveries" ("city", "countryId", "createdAt", "distance", "driverId", "estimatedDeliveryTime", "estimatedPreparationTime", "id", "latitude", "longitude", "message", "orderId", "phone", "status", "street", "streetNumber", "type", "updatedAt", "zip") SELECT "city", "countryId", "createdAt", "distance", "driverId", "estimatedDeliveryTime", "estimatedPreparationTime", "id", "latitude", "longitude", "message", "orderId", "phone", "status", "street", "streetNumber", "type", "updatedAt", "zip" FROM "deliveries";
DROP TABLE "deliveries";
ALTER TABLE "new_deliveries" RENAME TO "deliveries";
CREATE UNIQUE INDEX "deliveries_orderId_key" ON "deliveries"("orderId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
