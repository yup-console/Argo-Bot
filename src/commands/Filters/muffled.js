const { Message, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "muffled",
  aliases: ["distant"],
  description: `Set a Muffled filter for the current song.`,
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
        { band: 0, gain: 0.4 },  // Boost low frequencies
        { band: 1, gain: 0.3 },
        { band: 2, gain: 0.1 },
        { band: 3, gain: -0.2 }, // Muffle mids
        { band: 4, gain: -0.4 }, // Heavy muffling for highs
        { band: 5, gain: -0.5 },
        { band: 6, gain: -0.6 },
        { band: 7, gain: -0.7 },
        { band: 8, gain: -0.7 },
        { band: 9, gain: -0.5 },
        { band: 10, gain: -0.3 },
        { band: 11, gain: 0 }
      ]
    };

    await player.shoukaku.setFilters(data);

    const embed = new EmbedBuilder()
      .setDescription("<:sec_tick:1286524512489443409> | **Turned on**: `Muffled`")
      .setColor(client.color);

    await delay(5000);
    return message.reply({ embeds: [embed] });
  },
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
