const client = require("../index");
const { EmbedBuilder } = require("discord.js");
const db = require("../models/SetupSchema");
const updateMessage = require("../handlers/setupQueue.js");

module.exports = async (client, track) => {
  client.manager.on("playerEnd", async (player) => {
    await updateMessage(player, client, track);
    if (player.data.get("autoplay")) {
      const requester = player.data.get("requester");
      const identifier = player.data.get("identifier");
      const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
      const res = await player.search(search, { requester: requester });
      if (!res.tracks.length) return;
      await player.queue.add(
        res.tracks[Math.floor(Math.random() * res.tracks.length)]
      );
    }
  });

  client.manager.on("playerEmpty", async (player) => {
    await updateMessage(player, client, track);
    const embed = new EmbedBuilder()
      .setAuthor({
        name: "| Queue Concluded",
        iconURL: client.user.displayAvatarURL(),
      })
      .setColor(client.color)
      .setDescription("Enjoying Music with me? Consider [Inviting](https://discord.com/oauth2/authorize?client_id=1131938711639183363) me!");

    let data = await db.findOne({ guildId: player.guildId });
    if (data && data.channelId === player.textId) return;
    client.channels.cache
      .get(player.textId)
      ?.send({ embeds: [embed] })
      .then((x) => player.data.set("message", x));
  });

  client.manager.on("playerMoved", async (player) => {
    await updateMessage(player, client, track);
    player.destroy();
  });
};
