import YouTubeNotifier from "youtube-notification";

module.exports = (app) => {

  console.log('initializing youtube notifier')

  const notifier = new YouTubeNotifier({
    hubCallback: 'https://vtb-schedule-api.herokuapp.com/youtube-feeds',
    secret: 'pipi..pipipipipi..pi',
    middleware: true
  });

  notifier.on('notified', data => {
    console.log('New Video: ', JSON.stringify(data, null, 2));
    console.log(
      `${data.channel.name} just uploaded a new video titled: ${data.video.title}`
    );
  });

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

  notifier.subscribe('UCZpMTTPDp2EAev6nb68Onjg');

  app.use('/youtube-feeds', notifier.listener());
}