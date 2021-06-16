import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import generation1 from "./seed/generation1.json";

const members = generation1.members;

async function main() {
  let memberList = [];
  for (let member of members) {
    const { id, name, nameJP, org, suborg, twitter, channel } = member;
    const newMember = await prisma.persona.upsert({
      update: {},
      where: { id },
      create: {
        id,
        name,
        nameJP,
        org,
        suborg,
        twitter,
        channel: {
          create: {
            id: channel.id,
            uploadId: '',
            name: channel.name,
            description: channel.description,
            platform: channel.platform,
            photo: channel.photo,
            banner: channel.banner,
            publishedAt: new Date(),
            subscriberCount: 0,
            viewCount: 0,
            videoCount: 0
          }
        }
      }
    })
    memberList.push(newMember);
  }
  console.log('seeding completed', memberList);
}

// main()
//   .catch(e => {
//     console.error(e)
//     process.exit(1)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })