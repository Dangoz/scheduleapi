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
  console.log('synced', (await Promise.all(syncedVideos)).length)
}