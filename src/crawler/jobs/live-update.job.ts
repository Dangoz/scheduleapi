/**
 * update live videos
 */
import YoutubeAPI from "../spiders/youtubeAPI";
import VideoModel from "../../model/video.model";

module.exports = async (youtubeAPI: YoutubeAPI, videodb: VideoModel) => {

  // get live videos, ordered by updatedAt
  const limit = 5;
  let updateList = await videodb.getLive(limit);
  if (!updateList.length) return;
  const targetIds = updateList.map(video => video.id);

  // get video data, sync with database
  const videoData = await youtubeAPI.getVideos(targetIds);
  //  console.log('data', videoData);
  const syncedVideos = videoData.map(data => videodb.updateVideo(data));
  console.log('live-synced', (await Promise.all(syncedVideos)).length);

  // get ids of video data not returned
  if (targetIds.length === videoData.length) return;
  const videoDataIds = videoData.map(data => data.id);
  const missingIds = targetIds.filter(targetId => videoDataIds.indexOf(targetId) === -1);

  // check/crawl video ids again, then delete/update accordingly
  const recheckData = await youtubeAPI.getVideos(missingIds);
  const recheck = missingIds.map(missingId => {
    const foundVideo = recheckData.find(data => data.id === missingId);
    foundVideo ? videodb.updateVideo(foundVideo) : videodb.deleteVideo(missingId);
  })
  console.log('re-synced', (await Promise.all(recheck)).length);
}