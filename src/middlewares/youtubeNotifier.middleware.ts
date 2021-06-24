import YouTubeNotifier from "youtube-notification";
import YoutubeNotifier from "../core/feed/services/youtubeNotifier.service";

module.exports = (app) => {
  
  const subscription = ['UCZpMTTPDp2EAev6nb68Onjg', 'UCkVWy3Y2aBSi8NfZ7oIrfGg', 'UCB7sSUNwh_dXE7ZL3DsGDpw'];
  const notifier: YoutubeNotifier = new YoutubeNotifier(subscription)

  app.use('/feeds-youtube', notifier.start());

  // sample json structure from 'notified' event
  const data = {
    video: {
      id: "AmadfVM-bR4",
      title: "test0.1.0",
      link: "https://www.youtube.com/watch?v=AmadfVM-bR4"
    },
    channel: {
      id: "UCZpMTTPDp2EAev6nb68Onjg",
      name: "J Z",
      link: "https://www.youtube.com/channel/UCZpMTTPDp2EAev6nb68Onjg"
    },
    published: "2021-06-16T20:49:23.000Z",
    updated: "2021-06-16T20:49:47.122Z"
  }
}