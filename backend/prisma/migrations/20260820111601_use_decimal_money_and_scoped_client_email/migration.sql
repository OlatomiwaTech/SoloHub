/*
  Warnings:

  - You are about to alter the column `amount` on the `Invoice` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `rate` on the `Project` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - A unique constraint covering the columns `[userId,email]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Client_email_key";

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "rate" SET DATA TYPE DECIMAL(10,2);

-- CreateIndex
CREATE UNIQUE INDEX "Client_userId_email_key" ON "Client"("userId", "email");
