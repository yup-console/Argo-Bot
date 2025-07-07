const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} = require("discord.js");
const setup = require("../models/SetupSchema.js");

const updateMessage = async (player, client, track) => {
  const updateData = await setup.findOne({ guildId: player.guildId });
  if (updateData) {
    try {
      const channel = await client.channels.fetch(updateData.channelId);
      const message = await channel.messages.fetch(updateData.messageId);
      const title = track
        ? `>>> ${client.emoji.playing} **Now Playing**: **[${
            track.title.length > 50
              ? track.title.slice(0, 50) + "..."
              : track.title || "Unknown Track"
          }](${client.config.ssLink})**\n${client.emoji.requester} **Requestor**: ${
            track.requester || "**Argo**"
          } `
        : "__**Join a Voice Channel & Request a Song**__\n**Elevate Your Music Experience with Argo**: Join Vc & Request a Song. We are here to Deliver The High Quality Music For You!";

      let embedl = new EmbedBuilder()
        .setColor(client.color)
        .setImage(`https://images-ext-1.discordapp.net/external/Iwyp9nW_4VThTq6aH_v_drML8WGia4qvhdqm2qrntvE/%3Fsize%3D4096/https/cdn.discordapp.com/banners/1131938711639183363/a_1799e4c8b9af657aaedb814800185b38.gif?width=1440&height=508`)

      let embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(title)
        .setImage(`${client.config.setupBgLink}`)
        .setAuthor({
          name: `Argo - Requests`,
          iconURL: message.guild.iconURL({ dynamic: true }),
        })
        .setFooter({
          text: `| Thanks for choosing ${client.user.username}`,
          iconURL: `https://cdn.discordapp.com/emojis/1246706215182925877.webp?size=128&quality=lossless`,
        });

      const filterRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("filterSelect")
          .setPlaceholder("Select a filter")
          .addOptions(
            {
              label: "Bass Boost",
              description: "Apply a bass boost filter",
              value: "bassboost",
              emoji: "<:filtersss:1279054729543946260>",
            },
            {
              label: "Nightcore",
              description: "Apply a nightcore filter",
              value: "nightcore",
              emoji: "<:filtersss:1279054729543946260>",
            },
            {
              label: "Vaporwave",
              description: "Apply a vaporwave filter",
              value: "vaporwave",
              emoji: "<:filtersss:1279054729543946260>",
            },
            {
              label: "Tremolo",
              description: "Apply a tremolo filter",
              value: "tremolo",
              emoji: "<:filtersss:1279054729543946260>",
            },
            {
              label: "Vibrato",
              description: "Apply a vibrato filter",
              value: "vibrato",
              emoji: "<:filtersss:1279054729543946260>",
            },
            {
              label: "Karaoke",
              description: "Apply a karaoke filter",
              value: "karaoke",
              emoji: "<:filtersss:1279054729543946260>",
            },
            {
              label: "Distortion",
              description: "Apply a distortion filter",
              value: "distortion",
              emoji: "<:filtersss:1279054729543946260>",
            },
            {
              label: "None",
              description: "Remove all filters",
              value: "none",
              emoji: "<:replay:1278699930529042453>",
            }
          )
      );

      const row = new ActionRowBuilder()
        .addComponents(
        new ButtonBuilder()
          .setCustomId("setup_vol+")
          .setLabel("Vol+")
          .setStyle(ButtonStyle.Success)
        )
        .addComponents(
        new ButtonBuilder()
          .setCustomId("setup_pause")
          .setLabel(!player.paused ? "Resume" : "Pause")
          .setStyle(ButtonStyle.Primary)
        )
        .addComponents(
         new ButtonBuilder()
           .setCustomId("setup_skip")
           .setLabel("Skip")
           .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
        new ButtonBuilder()
          .setCustomId("setup_vol-")
          .setLabel("Vol-")
          .setStyle(ButtonStyle.Danger)
        );

      const row2 = new ActionRowBuilder()
        .addComponents(
        new ButtonBuilder()
          .setCustomId("setup_shuffle")
          .setLabel("Shuffle")
          .setStyle(ButtonStyle.Success)
        )
        .addComponents(
        new ButtonBuilder()
          .setCustomId("setup_replay")
          .setLabel("Replay")
          .setStyle(ButtonStyle.Primary)
        )
        .addComponents(
        new ButtonBuilder()
          .setCustomId("setup_clear")
          .setLabel("Clear")
          .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
        new ButtonBuilder()
          .setCustomId("setup_stop")
          .setLabel("X")
          .setStyle(ButtonStyle.Danger)
        )
      await message.edit({
        embeds: [embedl, embed],
        components: [filterRow, row, row2],
      });
    } catch (error) {
      console.error("Error editing message:", error);
    }
  }
};

module.exports = updateMessage;
