-- CreateTable
CREATE TABLE "SystemAdmin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "identityKey" TEXT NOT NULL,
    "identityType" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "realName" TEXT,
    "idCard" TEXT,
    "phone" TEXT,
    "physicalAddress" TEXT,
    "totalArea" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "seedLevel" TEXT NOT NULL DEFAULT 'ALPHA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiliconLife" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "morph" TEXT NOT NULL,
    "profession" TEXT NOT NULL DEFAULT 'FREE',
    "ancestralHome" TEXT NOT NULL,
    "currentLocation" TEXT NOT NULL,
    "birthTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiliconLife_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "sunsCode" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "totalArea" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Container" (
    "id" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "areaSize" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Container_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Connection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetSuns" TEXT NOT NULL,
    "targetName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SystemAdmin_username_key" ON "SystemAdmin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_identityKey_key" ON "User"("identityKey");

-- CreateIndex
CREATE INDEX "SiliconLife_ownerId_idx" ON "SiliconLife"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_sunsCode_key" ON "Address"("sunsCode");

-- CreateIndex
CREATE INDEX "Address_ownerId_idx" ON "Address"("ownerId");

-- CreateIndex
CREATE INDEX "Container_addressId_idx" ON "Container"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_userId_targetSuns_key" ON "Connection"("userId", "targetSuns");

-- AddForeignKey
ALTER TABLE "SiliconLife" ADD CONSTRAINT "SiliconLife_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Container" ADD CONSTRAINT "Container_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
