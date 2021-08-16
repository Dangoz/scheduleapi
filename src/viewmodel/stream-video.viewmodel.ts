import { Video } from "@prisma/client";
import IStreamVideo from "@/interfaces/api/stream-video.interface";

/**
 * process streamVideo data from database and match
 * properties with that of IStreamVideo for frontend interface
 */
export default class StreamVideoViewModel implements IStreamVideo {
  link: string;
  title: string;
  thumbnail: string;
  status: string;
  liveViewCount: number;
  scheduledAt: Date;
  availableAt: Date;
  channelId: string;
  tags: string[];

  private constructor(video: Video) {
    this.link = `https://www.youtube.com/watch?v=${video.id}`;
    this.title = video.title;
    this.thumbnail = video.thumbnail;
    this.status = video.status;
    this.liveViewCount = video.liveViewCount;
    this.scheduledAt = video.scheduledAt;
    this.availableAt = video.availableAt;
    this.channelId = video.channelId;
    this.tags = video.tags;
  }

  static async build(video: Video, options?: {}) {
    // additional processing according to options

    return new StreamVideoViewModel(video);
  }
}