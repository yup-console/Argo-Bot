const { EmbedBuilder, WebhookClient } = require("discord.js");
const client = require("..");
const web = new WebhookClient({ url: `${client.config.leave_log}` });

module.exports = async (client) => {
  client.on("guildDelete", async (guild) => {
    try {
      const guildCount = await client.cluster.broadcastEval(
        (c) => c.guilds.cache.size
      );
      const totalGuilds = guildCount.reduce((a, b) => a + b, 0);

      const userCount = await client.cluster.broadcastEval((c) =>
        c.guilds.cache
          .filter((x) => x.available)
          .reduce((a, g) => a + g.memberCount, 0)
      );
      const totalUsers = userCount.reduce((acc, count) => acc + count, 0);

      const em = new EmbedBuilder()
        .setTitle(`Guild Left`)
        .setColor(client.color)
        .setAuthor({
          name: `${client.user.username}`,
          iconURL: client.user.displayAvatarURL(),
        })
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .addFields([
          {
            name: `Guild Info`,
            value: `Guild Name: ${guild.name}\nGuild Id: ${
              guild.id
            }\nGuild Created: <t:${Math.round(
              guild.createdTimestamp / 1000
            )}:R>\nMemberCount: ${guild.memberCount} Members`,
          },
          {
            name: `Bot Info`,
            value: `Server Count: ${totalGuilds} Servers\nUsers Count: ${totalUsers} Users`,
          },
        ]);

      web.send({ embeds: [em] });
    } catch (error) {
      console.log("Error sending guild left webhook:", error);
    }
  });
};
