import YouTubeNotifier from "youtube-notification";
import YoutubeNotifier from "../core/feed/services/youtubeNotifier.service";
import g1 from "../../prisma/seed/generation1.json";

module.exports = (app) => {
  const subscription = [...g1.members.map(member => member.id), "UCZpMTTPDp2EAev6nb68Onjg"];
  const notifier: YoutubeNotifier = new YoutubeNotifier(subscription)

  app.use('/feeds-youtube', notifier.start());
}