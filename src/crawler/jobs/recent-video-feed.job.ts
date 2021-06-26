/**
 * update 15 most recent videos of each channel through youtube-xml-feed
 */
import { channelVideoResult } from "../../interfaces/crawler/streamingResults.interface";
import axios from "axios";
import ChannelModel from "../../model/channel.model";
import VideoModel from "../../model/video.model";
import { paginate } from "../helpers/util";

module.exports = async (channeldb: ChannelModel, videodb: VideoModel) => {
  const findVideoRegex = /<yt:videoId>(.*?)<\/yt:videoId>\s+\S+\s+<title>(.*?)<\/title>/gim;
  const channelIds = await channeldb.getChannelIds();

  // paginate channelIds into a list of lists of 1 ~ 3 ids, watch out for connection limit
  let bundle = await paginate(channelIds, 1);

  for (let ids of bundle) {
    const syncedIds = ids.map(async channel_id => {

      // youtube-xml-feed gets the 15 most recent videos of a channel
      const xml = await axios.get('https://www.youtube.com/feeds/videos.xml', {
        params: {
          channel_id,
          t: Date.now(),
        }
      });

      // parse with regex, map to channelVideoResult
      const data = [...xml.data.matchAll(findVideoRegex)];
      const results: channelVideoResult[] = data.map((match) => ({
        id: match[1],
        channelId: channel_id,
        title: match[2]
      }))

      // sync channelVideoResult with database
      const syncedVideos = results.map(result => videodb.syncChannelVideo(result));
      await Promise.all(syncedVideos).then(videos => console.log('recent-synced', videos.length));
    })


    // wait for all ids of this page to finish for sequential processing
    await Promise.all(syncedIds).then(() => console.log('all ids of this page passed'));


  }
}