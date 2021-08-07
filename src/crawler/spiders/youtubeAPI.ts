import IStreamingPlatform from "../../interfaces/crawler/streamingPlatform.interface";
import { channelResult, channelVideoResult, videoResult } from "../../interfaces/crawler/streamingResults.interface";
import { google, youtube_v3 } from "googleapis";
require('dotenv').config();

export default class YoutubeAPI implements IStreamingPlatform {
  private readonly youtube: youtube_v3.Youtube;

  constructor() {
    this.youtube = google.youtube({
      version: 'v3',
      auth: process.env.GOOGLE_API_KEY
    });
  }

  public async getChannels(channelIds: string[]): Promise<channelResult[]> {

    const response = await this.youtube.channels.list({
      part: ['snippet', 'contentDetails', 'statistics', 'brandingSettings'],
      id: channelIds,
      maxResults: 50
    });
    const results = response.data.items;

    const channelData = results.map(data => {
      return {
        id: data.id,
        uploadId: data.contentDetails.relatedPlaylists.uploads,
        name: data.snippet.title,
        description: data.snippet.description,
        photo: data.snippet.thumbnails.high.url,
        banner: data.brandingSettings.image ? data.brandingSettings.image.bannerExternalUrl : '',
        subscriberCount: +data.statistics.subscriberCount,
        viewCount: +data.statistics.viewCount,
        videoCount: +data.statistics.videoCount
      }
    })
    return channelData;
  }

  public async getChannelVideos(playlistId: string): Promise<channelVideoResult[]> {
    const results = await this.fetchPlayList(playlistId);
    const channelVideosData = results.map(data => {
      return {
        id: data.snippet.resourceId.videoId,
        channelId: data.snippet.channelId,
        title: data.snippet.title,
        status: 'complete'
      }
    })

    return channelVideosData;
  }

  public async getVideos(videoIds: string[]): Promise<videoResult[]> {
    const response = await this.youtube.videos.list({
      part: ['id', 'snippet', 'liveStreamingDetails', 'statistics'],
      id: videoIds,
      maxResults: 50
    });

    // filter edge case - offline video, having liveStreamingDetails without scheduledStartTime
    const results = response.data.items.filter(item => {
      if (item.liveStreamingDetails) {
        if (!item.liveStreamingDetails.scheduledStartTime) return false;
      } 
      return true;
    });

    const videoData = results.map(result => this.parseVideoData(result));
    return await Promise.all(videoData);
  }

  private async parseVideoData(video: youtube_v3.Schema$Video): Promise<videoResult> {
    let shared = {
      id: video.id,
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails.high.url,
      publishedAt: new Date(video.snippet.publishedAt),
      channelId: video.snippet.channelId
    }

    let conditional = !video.liveStreamingDetails
      ? {
        // if not a streaming video
        status: 'complete',
        liveViewCount: +video.statistics.viewCount,
        scheduledAt: new Date(video.snippet.publishedAt),
        availableAt: new Date(video.snippet.publishedAt)
      }
      : video.liveStreamingDetails.actualEndTime
        ? {
          // if stream is ended/over
          status: 'complete',
          liveViewCount: +video.statistics.viewCount,
          scheduledAt: new Date(video.liveStreamingDetails.scheduledStartTime),
          availableAt: new Date(video.liveStreamingDetails.actualEndTime)
        }
        : video.liveStreamingDetails.actualStartTime || new Date >= new Date(video.liveStreamingDetails.scheduledStartTime)
          ? {
            // if stream is live (started with actualStartTime, or time past scheduledStartTime)
            status: 'live',
            liveViewCount: +video.liveStreamingDetails.concurrentViewers || +video.statistics.viewCount,
            scheduledAt: new Date(video.liveStreamingDetails.scheduledStartTime),
            availableAt: video.liveStreamingDetails.actualStartTime ? new Date(video.liveStreamingDetails.actualStartTime) : new Date(video.liveStreamingDetails.scheduledStartTime)
          }
          : {
            // if stream is upcoming
            status: 'upcoming',
            liveViewCount: +video.statistics.viewCount,
            scheduledAt: new Date(video.liveStreamingDetails.scheduledStartTime),
            availableAt: new Date(video.liveStreamingDetails.scheduledStartTime)
          }

    const data: videoResult = { ...shared, ...conditional };
    return data;
  }

  // given a channel's uploadId(aka playlistId), recursively fetch all of its videos
  private async fetchPlayList(playlistId: string, pageToken?: string): Promise<youtube_v3.Schema$PlaylistItem[]> {
    const response = await this.youtube.playlistItems.list({
      part: ['id', 'snippet'],
      playlistId,
      maxResults: 50,
      pageToken,
    });
    const results = response.data;

    if (results.nextPageToken) return [...results.items,
    ...(await this.fetchPlayList(playlistId, results.nextPageToken))];
    return results.items;
  }
}