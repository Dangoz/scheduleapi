import IController from "@/interfaces/controller.interface";
import IStreamVideo from "@/interfaces/api/stream-video.interface";
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
    this.router.get(`${this.path}/stream`, this.getStreamVideo);
    this.router.get(`${this.path}/complete`, this.getCompleteVideo);
  }

  private getStreamVideo = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const videos: IStreamVideo[] = await this.service.getStreamVideo();
    res.status(200).json({ videos });
  }

  private getCompleteVideo = async (req: express.Request, res: express.Response) => {
    const channelIds: string[] = Array.isArray(req.query.cids) ? req.query.cids as string[] : [];
    const videos = await this.service.getCompleteVideo(channelIds);
    res.status(200).json({ videos });
  }
}

export default VideoController;