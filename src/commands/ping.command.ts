import { Command, CommandMessage, Description } from "@typeit/discord";
import { CustomMessageEmbed } from "../classes/CustomMessageEmbed";

export default abstract class PingCommand {
  @Command()
  @Description("Faire du ping pong")
  async ping(command: CommandMessage) {
    const random = Math.random()
    console.log(random)
    if (random > 0.25) {
      await command.channel.send(new CustomMessageEmbed().setTitle("🏓 Ping Pong").setDescription("Le pong du joueur français"))
    } else {
      await command.channel.send(new CustomMessageEmbed().setTitle("🏓 Ping Pong").setDescription("Oooops, j'ai raté je crois"))
    }
  }
}
