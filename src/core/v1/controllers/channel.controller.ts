import IController from "@/interfaces/controller.interface";
import express from "express";

class ChannelController implements IController {
  public path = "/channel";
  public router = express.Router();
  private server;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(``)
  }

}

export default ChannelController;