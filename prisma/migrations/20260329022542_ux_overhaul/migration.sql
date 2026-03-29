-- CreateTable
CREATE TABLE "GameRoom" (
    "id" TEXT NOT NULL,
    "gameType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomLocation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gameRoomId" TEXT NOT NULL,

    CONSTRAINT "RoomLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GamePlay" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "playedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gameRoomId" TEXT NOT NULL,

    CONSTRAINT "GamePlay_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RoomLocation" ADD CONSTRAINT "RoomLocation_gameRoomId_fkey" FOREIGN KEY ("gameRoomId") REFERENCES "GameRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamePlay" ADD CONSTRAINT "GamePlay_gameRoomId_fkey" FOREIGN KEY ("gameRoomId") REFERENCES "GameRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
