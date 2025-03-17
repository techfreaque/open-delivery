/*
  Warnings:

  - The values [PUBLIC] on the enum `MessageType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `published` to the `opening_times` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MessageType_new" AS ENUM ('CUSTOMER', 'RESTAURANT', 'DRIVER', 'RESTAURANT_RATING', 'DRIVER_RATING', 'MENU_ITEM', 'ORDER', 'DELIVERY', 'EARNING');
ALTER TABLE "messages" ALTER COLUMN "type" TYPE "MessageType_new" USING ("type"::text::"MessageType_new");
ALTER TYPE "MessageType" RENAME TO "MessageType_old";
ALTER TYPE "MessageType_new" RENAME TO "MessageType";
DROP TYPE "MessageType_old";
COMMIT;

-- AlterEnum
ALTER TYPE "UserRoleValue" ADD VALUE 'PUBLIC';

-- AlterTable
ALTER TABLE "opening_times" ADD COLUMN     "published" BOOLEAN NOT NULL;
