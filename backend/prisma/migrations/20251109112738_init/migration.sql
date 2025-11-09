-- CreateTable
CREATE TABLE "Route" (
    "id" SERIAL NOT NULL,
    "routeId" TEXT NOT NULL,
    "vesselType" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "ghgIntensity" DOUBLE PRECISION NOT NULL,
    "fuelConsumption" DOUBLE PRECISION NOT NULL,
    "distance" INTEGER NOT NULL,
    "totalEmissions" DOUBLE PRECISION NOT NULL,
    "isBaseline" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Route_routeId_key" ON "Route"("routeId");
