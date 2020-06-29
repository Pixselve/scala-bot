import { MessageEmbed } from "discord.js";

export class CustomMessageEmbed extends MessageEmbed {
  constructor() {
    super();
    this.setColor("#DE3423");
    this.setFooter("ScalaBot BETA");
    this.setTimestamp(new Date());
  }
}

export class ErrorMessageEmbed extends MessageEmbed {
  constructor() {
    super();
    this.setColor("#DE3423");
    this.setFooter("ScalaBot BETA");
    this.setTimestamp(new Date());
    this.setTitle("Une erreur est survenue");
  }
}
