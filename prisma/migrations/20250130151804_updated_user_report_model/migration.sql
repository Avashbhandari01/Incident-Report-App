/*
  Warnings:

  - The primary key for the `Report` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `emergencyContactNumber` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `imageIncident` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `incidentId` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `reportedAt` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Report` table. All the data in the column will be lost.
  - The `status` column on the `Report` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fullName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `imageUser` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `mobilePhone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `User` table. All the data in the column will be lost.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `IncidentType` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[reportId]` on the table `Report` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reportId` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reportType` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MODERATOR', 'USER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('EMERGENCY', 'NON_EMERGENCY');

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_incidentId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_userId_fkey";

-- AlterTable
ALTER TABLE "Report" DROP CONSTRAINT "Report_pkey",
DROP COLUMN "emergencyContactNumber",
DROP COLUMN "imageIncident",
DROP COLUMN "incidentId",
DROP COLUMN "priority",
DROP COLUMN "reportedAt",
DROP COLUMN "userId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "reportId" TEXT NOT NULL,
ADD COLUMN     "reportType" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "type" "ReportType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "location" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
ADD CONSTRAINT "Report_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "fullName",
DROP COLUMN "imageUser",
DROP COLUMN "mobilePhone",
DROP COLUMN "userName",
ADD COLUMN     "name" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "password" SET NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "IncidentType";

-- DropEnum
DROP TYPE "UserRole";

-- CreateIndex
CREATE UNIQUE INDEX "Report_reportId_key" ON "Report"("reportId");

-- CreateIndex
CREATE INDEX "Report_reportId_idx" ON "Report"("reportId");
