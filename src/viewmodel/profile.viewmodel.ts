import { Channel, Persona } from "@prisma/client";
import IProfile from "@/interfaces/api/profile.interface";

/**
 * process channel/persona data from database and match
 * properties with that of IProfile for frontend interface
 */
export default class ProfileViewModel implements IProfile {
  name: string;
  lore: string;
  description: string;
  suborg: string;
  photo: string;
  banner: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  youtube?: string;
  twitter: string;
  marshmallow: string;

  private constructor(persona: (Persona & { channel: Channel[] })) {
    const channel = persona.channel[0];
    this.name = persona.name;
    this.lore = persona.lore;
    this.description = channel.description;
    this.suborg = persona.suborg;
    this.photo = channel.photo;
    this.banner = channel.banner;
    this.subscriberCount = channel.subscriberCount;
    this.viewCount = channel.viewCount;
    this.videoCount = channel.videoCount;
    if (channel.platform === "youtube") this.youtube = `https://www.youtube.com/channel/${channel.id}`;
    this.twitter = persona.twitter;
    this.marshmallow = persona.marshmallow;
  }

  static async build(persona: (Persona & { channel: Channel[] }), options?: {}): Promise<ProfileViewModel> {
    // additional processing according to options

    return new ProfileViewModel(persona);
  }
}