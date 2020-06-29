import { Command, CommandMessage, Description, Discord } from "@typeit/discord";
import { Main } from "../Main";
import { CustomMessageEmbed } from "../classes/CustomMessageEmbed";

@Discord("!")
export default abstract class TopCommand {
  @Command("top :type")
  @Description("Top des joueurs (_top players) ou top des jeux (_top games)")
  async top(command: CommandMessage) {
    const players = await Main.prisma.user.findMany({
      select: { activities: true, discordID: true },
    });
    const playersActivityHoursCount = players.map((player) => ({
      totalPlayed: player.activities.reduce(
        (previousValue, currentValue) =>
          previousValue + (currentValue.duration ?? 0),
        0
      ),
      discordID: player.discordID,
    }));

    playersActivityHoursCount.sort((a, b) => b.totalPlayed - a.totalPlayed);

    let selectedPlayers: { totalPlayed: number; discordID: string }[] = [];

    if (playersActivityHoursCount.length >= 3) {
      selectedPlayers = playersActivityHoursCount.slice(0, 3);
    } else {
      selectedPlayers = [...playersActivityHoursCount];
    }

    const members = await command.guild?.members.fetch();

    if (members !== undefined)
      await command.channel.send(
        new CustomMessageEmbed()
          .setTitle("Joueurs ayant le plus joué")
          .addFields(
            selectedPlayers.map((selectedPlayer, i) => ({
              name:
                returnMedalEmoji(i) +
                  members.find((member) => {
                    return member.user.id == selectedPlayer.discordID;
                  })?.user.username ?? "Joueur inconnu",
              value: `${formatMinutes(selectedPlayer.totalPlayed)}`,
            }))
          )
      );
  }
}

function returnMedalEmoji(rank: number): string {
  if (rank === 0) {
    return "🥇";
  } else if (rank === 1) {
    return "🥈";
  } else {
    return "🥉";
  }
}

function formatMinutes(minutes: number) {
  const m = minutes % 60;

  const h = (minutes - m) / 60;

  return (
    `${h.toString()} heure(s) ` + (m > 0 ? `${m.toString()} minute(s)` : "")
  );
}
