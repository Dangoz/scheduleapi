/**
 * , update data of most outdated videos
 * limit of 20 videos per run
 */
import YoutubeAPI from "../spiders/youtubeAPI";
import VideoModel from "../../model/video.model";
import { removeDuplicate } from "../helpers/util";

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
  // const targetIds = ["SffTqiu1GzE"];
  // console.log('ids-length', targetIds)
  // const targetIds = [ // test ids
  //   'cf4JwObnWUs', '0fI8IfrsTVY', // complete videos
  //   'LMjtPkkRJ_Y', '0KBXeX75lsc', // complete streams
  //   'p609f0v_yCU', '60psUo4iC7w', // upcoming streams
  //   'RMIdpftNV0g', 'YdNeDrtJPXA', // live streams // UCZpMTTPDp2EAev6nb68Onjg
  // ];

  // get video data, sync with database
  const videoData = await youtubeAPI.getVideos(targetIds);
  // console.log('data', videoData);
  const syncedVideos = videoData.map(data => videodb.updateVideo(data));
  console.log('video-synced', (await Promise.all(syncedVideos)).length);

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
