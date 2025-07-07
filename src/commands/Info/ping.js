const { Message, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  aliases: ["ping"],
  description: "Get Bot Real Ping !!",
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Info",
  cooldown: 5,

  run: async (client, message, args, prefix) => {
    return message.reply({ content: `<a:latency:1279061307164721233> | I'm Experiencing Latency with \`${Math.floor(client.ws.ping)}ms\`!` });
  },
};
