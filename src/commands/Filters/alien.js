const { Message, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "alienvibes",
  aliases: ["alien", "space"],
  description: `Set an Alien Vibes filter for the current song.`,
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

    // Adjusted Alien Vibes filter configuration
    const data = {
      op: "filters",
      guildId: message.guild.id,
      timescale: {
        speed: 1.2, // Slightly increased speed (reduced from 1.5)
        pitch: 1.8, // High-pitched alien sound
        rate: 1.0, // Set rate to normal (1.0) to avoid finishing track early
      },
      vibrato: {
        frequency: 10.0, // Still keep the vibrato effect, but reduce frequency
        depth: 0.6, // Deep vibrato effect for alien-like sound
      },
      echo: {
        delay: 0.4, // Slightly longer delay
        decay: 0.8, // Echo decay remains the same
      }
    };

    await player.shoukaku.setFilters(data);

    const embed = new EmbedBuilder()
      .setDescription("<:sec_tick:1286524512489443409> | **Turned on**: `Alien Vibes`")
      .setColor(client.color);

    await delay(5000);
    return message.reply({ embeds: [embed] });
  },
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
