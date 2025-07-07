const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  } = require("discord.js");
  
  module.exports = {
    name: "avatar",
    aliases: ["av", "pfp"],
    description: "Get the avatar of a user.",
    category: "Info",
    cooldown: 5,
    run: async (client, message, args, prefix) => {
      const user = message.mentions.users.first() || message.author;
      
      const avatarURL = user.displayAvatarURL({ dynamic: true, size: 1024 });
  
      const embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setTitle(`${user.username}'s Avatar`)
        .setImage(avatarURL)
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
  
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Avatar URL")
          .setStyle(ButtonStyle.Link)
          .setURL(avatarURL)
      );
  
      message.reply({ embeds: [embed], components: [row] });
    },
  };
  