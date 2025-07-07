const { Message, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "bassboost",
  aliases: ["bb"],
  description: `Set a filter for current song.`,
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Filters",
  cooldown: 5,
  inVc: true,
  sameVc: true,
  dj: true,
  voteOnly: false,
  premium: false,
  run: async (client, message, args, prefix, player) => {
    if (!player) {
      const embed = new EmbedBuilder()
        .setDescription("<:Crossmark:1286524517417750613> | No Player Found For This Guild!")
        .setColor(client.config.color);
      return message.channel.send({ embeds: [embed] });
    }

    const data = {
      op: "filters",
      guildId: message.guild.id,
      equalizer: [
        { band: 0, gain: 0.15 }, // Increase gain for lower frequencies
        { band: 1, gain: 0.15 }, // Increase gain for lower frequencies
        { band: 2, gain: 0.1 }, // Slightly increase gain for mid-low frequencies
        { band: 3, gain: 0.1 }, // Slightly increase gain for mid-low frequencies
        { band: 4, gain: -0.1 }, // Decrease gain for mid frequencies (optional)
        { band: 5, gain: -0.1 }, // Decrease gain for mid frequencies (optional)
        { band: 6, gain: 0 }, // Keep mid frequencies neutral
        { band: 7, gain: -0.15 }, // Decrease gain for mid-high frequencies
        { band: 8, gain: -0.15 }, // Decrease gain for mid-high frequencies
        { band: 9, gain: 0 }, // Keep mid-high frequencies neutral
        { band: 10, gain: 0.1 }, // Slightly increase gain for high frequencies
        { band: 11, gain: 0.1 }, // Slightly increase gain for high frequencies
        { band: 12, gain: 0.15 }, // Increase gain for highest frequencies
        { band: 13, gain: 0.15 }, // Increase gain for highest frequencies
      ],
    };

    await player.shoukaku.setFilters(data);

    const embed = new EmbedBuilder()
      .setDescription("<:sec_tick:1286524512489443409> | **Turned on**: `BassBoost`")
      .setColor(client.color);

    await delay(5000);
    return message.reply({ embeds: [embed] });
  },
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
