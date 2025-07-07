const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');

module.exports = {
  name: 'punch',
  description: 'Punch someone!',
  cooldown: 5,
  run: async (client, message, args) => {
    const sender = message.author;
    const targetUser = message.mentions.users.first();
    const punchGif = await anime.punch();

    const embed = new EmbedBuilder()
      .setColor('#ff3300')
      .setDescription(`${sender} punches ${targetUser || 'the air'}! 👊`)
      .setImage(punchGif);

    message.reply({ embeds: [embed] });
  },
};
