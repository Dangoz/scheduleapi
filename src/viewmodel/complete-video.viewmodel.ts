import { Video } from "@prisma/client";
import ICompleteVideo from "@/interfaces/api/complete-video.interface";

export default class CompleteVideoViewModel implements ICompleteVideo {

  link: string;
  title: string;
  thumbnail: string;
  status: string;
  liveViewCount: number;
  scheduledAt: Date;
  availableAt: Date;
  channelId: string;
  tags: string[];
  duration?: number;

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

    return new CompleteVideoViewModel(video);
  }
}