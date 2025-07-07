const db = require("../models/SetupSchema.js");
const { EmbedBuilder } = require("discord.js");
const updateQueue = require("../handlers/setupQueue");

module.exports = async (client) => {
  client.on("messageCreate", async (message, player, track) => {
    let data;
    try {
      data = await db.findOne({
        guildId: message.guild.id,
      });
    } catch (error) {
      console.error("Database query error:", error); // Log any database errors
    }

    if (data) {
      if (data.channelId === message.channel.id) {
        if (message.author.bot && message.author.id !== client.user.id) {
          return await message
            .delete()
            .catch((err) => console.error("Error deleting message:", err));
        }
        if (message.author.id === client.user.id) return;
        if (!message.member.voice.channel) {
          return message.channel
            .send({
              content: `${message.author} | You must be connected to a voice channel`,
            })
            .then((x) => {
              setTimeout(() => {
                x.delete().catch((err) =>
                  console.error("Error deleting message:", err)
                );
              }, 5000);
            });
        }
        if (
          message.guild.members.me.voice.channel &&
          message.guild.members.me.voice.channel.id !==
            message.member.voice.channel.id
        ) {
          await message
            .delete()
            .catch((err) => console.error("Error deleting message:", err));
          return message.channel
            .send({
              content: `${message.author} | You must be connected to the same voice channel ${message.guild.members.me.voice.channel}`,
            })
            .then((x) => {
              setTimeout(() => {
                x.delete().catch((err) =>
                  console.error("Error deleting message:", err)
                );
              }, 5000);
            });
        }
        let prefix = data.prefixz;
        if (prefix === null) prefix = client.config.prefix;
        let regex = new RegExp(`^<@!?${client.user.id}>`);
        let pre = message.content.match(regex)
          ? message.content.match(regex)[0]
          : prefix;
        if (
          client.mcommands.get(
            message.content.trim().split(/ +/).shift().toLowerCase()
          ) ||
          client.mcommands.find(
            (c) =>
              c.aliases &&
              c.aliases.includes(
                message.content.trim().split(/ +/).shift().toLowerCase()
              )
          ) ||
          (message.content.startsWith(pre) &&
            client.mcommands.get(
              message.content
                .slice(pre.length)
                .trim()
                .split(/ +/)
                .shift()
                .toLowerCase()
            )) ||
          (message.content.startsWith(pre) &&
            client.mcommands.find(
              (c) =>
                c.aliases &&
                c.aliases.includes(
                  message.content
                    .slice(pre.length)
                    .trim()
                    .split(/ +/)
                    .shift()
                    .toLowerCase()
                )
            ))
        ) {
          await message
            .delete()
            .catch((err) => console.error("Error deleting message:", err));
          return message.channel
            .send({
              content: `<:Crossmark:1286524517417750613> | Don't use any of my commands here.`,
            })
            .then((x) => {
              setTimeout(() => {
                x.delete().catch((err) =>
                  console.error("Error deleting message:", err)
                );
              }, 7000);
            });
        }

        const query = message.content;
        await message.delete().catch((e) => console.log(e));
        if (!player) {
          const vcId = message.member.voice.channel.id;
          player = await client.manager.createPlayer({
            guildId: message.guild.id,
            textId: message.channel.id,
            voiceId: vcId,
            volume: 100,
            deaf: true,
            shardId: message.guild.shardId,
          });
          console.log("Player created:", message.guild.name); // Log player creation
        }
        let result;
        try {
          result = await client.manager.search(query, {
            requester: message.author,
          });
        } catch (error) {
          console.error("Search error:", error); // Log search error
        }

        if (!result.tracks.length) {
          const embed = new EmbedBuilder()
            .setDescription("<:Crossmark:1286524517417750613> | No results found!")
            .setColor(client.color);
          return message.channel.send({ embeds: [embed] }).then((msg) => {
            setTimeout(() => {
              msg
                .delete()
                .catch((err) => console.error("Error deleting message:", err));
            }, 3000);
          });
        }

        if (result.type === "PLAYLIST") {
          for (let track of result.tracks) player.queue.add(track);
        } else {
          player.queue.add(result.tracks[0]);
        }

        if (!player.playing && !player.paused) player.play();

        if (result.type === "PLAYLIST") {
          const embed = new EmbedBuilder()
            .setDescription(
              `<:queue:1279037678163198044> | **Queued** ${result.tracks.length} **from [${result.playlistName}](${client.config.ssLink})**`
            )
            .setColor(client.color);
            await updateQueue(message.guild,player.queue);
          return message.channel.send({ embeds: [embed] }).then((msg) => {
            setTimeout(() => {
              msg
                .delete()
                .catch((err) => console.error("Error deleting message:", err));
            }, 3000);
          });
        } else {
          const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              `<:queue:1279037678163198044> | **Queued [${
                result.tracks[0].title.length > 50
                  ? result.tracks[0].title.slice(0, 50) + "..."
                  : result.tracks[0].title
              }](${client.config.ssLink}) By** [${result.tracks[0].requester}]`
            );
            
          return message.channel.send({ embeds: [embed] }).then((msg) => {
            setTimeout(() => {
              msg
                .delete()
                .catch((err) => console.error("Error deleting message:", err));
            }, 3000);
          });
        }
      }
    }
  });
};
