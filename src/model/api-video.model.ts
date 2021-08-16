import prisma from "./prisma.client";
import { Video } from "@prisma/client";

/**
 * video model for serving & interacting with v1 api and its
 * assosciated services on express server
 */
export default class APIVideoModel {

  async getStreamVideos(): Promise<Video[]> {
    const videos = await prisma.video.findMany({
      where: {
        status: { not: 'complete' }
      }
    })
    return videos;
  }
}