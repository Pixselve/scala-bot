import { Command, CommandMessage, Description } from "@typeit/discord";
import { Main } from "../Main";
import { CustomMessageEmbed } from "../classes/CustomMessageEmbed";

export default abstract class HistoryCommand {
  @Command()
  @Description(
    "Obtenir l'historique des 10 dernier jeux et applications utilisés"
  )
  async history(command: CommandMessage) {
    const activities = await Main.prisma.activity.findMany({
      where: { user: { discordID: command.author.id } },
      take: 10,
      orderBy: { start: "desc" },
      include: {
        application: true,
      },
    });

    if (activities.length > 0) {
      await command.channel.send(
        new CustomMessageEmbed()
          .setTitle(`Voici votre historique ${command.author.username}`)
          .addFields(
            activities.map((activity) => ({
              name: activity.application.name,
              value: `${new Date(activity.start).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
              })} - ${activity.duration} minutes`,
            }))
          )
      );
    } else {
      await command.channel.send(
        new CustomMessageEmbed()
          .setTitle(`Voici votre historique ${command.author.username}`)
          .setDescription("😕 Votre historique est vide")
      );
    }
  }
}
