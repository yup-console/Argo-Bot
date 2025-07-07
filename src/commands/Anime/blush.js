const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');
module.exports = {
  name: 'blush',
  description: 'Blush in embarrassment!',
  cooldown: 5,
  run: async (client, message, args) => {
    const sender = message.author;
    const blushGif = await anime.blush();

    const embed = new EmbedBuilder()
      .setColor('#ff66b2')
      .setDescription(`${sender} is blushing... 💖`)
      .setImage(blushGif);

    message.reply({ embeds: [embed] });
  },
};
