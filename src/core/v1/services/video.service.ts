import APIVideoModel from "@/model/api-video.model";
import IStreamVideo from "@/interfaces/api/stream-video.interface";
import ICompleteVideo from "@/interfaces/api/complete-video.interface";
import StreamVideoViewModel from "@/viewmodel/stream-video.viewmodel";
import CompleteVideoViewModel from "@/viewmodel/complete-video.viewmodel";

class VideoService {
  private videodb: APIVideoModel = new APIVideoModel();

  async getStreamVideo(): Promise<IStreamVideo[]> {
    const streamVideoData = await this.videodb.getStreamVideos();
    const streamVideoViewModel = streamVideoData.map(streamVideo => StreamVideoViewModel.build(streamVideo));
    const videos: IStreamVideo[] = await Promise.all(streamVideoViewModel);
    return videos;
  }

  async getCompleteVideo(channelIds: string[]): Promise<ICompleteVideo[]> {
    const completeVideoData = await this.videodb.getCompleteVideos(channelIds);
    const completeVideoViewModel = completeVideoData.map(completeVideo => CompleteVideoViewModel.build(completeVideo));
    const videos: ICompleteVideo[] = await Promise.all(completeVideoViewModel); 
    return videos;
  }
}

export default VideoService;