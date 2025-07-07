const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');
module.exports = {
  name: 'slap',
  description: 'Give someone a virtual slap!',
  cooldown: 5,
  run: async (client, message, args) => {
    const sender = message.author;
    const targetUser = message.mentions.users.first();
    const slapGif = await anime.slap();

    const embed = new EmbedBuilder()
      .setColor('#ff3300')
      .setDescription(`${sender} gives ${targetUser || 'the air'} a slap! 😠`)
      .setImage(slapGif);

    message.reply({ embeds: [embed] });
  },
};
