const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');

module.exports = {
  name: 'pat',
  description: 'Pat someone on the head!',
  cooldown: 5,
  run: async (client, message, args) => {
    const sender = message.author;
    const targetUser = message.mentions.users.first();
    const patGif = await anime.pat();

    const embed = new EmbedBuilder()
      .setColor('#ffcc99')
      .setDescription(`${sender} pats ${targetUser || 'themselves'} on the head! 🖐️`)
      .setImage(patGif);

    message.reply({ embeds: [embed] });
  },
};
