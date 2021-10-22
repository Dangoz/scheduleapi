/**
 * update 15 most recent videos of each channel through youtube-xml-feed
 */
import YoutubeAPI from "../spiders/youtubeAPI";
import axios from "axios";
import ChannelModel from "@/model/channel.model";
import VideoModel from "@/model/video.model";
import { paginate } from "../helpers/util";

module.exports = async (youtubeAPI: YoutubeAPI, channeldb: ChannelModel, videodb: VideoModel) => {
  const findVideoRegex = /<yt:videoId>(.*?)<\/yt:videoId>\s+\S+\s+<title>(.*?)<\/title>/gim;
  const channelIds = await channeldb.getChannelIds();

  // paginate channelIds into a list of lists of 3 ids 
  // (15 videos per youtube-xml-feed, 45 videos per page, youtube api has a limit of 50 videos per request)
  let bundle = await paginate(channelIds, 3);

  for (let cIds of bundle) {
    const results = cIds.map(async cid => {

      // youtube-xml-feed gets the 15 most recent videos of a channel
      const xml = await axios.get('https://www.youtube.com/feeds/videos.xml', {
        params: {
          channel_id: cid,
          t: Date.now(),
        }
      });

      // parse with regex, map to channelVideoResult
      const videos = [...xml.data.matchAll(findVideoRegex)];
      // const results: channelVideoResult[] = videos.map((match) => ({
      //   id: match[1],
      //   channelId: cid,
      //   title: match[2]
      // }))
      return videos.map(video => video[1]);
    });

    // max 45 videos ids of 3 channels from youtube-xml-feed
    const xmlVideoIds: string[] = (await Promise.all(results)).flat();

    // filter out new videos' ids
    const dbVideoIds = (await videodb.getVideos(xmlVideoIds)).map(v => v.id);
    const newVideoIds = xmlVideoIds.filter(v => dbVideoIds.indexOf(v) === -1);

    if (!newVideoIds.length) {
      console.log("youtube-xml-feed-synced", 0);
    } else {

      // create new video from newVideoIds
      const videoData = await youtubeAPI.getVideos(newVideoIds);
      const syncedVideos = videoData.map(d => videodb.createVideo(d));
      console.log("youtube-xml-feed-synced", (await Promise.all(syncedVideos)).length);
    }
  }
}