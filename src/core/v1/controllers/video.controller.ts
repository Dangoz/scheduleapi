import IController from "@/interfaces/controller.interface";
import express from "express";
import VideoService from "../services/video.service";

class VideoController implements IController {
  public path = "/video";
  public router = express.Router();
  private service: VideoService = new VideoService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.getVideo);
  }

  private getVideo = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(200).json({ videos: 'meow~~meow~!!!~' })
  }
}

export default VideoController;