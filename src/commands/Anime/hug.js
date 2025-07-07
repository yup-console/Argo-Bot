const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');
module.exports = {
  name: 'hug',
  description: 'Send a hug gif in an embedded message!',
  cooldown: 5,
  run: async (client, message, args) => {
    
    const sender = message.author;

    
    const targetUser = message.mentions.users.first() || sender;

   
    const hugGif = await anime.hug();

 
    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setDescription(`${sender} sends a hug to ${targetUser}!`)
      .setImage(hugGif);

    
    message.reply({ embeds: [embed] });
  },
};
