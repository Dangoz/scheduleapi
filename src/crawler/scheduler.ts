/**
 * index/scheduler for scheduling crawler jobs
 * at set interval
 */
import schedule from "node-schedule";
import YoutubeAPI from "./spiders/youtubeAPI";
import ChannelModel from "../model/channel.model";
import VideoModel from "../model/video.model";

module.exports = async () => {

  // initialize spiders & models
  const youtubeAPI = new YoutubeAPI();
  const channeldb = new ChannelModel();
  const videodb = new VideoModel();

  // update channel, every 15mins
  schedule.scheduleJob('0 */15 * * * *', async () => {
    require("./jobs/channel-update.job")(youtubeAPI, channeldb);
  });

  // sync channel playlist videos. only used for new channels, too expensive for crawling
  // schedule.scheduleJob('0 * */12 * * *', async () => {
  //   require("./jobs/playlist-update.job")
  //     (youtubeAPI, channeldb, videodb);
  // });

  // update recent 15 videos with youtube-xml-feed, 
  schedule.scheduleJob('50 */5 * * * *', () => {
    require("./jobs/recent-video-feed.job")(channeldb, videodb)
  });

  // update 20 least updated video, every min
  schedule.scheduleJob('5 * * * * *', () => {
    require("./jobs/video-update.job")(youtubeAPI, videodb);
  })

  // update upcoming videos, every 30secs
  schedule.scheduleJob('*/30 * * * * *', () => {
    require("./jobs/upcoming-update.job")(youtubeAPI, videodb);
  });

  // update live videos, every 20secs
  schedule.scheduleJob('*/20 * * * * *', () => {
    require("./jobs/live-update.job")(youtubeAPI, videodb);
  })
}


