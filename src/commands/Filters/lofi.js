const { Message, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "lofi",
  aliases: ["lo-fi"],
  description: `Set a smooth, cozy lo-fi filter for current song.`,
  category: "Filters",
  cooldown: 5,
  inVc: true,
  sameVc: true,
  premium: true,
  ownerOnly: false,
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
        { band: 0, gain: -0.1 },   // Lower bass
        { band: 1, gain: -0.1 },
        { band: 2, gain: -0.15 },
        { band: 3, gain: -0.2 },
        { band: 4, gain: -0.3 },   // Mid-range smoothness
        { band: 5, gain: -0.35 },
        { band: 6, gain: -0.4 },
        { band: 7, gain: -0.5 },   // Subtly reduce higher frequencies
        { band: 8, gain: -0.6 },
        { band: 9, gain: -0.7 },    
        { band: 10, gain: -0.8 },    
        { band: 11, gain: -0.9 },
        { band: 12, gain: -1.0 },   
        { band: 13, gain: -1.1 },   
        { band: 14, gain: -1.2 }    // Reduce high-end harshness
      ],
      timescale: {   // Slow down slightly to get a lo-fi feel
        speed: 0.95,
        pitch: 0.9,
        rate: 0.95
      }
    };

    await player.shoukaku.setFilters(data);

    const embed = new EmbedBuilder()
      .setDescription("<:enable:1249257409537376340> | **Turned on**: `Lofi`")
      .setColor(client.color);

    await delay(5000);  // Delay to allow filter application
    return message.reply({ embeds: [embed] });
  },
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
