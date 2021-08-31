/**
 * backend to frontend api interface for stream videos (upcoming & live)
 */
export default interface IStreamVideo {
  link: string;
  title: string;
  thumbnail: string;
  status: string;
  liveViewCount: number;
  scheduledAt: Date;
  availableAt: Date;
  channelId: string;
  // tags: string[];
}