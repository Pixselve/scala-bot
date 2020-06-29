import { Client, Command, CommandMessage, Description } from "@typeit/discord";
import { CustomMessageEmbed } from "../classes/CustomMessageEmbed";

export default abstract class HelpCommand {
  @Command()
  @Description("Afficher toutes les commandes disponibles")
  async help(command: CommandMessage) {
    const commands = Client.getCommands();

    const embed = new CustomMessageEmbed()
      .setColor("#de3423")
      .setTitle("Commandes")
      .addFields(
        commands.map((command) => ({
          name: `_${command.commandName}`,
          value: command.description ?? "Cette commande n'a pas de description",
        }))
      );

    await command.channel.send(embed);
  }
}
