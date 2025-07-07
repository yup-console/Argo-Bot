const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');
module.exports = {
  name: 'kill',
  description: 'Send a kill gif in an embedded message!',
  cooldown: 5,
  run: async (client, message, args) => {
    
    const sender = message.author;

    
    const targetUser = message.mentions.users.first() || sender;

   
    const killGif = await anime.kill();

 
    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setDescription(`${sender} 🔪 killed ${targetUser}!`)
      .setImage(killGif);

    
    message.reply({ embeds: [embed] });
  },
};
