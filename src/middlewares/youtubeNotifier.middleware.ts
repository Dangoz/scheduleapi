import YouTubeNotifier from "youtube-notification";

module.exports = (app) => {

  console.log('initializing youtube notifier')

  const notifier = new YouTubeNotifier({
    hubCallback: 'https://vtb-schedule-api.herokuapp.com/youtube-notification',
    secret: 'pipi..pipipipipi..pi',
    middleware: true
  });

  app.use('/youtube-notification', notifier.listener());

  notifier.on('notified', data => {
    console.log('New Video: ', JSON.stringify(data, null, 2));
    console.log(
      `${data.channel.name} just uploaded a new video titled: ${data.video.title}`
    );
  });

  notifier.subscribe('UCZpMTTPDp2EAev6nb68Onjg');
}