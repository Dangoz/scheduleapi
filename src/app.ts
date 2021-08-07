import express from "express";
import IController from "@/interfaces/controller.interface";

class App {
  private _app: express.Application;
  private readonly _port: number | string = process.env.PORT || 5000;

  constructor(public controllers: IController[]) {
    this._app = express();

    this.initializeMiddlewares();
    this.initializeControllers();

    // initialize crawler
    require("./crawler/scheduler")();
  }

  public start() {
    this._app.listen(this._port, () => {
      console.log(`schedule-api listening on the port ${this._port}`);
    });
  }

  private initializeMiddlewares() {
    require("./middlewares/express.middleware")(this._app);
    require("./middlewares/youtubeNotifier.middleware")(this._app);
  }

  private initializeControllers() {

    // redirect all http requests to https
    this._app.all('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (req.headers['x-forwarded-proto'] === 'http') {
        res.redirect(`https://${req.headers.host}${req.url}`);
      } else {
        next();
      }
    });

    // pass in each router from controllers
    this.controllers.forEach(controller => {
      this._app.use('/', controller.router);
    })
  }
}

export default App;