const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');

module.exports = {
  name: 'poke',
  description: 'Poke someone!',
  cooldown: 5,
  run: async (client, message, args) => {
    const sender = message.author;
    const targetUser = message.mentions.users.first();
    const pokeGif = await anime.poke();

    const embed = new EmbedBuilder()
      .setColor('#ffcc66')
      .setDescription(`${sender} pokes ${targetUser || 'themselves'} 👈`)
      .setImage(pokeGif);

    message.reply({ embeds: [embed] });
  },
};
