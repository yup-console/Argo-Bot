const { Message, PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "partner",
  aliases: ["sponser"],
  description: "Get Bot Sponsers !!",
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Info",
  cooldown: 5,

  run: async (client, message, args, prefix) => {
    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setTitle(`Argo - Sponser`)
      .setDescription(`**Currently, We Don't Have Paid Sponsers Now, If you want to Sponser Argo Then, Join Support Server**`);

    const button = new ButtonBuilder()
      .setLabel(`Support Server`)
      .setStyle(ButtonStyle.Link)
      .setEmoji("<:support:1279039313451159553>")
      .setURL(`https://discord.gg/PGE6mxURus`);

    const row = new ActionRowBuilder().addComponents(button);

    return message.reply({
      embeds: [embed],
      components: [row]
    });
  },
};
