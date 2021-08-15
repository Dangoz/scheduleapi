import IController from "@/interfaces/controller.interface";
import express from "express";
import PersonaService from "../services/persona.service";
import IProfile from "@/interfaces/api/profile.interface";

class PersonaController implements IController {
  public path = "/persona";
  public router = express.Router();
  private service: PersonaService = new PersonaService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get(`${this.path}`, this.getPersonaChannel)
  }

  private getPersonaChannel = async (req: express.Request, res: express.Response) => {
    const profiles: IProfile[] = await this.service.getProfiles();
    res.status(200).json({ profiles }); 
  }
}

export default PersonaController;