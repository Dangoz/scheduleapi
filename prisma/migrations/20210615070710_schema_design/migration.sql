-- CreateTable
CREATE TABLE "persona" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameJP" TEXT,
    "lore" TEXT NOT NULL DEFAULT E'',
    "org" TEXT NOT NULL,
    "suborg" TEXT,
    "twitter" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel" (
    "id" TEXT NOT NULL,
    "uploadId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "banner" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subscriberCount" INTEGER NOT NULL,
    "viewCount" INTEGER NOT NULL,
    "videoCount" INTEGER NOT NULL,
    "personaId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "availableAt" TIMESTAMP(3) NOT NULL,
    "channelId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "channel" ADD FOREIGN KEY ("personaId") REFERENCES "persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video" ADD FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
