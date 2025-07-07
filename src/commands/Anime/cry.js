const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');
module.exports = {
  name: 'cry',
  description: 'Send a crying gif in an embedded message!',
  cooldown: 5,
  run: async (client, message, args) => {
    const sender = message.author;
    const cryGif = await anime.cry();

    const embed = new EmbedBuilder()
      .setColor('#0000ff')
      .setDescription(`${sender} is crying...`)
      .setImage(cryGif);

    message.reply({ embeds: [embed] });
  },
};
