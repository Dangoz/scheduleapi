import PersonaModel from "@/model/persona.model";
import IProfile from "@/interfaces/api/profile.interface";
import ProfileViewModel from "@/viewmodel/profile.viewmodel";

class PersonaService {
  private personadb: PersonaModel = new PersonaModel();

  async getProfiles(): Promise<IProfile[]> {
    const personaChannelData = await this.personadb.getPersonaChannel();
    const profileViewModel = personaChannelData.map(personaChannel => ProfileViewModel.build(personaChannel));
    const profiles: IProfile[] = await Promise.all(profileViewModel);
    return profiles;
  }
}

export default PersonaService;