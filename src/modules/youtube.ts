import { google } from "googleapis";

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY
});

export default youtube;