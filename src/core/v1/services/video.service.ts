import APIVideoModel from "@/model/api-video.model";
import IStreamVideo from "@/interfaces/api/stream-video.interface";
import StreamVideoViewModel from "@/viewmodel/stream-video.viewmodel";

class VideoService {
  private videodb: APIVideoModel = new APIVideoModel();

  async getStreamVideo(): Promise<IStreamVideo[]> {
    const streamVideoData = await this.videodb.getStreamVideos();
    const streamViewViewModel = streamVideoData.map(streamVideo => StreamVideoViewModel.build(streamVideo));
    const videos: IStreamVideo[] = await Promise.all(streamViewViewModel);
    return videos;
  }
}

export default VideoService;