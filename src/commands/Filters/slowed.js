const { Message, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "sr",
  aliases: ["slowed", "reverb"],
  description: `Set a Slowed and Reverb filter for the current song.`,
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

    // Slowed + Reverb filter configuration
    const data = {
      op: "filters",
      guildId: message.guild.id,
      equalizer: [
        { band: 0, gain: 0 },
        { band: 1, gain: 0 },
        { band: 2, gain: 0 },
        { band: 3, gain: 0 },
        { band: 4, gain: 0 },
        { band: 5, gain: 0 },
        { band: 6, gain: 0 },
        { band: 7, gain: 0 },
        { band: 8, gain: 0.15 },  // Boosted lower frequencies for depth
        { band: 9, gain: 0.15 },
        { band: 10, gain: 0.10 },
        { band: 11, gain: 0.10 },
        { band: 12, gain: 0.05 },
        { band: 13, gain: 0.05 },
        { band: 14, gain: 0.05 }
      ],
      timescale: { 
        speed: 0.85, // Slowed down
        pitch: 1.0,  // Pitch unchanged
        rate: 0.85  // Slower rate
      },
      reverb: {
        wet: 0.3 // Adds reverb effect
      }
    };

    // Apply the filter to the player
    await player.shoukaku.setFilters(data);

    const embed = new EmbedBuilder()
      .setDescription("<:sec_tick:1286524512489443409> | **Turned on**: `Slowed + Reverb`")
      .setColor(client.color);

    // Wait for the filter to take effect
    await delay(5000);

    return message.reply({ embeds: [embed] });
  },
};

// Delay function
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
