/**
 * Every 15mins, update channel data
 */
import YoutubeAPI from "../spiders/youtubeAPI";
import ChannelModel from "@/model/channel.model";

module.exports = async (youtubeAPI: YoutubeAPI) => {

  const channelIds = await ChannelModel.getChannelIds();

  const channelData = await youtubeAPI.getChannels(channelIds);
  
  const updatedChannels = channelData.map(data => ChannelModel.updateChannel(data));
  // await Promise.all(updatedChannels);
  console.log(`${updatedChannels.length} channels updated`);
  
}