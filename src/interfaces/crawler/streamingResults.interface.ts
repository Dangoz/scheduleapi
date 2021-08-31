/**
 * data results returned from calling streaming platform APIs
 */

// crawler data for updating channel
export interface channelResult {
  id: string;
  uploadId: string;
  name: string;
  description: string;
  photo: string;
  banner: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
}

// crawler data for syncing channel video
export interface channelVideoResult {
  id: string;
  channelId: string;
  title: string;
  status?: string;
}

// crawler data for updating video
export interface videoResult {
  id: string;
  title: string;
  thumbnail: string
  status: string;
  liveViewCount: number;
  publishedAt: Date;
  scheduledAt: Date;
  availableAt: Date; // for streaming video, scheduledStartTime for upcoming, actualStartTime for live, actualEndTime for complete
  channelId: string;
  tags: string[];
  duration?: string;
}