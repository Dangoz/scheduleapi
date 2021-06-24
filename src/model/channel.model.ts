import prisma from "./prisma.client";
import { Channel } from "@prisma/client";
import { channelResult } from "../interfaces/crawler/streamingResults.interface";

export default class ChannelModel {

  async getChannelIds(): Promise<string[]> {
    const channelIds = await prisma.channel.findMany({
      select: {
        id: true
      }
    });
    const ids = channelIds.map(channel => channel.id);
    return ids;
  }

  async getUploadIds(): Promise<string[]> {
    const uploadIds = await prisma.channel.findMany({
      select: {
        uploadId: true
      }
    });
    const ids = uploadIds.map(channel => channel.uploadId);
    return ids;
  }

  async updateChannel(data: channelResult): Promise<Channel> {
    const { id, uploadId, name, description, photo,
      banner, subscriberCount, viewCount, videoCount } = data;

    const channel = await prisma.channel.update({
      where: { id },
      data: {
        uploadId, name, description, photo, banner,
        subscriberCount, viewCount, videoCount
      }
    })
    return channel;
  }


}