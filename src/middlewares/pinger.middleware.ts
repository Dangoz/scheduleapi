/**
 * Pinger: send Get requests to (ping) the frontend schedule website
 * for tiggering nextjs incremental static regeneration (for revalidating cache)
 */

import schedule from "node-schedule";
import axios from "axios";
import g1 from "../../prisma/seed/generation1.json";

module.exports = async () => {
  const talentList: string[] = g1.members.map(member => member.name.toLowerCase().split(' ').join(''));
  const frontendURL = 'https://schedule-pc.vercel.app';

  // scheduled job, every min, send a ping to schedule page
  schedule.scheduleJob('15 * * * * *', async () => {
    const response = await axios.get(frontendURL);
    if (response.status !== 200) console.log('schedule', response.status);
  });

  // scheduled job, every hour, send a ping to profile pages
  schedule.scheduleJob('0 0 * * * *', async () => {
    talentList.map(talent => {
      axios.get(`${frontendURL}/v/${talent}`)
        .then(response => { if (response.status !== 200) console.log(talent, response.status) })
        .catch(err => console.log(err));
    })
  });
}