import IController from "@/interfaces/controller.interface";
import express from "express";
import ChannelService from "../services/channel.service";

class ChannelController implements IController {
  public path = "/channel";
  public router = express.Router();
  private service: ChannelService = new ChannelService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.getChannel);
  }

  private getChannel = async (req: express.Request, res: express.Response) => {
    const channels = await { wow: 'placeholder'};
    res.status(200).json({ channels });
  }

}

export default ChannelController;