const { Message, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "underwater",
  aliases: ["water", "deepsea"],
  description: `Set an Underwater filter for the current song.`,
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
      timescale: {
        speed: 0.8, // Slightly slower to mimic underwater sound
        pitch: 0.7, // Lower pitch
        rate: 0.9, // Slow rate
      },
      equalizer: [
        { band: 0, gain: 0.3 }, // Boost low-end for bassy underwater effect
        { band: 1, gain: 0.3 },
        { band: 2, gain: -0.2 }, // Muffled mids
        { band: 3, gain: -0.2 },
        { band: 4, gain: -0.3 }, // Muffled highs
        { band: 5, gain: -0.3 },
        { band: 6, gain: -0.4 },
        { band: 7, gain: -0.4 },
        { band: 8, gain: -0.5 },
        { band: 9, gain: -0.5 },
        { band: 10, gain: -0.6 },
        { band: 11, gain: -0.6 },
        { band: 12, gain: -0.7 },
        { band: 13, gain: -0.7 },
        { band: 14, gain: -0.8 }
      ],
      reverb: {
        wet: 0.6 // Heavy reverb for underwater echo
      }
    };

    await player.shoukaku.setFilters(data);

    const embed = new EmbedBuilder()
      .setDescription("<:sec_tick:1286524512489443409> | **Turned on**: `Underwater`")
      .setColor(client.color);

    await delay(5000);
    return message.reply({ embeds: [embed] });
  },
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
