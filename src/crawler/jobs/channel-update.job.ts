/**
 * Every 15mins, update channel data
 */
import YoutubeAPI from "../spiders/youtubeAPI";
import ChannelModel from "@/model/channel.model";

module.exports = async (youtubeAPI: YoutubeAPI, channeldb: ChannelModel) => {

  const channelIds = await channeldb.getChannelIds();

  const channelData = await youtubeAPI.getChannels(channelIds);
  
  const updatedChannels = channelData.map(data => channeldb.updateChannel(data));
  // await Promise.all(updatedChannels);
  console.log(`${updatedChannels.length} channels updated`);
  
}