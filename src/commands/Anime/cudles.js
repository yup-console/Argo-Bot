const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');

module.exports = {
  name: 'cuddle',
  description: 'Cuddle with someone!',
  cooldown: 5,
  run: async (client, message, args) => {
    const sender = message.author;
    const targetUser = message.mentions.users.first();
    const cuddleGif = await anime.cuddle();

    const embed = new EmbedBuilder()
      .setColor('#ff99cc')
      .setDescription(`${sender} cuddles ${targetUser || 'themselves'} 🥰`)
      .setImage(cuddleGif);

    message.reply({ embeds: [embed] });
  },
};
