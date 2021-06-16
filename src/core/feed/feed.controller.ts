import IController from "../../interfaces/controller.interface";
import express from "express";

class FeedController implements IController {
  public path = "/feeds";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, )
  }
}