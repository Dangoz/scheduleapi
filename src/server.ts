import App from "./app";
import FeedController from "./core/feed/controllers/feed.controller";

require("dotenv").config();

const server = new App([
  new FeedController(),
]);

server.start();