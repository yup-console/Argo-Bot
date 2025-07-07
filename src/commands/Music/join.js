const {
  Message,
  PermissionFlagsBits,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  name: "join",
  aliases: ["j"],
  description: `Join the bot to your voice channel.`,
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.Speak,
  category: "Music",
  cooldown: 5,
  inVc: true,
  sameVc: true,
  premium: false,
  dj: true,
  run: async (client, message, args, prefix, player) => {
    if (
      !message.member.voice.channel
        .permissionsFor(message.guild.members.me)
        .has(PermissionsBitField.Flags.ViewChannel)
    )
      return message.reply(
        `<:Crossmark:1286524517417750613> | I don't have permission to view your voice channel!`
      );

    if (
      !message.member.voice.channel
        .permissionsFor(message.guild.members.me)
        .has(PermissionsBitField.Flags.Connect)
    )
      return message.reply(
        `<:Crossmark:1286524517417750613> | I don't have permission to join your voice channel!`
      );

    if (
      !message.member.voice.channel
        .permissionsFor(message.guild.members.me)
        .has(PermissionsBitField.Flags.Speak)
    )
      return message.reply(
        `<:Crossmark:1286524517417750613> | I don't have permission to speak in your voice channel!`
      );

    await client.manager.createPlayer({
      guildId: message.guild.id,
      textId: message.channel.id,
      voiceId: message.member.voice.channel.id,
      volume: 100,
      deaf: true,
      shardId: message.guild.shardId,
    });
    return message.react("<:sec_tick:1286524512489443409>");
  },
};
