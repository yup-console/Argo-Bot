const { Message, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const formatDuration = require("../../structure/formatDuration.js");

module.exports = {
  name: "nowplaying",
  aliases: ["np"],
  description: `Display the song currently playing.`,
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Music",
  cooldown: 5,
  inVc: true,
  dj: true,
  sameVc: true,
  premium: false,
  run: async (client, message, args, prefix, player) => {
    if (!player) {
      const embed = new EmbedBuilder()
        .setDescription("<:Crossmark:1286524517417750613> | No Player Found For This Guild!")
        .setColor(client.config.color);
      return message.channel.send({ embeds: [embed] });
    }

    const song = player.queue.current;
    const CurrentDuration = formatDuration(player.position);
    const TotalDuration = formatDuration(song.length);

    const Part = Math.floor((player.position / song.length) * 30);
    const Emoji = player.playing ? "<:duration:1279037475016409128>" : "<:pausee:1279068699453554768>";

    const embed = new EmbedBuilder()
      .setAuthor({
        name: player.playing ? `Now Playing` : `Song Paused`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setColor(client.color)
      .setDescription(
        `**<a:Playing:1279047119256420362> [${
          song.title.length > 50
            ? song.title.slice(0, 50) + "..."
            : song.title || "Unknow Track"
        }](${client.config.ssLink})**`
      )
      /*.addFields({
        name: `Author:`,
        value: `${song.author || "Unknow"}`,
        inline: true,
      })*/
      .addFields({
        name: `<:requestor:1279037472449368136> Requester:`,
        value: `${song.requester || "**Argo**"}`,
        inline: true,
      })
      .addFields({
        name: `<:volumeup:1278701277416652800> Volume:`,
        value: `${player.options.volume}%`,
        inline: true,
      })
      .addFields({
        name: `<:queue:1279037678163198044> Queue Length:`,
        value: `${player.queue.length}`,
        inline: true,
      })
      .addFields({
        name: `<:duration:1279037475016409128> Duration: \`[${CurrentDuration} / ${TotalDuration}]\``,
        value: `${Emoji} **Progress:**\n\`\`\`${
          "─".repeat(Part) + "🔘" + "─".repeat(30 - Part)
        }\`\`\``,
        inline: false,
      })
      .setTimestamp();

    if (song.thumbnail) {
      embed.setThumbnail(song.thumbnail);
    } else {
      embed.setThumbnail(client.user.displayAvatarURL());
    }

    return message.reply({ embeds: [embed] });
  },
};
