/**
 * Pinger: send Get requests to (ping) the frontend schedule website
 * for tiggering nextjs incremental static regeneration (for revalidating cache)
 */

import schedule from "node-schedule";
import axios from "axios";
import g1 from "../../prisma/seed/generation1.json";

module.exports = async () => {
  const talentList: string[] = g1.members.map(member => member.name.toLowerCase().split(' ').join(''));

  // scheduled job, every min, send a ping to schedule page
  schedule.scheduleJob('*/2 * * * * *', async () => {
    const response = await axios.get('https://schedule-indol.vercel.app/');
    if (response.status !== 200) console.log('schedule', response.status);
  });

  // scheduled job, every hour, send a ping to profile pages
  schedule.scheduleJob('* * */1 * * *', async () => {
    talentList.map(talent => {
      axios.get(`https://schedule-indol.vercel.app/v/${talent}`)
        .then(response => { if (response.status !== 200) console.log(talent, response.status) })
        .catch(err => console.log(err));
    })
  });
}