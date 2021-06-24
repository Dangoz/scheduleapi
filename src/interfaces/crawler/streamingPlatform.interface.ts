import { channelResult, channelVideoResult, videoResult } from "./streamingResults.interface";

interface IStreamingPlatform {
  getChannels(channelIds: string[]): Promise<channelResult[]>;
  getChannelVideos(videoListId: string): Promise<channelVideoResult[]>;
  getVideos(videoIds: string[]): Promise<videoResult[]>;
}

export default IStreamingPlatform;