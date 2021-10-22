import prisma from "./prisma.client";
import { Video } from "@prisma/client";
import { channelVideoResult, videoResult } from "@/interfaces/crawler/streamingResults.interface";

export default class VideoModel {

  // get (new) videos with null fields
  async getNewVideos(limit: number): Promise<Video[]> {
    const videos = prisma.video.findMany({
      where: {
        OR: [
          { thumbnail: null },
          { status: null },
          { liveViewCount: null },
          { publishedAt: null },
          { scheduledAt: null },
          { availableAt: null }
        ]
      },
      take: limit
    })
    return videos;
  }

  // get most outdated (lowest updatedAt) videos
  async getOutdatedVideos(limit: number): Promise<Video[]> {
    const videos = prisma.video.findMany({
      orderBy: { updatedAt: 'asc' },
      take: limit
    })
    return videos;
  }

  // update/sync video data from crawler
  async updateVideo(data: videoResult): Promise<Video> {
    const { id, title, thumbnail, status, liveViewCount, publishedAt,
      scheduledAt, availableAt, channelId, tags, duration } = data;

    const video = await prisma.video.update({
      where: { id },
      data: {
        title, thumbnail, status, liveViewCount, publishedAt,
        scheduledAt, availableAt, channelId, tags, duration
      }
    })
    return video;
  }

  // sync channel playlist video
  async syncChannelVideo(data: channelVideoResult): Promise<Video> {
    const { id, title, status, channelId } = data;
    const video = await prisma.video.upsert({
      where: { id },
      update: {
        title,
        status
      },
      create: {
        id,
        title,
        status,
        channelId
      }
    })
    return video;
  }

  // sync deleted channel playlist videos
  async syncDeletedChannelVideo(videoIds: string[], channelId: string): Promise<number> {

    // find videos not in (up-to-date) videoIds
    const deletedVideos = await prisma.video.findMany({
      where: {
        AND: [
          { channelId },
          { id: { notIn: videoIds } },
          { status: 'complete' }
        ]
      }
    })
    if (!deletedVideos.length) return 0;

    // delete video
    const deleteIds = deletedVideos.map(video => video.id);
    const deletion = await prisma.video.deleteMany({
      where: {
        id: { in: deleteIds }
      }
    })
    return deletion.count;
  }

  // delete video with id
  async deleteVideo(id: string): Promise<Video> {
    const result = await prisma.video.delete({
      where: { id }
    });
    return result;
  }

  async getUpcoming(limit: number): Promise<Video[]> {
    const videos = await prisma.video.findMany({
      where: {
        AND: [
          { status: 'upcoming' },
        ]
      },
      orderBy: {
        updatedAt: 'asc'
      },
      take: limit
    })
    return videos;
  }

  async getLive(limit: number): Promise<Video[]> {
    const videos = await prisma.video.findMany({
      where: {
        AND: [
          { status: 'live' },
        ]
      },
      orderBy: {
        updatedAt: 'asc'
      },
      take: limit
    })
    return videos;
  }

  // get videos by ids
  async getVideos(ids: string[]): Promise<Video[]> {
    const videos = await prisma.video.findMany({
      where: {
        id: { in: ids }
      }
    })
    return videos
  }

  async createVideo(data: videoResult): Promise<Video> {
    const { id, title, thumbnail, status, liveViewCount, publishedAt,
      scheduledAt, availableAt, channelId, tags, duration } = data;

    const video = await prisma.video.create({
      data: {
        id, title, thumbnail, status, liveViewCount, publishedAt,
        scheduledAt, availableAt, channelId, tags, duration
      }
    })
    return video;
  }
}