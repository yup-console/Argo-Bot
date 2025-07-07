const { Message, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "reset",
  description: `Reset filters.`,
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Filters",
  cooldown: 5,
  inVc: true,
  sameVc: true,
  voteOnly: false,
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
    };

    await player.shoukaku.setFilters(data);
    await player.setVolume(100);

    const resetted = new EmbedBuilder()
      .setDescription(`<:sec_tick:1286524512489443409> | Successfully \`Reseted\` the Filters`)
      .setColor(client.color);

    await delay(5000);
    message.reply({ embeds: [resetted] });
  },
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
