// register & map modules for alias, see tsconfig paths
import moduleAlias from "module-alias";
moduleAlias.addAliases({ '@': __dirname, });

require("dotenv").config();
import App from "@/app";
import FeedController from "@/core/feed/controllers/feed.controller";
import ChannelController from "@/core/v1/controllers/channel.controller";
import VideoController from "@/core/v1/controllers/video.controller";

const server = new App([
  new FeedController(),
  new ChannelController(),
  new VideoController()
]);

server.start();