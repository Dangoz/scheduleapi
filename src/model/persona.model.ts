import prisma from "./prisma.client";
import { Persona, Channel } from "@prisma/client";

export default class PersonaModel {

  async getPersonaChannel(): Promise<(Persona & { channel: Channel[] })[]> {
    const data = await prisma.persona.findMany({
      include: {
        channel: true
      }
    })

    return data;
  }
}