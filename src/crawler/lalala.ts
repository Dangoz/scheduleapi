import schedule from "node-schedule";

import youtube from "../modules/youtube";

module.exports = () => {

  console.log('waaa' + new Date().toString());
  schedule.scheduleJob(process.env.SCHEDULE_CHANNEL_INFO as string, () => {
    console.log("RUAAAaa! lalalal : " + new Date().toString())
  });

  schedule.scheduleJob('*/1 * * * *', () => {
    console.log("RUAAAaa! " + new Date().toString())
  });
}