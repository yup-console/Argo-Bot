const { Message, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "chillwave",
  aliases: ["chill"],
  description: `Set a Chillwave filter for the current song.`,
  category: "Filters",
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

    const data = {
      op: "filters",
      guildId: message.guild.id,
      equalizer: [
        { band: 0, gain: 0.3 },  // Boost low frequencies for warmth
        { band: 1, gain: 0.2 },
        { band: 2, gain: 0 },
        { band: 3, gain: -0.1 },
        { band: 4, gain: -0.2 }, // Muffle high frequencies
        { band: 5, gain: -0.3 },
        { band: 6, gain: -0.4 },
        { band: 7, gain: -0.4 },
        { band: 8, gain: -0.3 },
        { band: 9, gain: -0.2 },
        { band: 10, gain: -0.1 },
        { band: 11, gain: 0 }
      ],
      reverb: {
        wet: 0.4, // Moderate reverb for atmosphere
        roomSize: 0.7, // Medium room size for spaciousness
        damping: 0.3 // Echo damping
      },
      tremolo: {
        frequency: 5.0, // Slow tremolo for a gentle wave effect
        depth: 0.2
      }
    };

    await player.shoukaku.setFilters(data);

    const embed = new EmbedBuilder()
      .setDescription("<:sec_tick:1286524512489443409> | **Turned on**: `Chillwave`")
      .setColor(client.color);

    await delay(5000);
    return message.reply({ embeds: [embed] });
  },
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
