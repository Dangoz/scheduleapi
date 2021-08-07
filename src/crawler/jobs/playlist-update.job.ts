/**
 * , update channel playlist videos
 */
import YoutubeAPI from "../spiders/youtubeAPI";
import ChannelModel from "@/model/channel.model";
import VideoModel from "@/model/video.model";
import { paginate } from "../helpers/util";

module.exports = async (youtubeAPI: YoutubeAPI, channeldb: ChannelModel, videodb: VideoModel) => {
  const uploadIds = await channeldb.getUploadIds();

  // for..of loop used over .map (sequentival over parallel processing) for 
  // controlling database load & connections. sync videos of every uploadId.
  for (let uploadId of uploadIds) {
    let resultList = await youtubeAPI.getChannelVideos(uploadId)

    // paginate resultList into a list of lists of 50 results
    let bundle = await paginate(resultList, 50);
    resultList = bundle.flat();

    // update or create new videos
    for (let results of bundle) {
      const syncedVideos = results.map(result => videodb.syncChannelVideo(result));
      await Promise.all(syncedVideos).then(videos => console.log('synced', videos.length));
    }

    // check for deleted videos
    const ids = resultList.map(result => result.id);
    // const ids = [];
    const channelId = resultList[0].channelId;
    videodb.syncDeletedChannelVideo(ids, channelId).then(count => console.log(`${count} rows deleted`));
  }
}
