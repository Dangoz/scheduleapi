import youtubeNotification from "youtube-notification";
import VideoModel from "../../../model/video.model";
import { channelVideoResult } from "../../../interfaces/crawler/streamingResults.interface";

/**
 * wrapper class for youtube-notification package with
 * additional services & configurations
 */
export default class YoutubeNotifier {
  private readonly notifier: youtubeNotification;
  private readonly videodb: VideoModel = new VideoModel();

  constructor(subscription: string[]) {
    this.notifier = new youtubeNotification({
      hubCallback: 'https://4fcd7b922b1a.ngrok.io/feeds-youtube',
      secret: 'anakaso2h',
      middleware: true
    });

    this.initializeNotification();
    this.initializeSubscription(subscription);
  }

  private initializeNotification() {
    this.notifier.on('subscribe', data => console.log(data));

    this.notifier.on('notified', async data => {
      console.log(`Create || Update - Youtube-Notification at id: ${data.video.id}`)
      console.log('video data: ', JSON.stringify(data, null, 2));
      this.videoUpsert(data)
    });

    this.notifier.on('notified-delete', async data => {
      console.log('Delete - Youtube-Notification');
      console.log('deleted video data: ', JSON.stringify(data, null, 2));
      this.videoDelete(data);
    })
  }

  private initializeSubscription(subscription: string[]) {
    this.notifier.subscribe(subscription);
  }

  public start() {
    return this.notifier.listener();
  }

  private async videoUpsert(data) {
    const result: channelVideoResult = {
      id: data.video.id,
      title: data.video.title,
      channelId: data.channel.id,
    }
    const video = await this.videodb.syncChannelVideo(result);
    console.log(`synced video: ${video.id}`);
  }

  private async videoDelete(data) {
    const video = await this.videodb.deleteVideo(data.video.id);
    console.log(`deleted video: ${video.id}`);
  }
}