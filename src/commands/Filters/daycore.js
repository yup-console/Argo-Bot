const { Message, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "daycore",
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
        op: 'filters',
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
            { band: 8, gain: -0.25 },
            { band: 9, gain: -0.25 },
            { band: 10, gain: -0.25 },
            { band: 11, gain: -0.25 },
            { band: 12, gain: -0.25 },
            { band: 13, gain: -0.25 },
        ],
        timescale: {
            pitch: 0.63,
            rate: 1.05
        },
    }

    await player.shoukaku.setFilters(data);

    const daycored = new EmbedBuilder()
        .setDescription(`<:sec_tick:1286524512489443409> | **Turned on**: \`Daycore\``)
        .setColor(client.color);

    await delay(5000);
    message.reply({ embeds: [daycored] });
  },
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
