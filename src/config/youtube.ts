import { response } from "express";
import { google, youtube_v3 } from "googleapis";
require('dotenv').config();

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY
});

export default youtube;

// export class YoutubeAPI {
//   private youtube: youtube_v3.Youtube;

//   constructor() {
//     this.youtube = google.youtube({
//       version: 'v3',
//       auth: process.env.GOOGLE_API_KEY
//     });
//   }


// }

import g1 from "../../prisma/seed/generation1.json";

const idList = g1.members.map(member => member.channel.id);
const ids = idList.join(',');
console.log(ids);

// youtube.channels.list({
//   part: ['snippet', 'contentDetails', 'statistics'],
//   id: [idList[1]],
//   // id: ['UCdCczCYPOeP5hTfbx6tzz_A'],
//   maxResults: 50
// }).then(response => {
//   const results = response.data.items;
//   console.log(JSON.stringify(results, null, 2));
// })
// .catch(err => console.log(err.errors))

// youtube.playlistItems.list({
//   part: ['id', 'snippet'],
//   playlistId: "UUJ46YTYBQVXsfsp8-HryoUA",
//   maxResults: 50,
//   // pageToken: undefined,
// }).then(response => {
//   const results = response.data;
//   console.log(JSON.stringify(results, null, 2))
// })

youtube.videos.list({
  part: ['id', 'snippet', 'liveStreamingDetails', 'statistics'],
  id: ["ljUUG0zpYj8",
// "kqBzapB_P0g"
],
  maxResults: 50
}).then(response => {
  const results = response.data;
  console.log(JSON.stringify(results, null, 2))
});
