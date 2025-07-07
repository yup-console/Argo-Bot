const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "node",
  aliases: ["lavalink"],
  description: "lavalink stats",
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Owner",
  ownerOnly: false,
  run: async (client, message, args, prefix) => {
    let sumant = ['958583892326117437'];
      if (!sumant.includes(message.author.id)) return message.reply({content : `<:Crossmark:1286524517417750613> | Be my owner to run this command.`})

    try {
      const embed = new EmbedBuilder()
        .setTitle("Lavalink Stats")
        .setColor(client.color)
        .setThumbnail(client.user.avatarURL())
        .setTimestamp();

      client.manager.shoukaku.nodes.forEach((node) => {
        embed.addFields(
          { name: "Name", value: `${node.name} (${node.stats ? "🟢" : "🔴"})` },
          { name: "Player", value: `${node.stats.players}` },
          { name: "Playing Players", value: `${node.stats.playingPlayers}` },
          { name: "Uptime", value: `${formatTime(node.stats.uptime)}` },
          { name: "Cores", value: `${node.stats.cpu.cores} Core(s)` },
          {
            name: "Memory Usage",
            value: `${formatBytes(node.stats.memory.used)}/${formatBytes(node.stats.memory.reservable)}`,
          },
          {
            name: "System Load",
            value: `${(Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(2)}%`,
          },
          {
            name: "Lavalink Load",
            value: `${(Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2)}%`,
          }
        );
      });

      return message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.log(error);
    }
  },
};

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatTime(milliseconds) {
  if (milliseconds < 0) {
    return "Invalid input";
  }

  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
  const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

  const formatComponent = (value, unit) => (value > 0 ? `${value}${unit} ` : "");

  const formattedDays = formatComponent(days, "d");
  const formattedHours = formatComponent(hours, "h");
  const formattedMinutes = formatComponent(minutes, "m");

  return formattedDays + formattedHours + formattedMinutes;
}
