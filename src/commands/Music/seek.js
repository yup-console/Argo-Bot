const { Message, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "seek",
  aliases: ["trim"],
  description: ``,
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Music",
  cooldown: 5,
  inVc: true,
  sameVc: true,
  dj: true,
  premium: false,
  run: async (client, message, args, prefix, player) => {
    if (!player) {
      const embed = new EmbedBuilder()
        .setDescription("<:Crossmark:1286524517417750613> | No Player Found For This Guild!")
        .setColor(client.config.color);
      return message.channel.send({ embeds: [embed] });
    }
    // here
    if (!args[0]) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.color)
              .setDescription(
                `Use the command again, and provide me a duration to seek.`
              ),
          ],
        });
      }
      if (!player.queue.current.isSeekable) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.color)
              .setDescription(`<:Crossmark:1286524517417750613> | This track isn't seekable.`),
          ],
        });
      }
      if (!/^[0-5]?[0-9](:[0-5][0-9]){1,2}$/.test(args[0])) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.color)
              .setDescription(
                `<:Crossmark:1286524517417750613> | You provided an invalid duration. Valid duration e.g. \`1:34\``
              ),
          ],
        });
      }
      let ms = () => {
        return (
          args[0]
            .split(":")
            .map(Number)
            .reduce((a, b) => a * 60 + b, 0) * 1000
        );
      };
      ms = ms();
      if (ms > player.queue.current.length) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.color)
              .setDescription(
                `<:Crossmark:1286524517417750613> | The duration you provided exceeds the duration of the current track.`
              ),
          ],
        });
      }
     
      player.seek(ms);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              `<:sec_tick:1286524512489443409> | Seeked to ${duration(ms)} of the current track.`
            ),
        ],
      });
  },
};

function duration(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

  const hoursStr = hours < 10 ? `0${hours}` : hours;
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  const secondsStr = seconds < 10 ? `0${seconds}` : seconds;

  return `${hoursStr}:${minutesStr}:${secondsStr}`;
}
