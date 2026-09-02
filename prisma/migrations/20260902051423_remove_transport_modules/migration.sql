/*
  Warnings:

  - You are about to drop the `CabBooking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payout` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Route` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TransportOperator` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CabBooking";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Payout";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Route";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TransportOperator";
PRAGMA foreign_keys=on;
