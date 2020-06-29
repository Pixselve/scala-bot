import * as Path from "path";
import {
  ArgsOf,
  Client,
  CommandMessage,
  CommandNotFound,
  Discord,
  On,
} from "@typeit/discord";
import { CustomMessageEmbed } from "../classes/CustomMessageEmbed";
import { Main } from "../Main";

@Discord("_", {
  import: [
    Path.join(__dirname, "..", "commands", "*.command.ts"),
    Path.join(__dirname, "..", "commands", "*.command.js"),
  ],
})
export class DiscordApp {
  @On("presenceUpdate")
  async onPresenceUpdate(
    [oldPresence, newPresence]: ArgsOf<"presenceUpdate">,
    client: Client
  ) {
    const userID = newPresence.userID;

    const newPresenceApplicationsIDs = newPresence.activities.map(
      (activity) => activity.applicationID
    );

    const applicationsIDsStopped =
      oldPresence?.activities.filter(
        (activity) =>
          activity.applicationID !== null &&
          !newPresenceApplicationsIDs.includes(activity.applicationID)
      ) ?? [];

    console.log(applicationsIDsStopped);
    await Promise.all(
      applicationsIDsStopped.map((activity) =>
        activity.createdTimestamp && activity.applicationID
          ? Main.prisma.activity.create({
              data: {
                user: {
                  connectOrCreate: {
                    create: { discordID: userID },
                    where: { discordID: userID },
                  },
                },
                application: {
                  connectOrCreate: {
                    where: { id: activity.applicationID },
                    create: {
                      id: activity.applicationID,
                      name: activity.name,
                      image:
                        activity.assets?.largeImageURL() ??
                        activity.assets?.smallImageURL(),
                    },
                  },
                },
                start: new Date(activity.createdTimestamp),
                end: new Date(),
              },
            })
          : null
      )
    );
  }

  @CommandNotFound()
  async notFoundA(command: CommandMessage) {
    const embed = new CustomMessageEmbed()
      .setColor("#de3423")
      .setTitle("Commandes")
      .addField("Erreur", "La commande est introuvable");

    await command.channel.send(embed);
  }
}
