const { Message, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "nightcore",
  aliases: ["nc"],
  description: `Set a filter for current song.`,
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Filters",
  cooldown: 5,
  inVc: true,
  sameVc: true,
  voteOnly: false,
  premium: false,
  dj: true,
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
        speed: 1.5, // Increase the speed for a faster tempo
        pitch: 1.5, // Increase the pitch for a higher tone
        rate: 1.0, // Rate can remain the same or be adjusted as needed
      },
    };

    await player.shoukaku.setFilters(data);

    const nightcored = new EmbedBuilder()
      .setDescription(`<:sec_tick:1286524512489443409> | **Turned on**: \`Nightcore\``)
      .setColor(client.color);

    await delay(5000);
    message.reply({ embeds: [nightcored] });
  },
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
