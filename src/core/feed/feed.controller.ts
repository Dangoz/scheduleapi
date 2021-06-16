import IController from "../../interfaces/controller.interface";
import express from "express";

class FeedController implements IController {
  public path = "/feeds";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/youtube`, this.youtubeFeeds)
  }

  private youtubeFeeds = async (req: express.Request, res: express.Response) => {
    const data = req.body;
    console.log('feed data', JSON.stringify(data, null, 2))
  }
}