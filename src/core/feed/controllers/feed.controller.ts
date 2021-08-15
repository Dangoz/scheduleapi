import IController from "@/interfaces/controller.interface";
import express from "express";

class FeedController implements IController {
  public path = "/feeds";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', this.greeting);
  }

  private greeting = async (req: express.Request, res: express.Response) => {
    res.status(233).send('ฅ(=´♡ᆽ♡`=)ฅ. meow??? .ฅ(=´♡ᆽ♡`=)ฅ');
  }

}

export default FeedController;