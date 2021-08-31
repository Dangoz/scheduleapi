import prisma from "./prisma.client";
import { Video } from "@prisma/client";

/**
 * video model for serving & interacting with v1 api and its
 * assosciated services on express server
 */
export default class APIVideoModel {

  // get upcoming & live (stream) videos
  async getStreamVideos(): Promise<Video[]> {
    const videos = await prisma.video.findMany({
      where: {
        status: { not: 'complete' }
      }
    })
    return videos;
  }

  // get complete videos by channel
  async getCompleteVideos(channelIds: string[]): Promise<Video[]> {
    const videos = await prisma.video.findMany({
      where: {
        AND: [
          { status: 'complete' },
          { channelId: { in: channelIds ? channelIds : undefined } }
        ]
      }
    })
    return videos;
  }
}