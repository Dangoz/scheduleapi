/**
 * backend to frontend api interface for complete videos
 */
export default interface ICompleteVideo {
  link: string;
  title: string;
  thumbnail: string;
  status: string;
  liveViewCount: number;
  scheduledAt: Date;
  availableAt: Date;
  channelId: string;
  tags: string[];
  duration: string;
}