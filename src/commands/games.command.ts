import { Command, CommandMessage, Description } from "@typeit/discord";
import { Main } from "../Main";
import { CustomMessageEmbed } from "../classes/CustomMessageEmbed";

export default abstract class GamesCommand {
  @Command()
  @Description(
    "Afficher tous les jeux et applications utilisés par les membres ainsi que leur temps d'utilisation total"
  )
  async games(command: CommandMessage) {
    const applications = await Main.prisma.application.findMany({
      include: { activities: true },
    });

    const totalMinutesCount = applications.reduce(
      (accumulatorApplication, currentValueApplication) =>
        accumulatorApplication +
        currentValueApplication.activities.reduce(
          (accumulatorActivity, currentValueActivity) =>
            accumulatorActivity + (currentValueActivity.duration ?? 0),
          0
        ),
      0
    );

    await command.channel.send(
      new CustomMessageEmbed()
        .setTitle("Jeux et applications utilisés")
        .setDescription(
          `${totalMinutesCount} minutes sur ${applications.length} jeu(x) et application(s)`
        )
        .addFields(
          applications.map((application) => ({
            name: application.name,
            value: `${application.activities.reduce(
              (accumulatorActivity, currentValueActivity) =>
                accumulatorActivity + (currentValueActivity.duration ?? 0),
              0
            )} minutes`,
          }))
        )
    );
  }
}
