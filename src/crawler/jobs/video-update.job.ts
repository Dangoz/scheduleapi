/**
 * , update data of most outdated videos
 * limit of 20 videos per run
 */
import YoutubeAPI from "../spiders/youtubeAPI";
import VideoModel from "@/model/video.model";
import { removeDuplicate, paginate } from "../helpers/util";

module.exports = async (youtubeAPI: YoutubeAPI, videodb: VideoModel) => {

  // get videos with null fields, then videos with lowest UpdatedAt;
  const limit = 20;
  let updateList = await videodb.getNewVideos(limit);

  // push outdated videos to reach the number of limit
  if (updateList.length !== limit) {
    updateList = [...updateList, ...(await videodb.getOutdatedVideos(limit))];
    updateList = await removeDuplicate(updateList);
    updateList = updateList.splice(0, limit);
  }
  const targetIds = updateList.map(video => video.id);

  // get video data, sync with database
  const videoData = await youtubeAPI.getVideos(targetIds);
  // console.log('data', videoData);

  // paginate, and update to database in between intervals, lowering congestion
  const updateData = await paginate(videoData, 2);
  let index = 0;
  const interval = setInterval(async () => {
    if (index === updateData.length - 1) return clearInterval(interval);
    const syncedVideos = updateData[index].map(data => videodb.updateVideo(data));
    console.log('video-synced', (await Promise.all(syncedVideos)).length);
    index += 1;
  }, 5900);

  // get ids of video data not returned
  if (targetIds.length === videoData.length) return;
  console.log('deletion exists')
  const videoDataIds = videoData.map(data => data.id);
  const missingIds = targetIds.filter(targetId => videoDataIds.indexOf(targetId) === -1);

  // check/crawl video ids again, then delete/update accordingly
  const recheckData = await youtubeAPI.getVideos(missingIds);
  const recheck = missingIds.map(missingId => {
    const foundVideo = recheckData.find(data => data.id === missingId);
    return foundVideo ? videodb.updateVideo(foundVideo) : videodb.deleteVideo(missingId);
  })
  console.log('re-synced', (await Promise.all(recheck)).length);
}
