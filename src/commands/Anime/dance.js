const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');

module.exports = {
  name: 'adance',
  description: 'Dance with someone!',
  cooldown: 5,
  run: async (client, message, args) => {
    const sender = message.author;
    const targetUser = message.mentions.users.first();
    const danceGif = await anime.dance();

    const embed = new EmbedBuilder()
      .setColor('#ffcc33')
      .setDescription(`${sender} dances with ${targetUser || 'themselves'} 💃🕺`)
      .setImage(danceGif);

    message.reply({ embeds: [embed] });
  },
};
