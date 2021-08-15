import IController from "@/interfaces/controller.interface";
import express from "express";
import PersonaService from "../services/persona.service";

class PersonaController implements IController {
  public path = "/persona";
  public router = express.Router();
  private service: PersonaService = new PersonaService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes = () => {

  }
}

export default PersonaController;