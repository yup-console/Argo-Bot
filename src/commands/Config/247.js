const {
  Message,
  PermissionFlagsBits,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const reconnectAuto = require("../../models/reconnect.js");

module.exports = {
  name: "24/7",
  aliases: ["247"],
  description: "24/7 in voice channel",
  userPermissions: PermissionFlagsBits.ManageGuild,
  botPermissions: PermissionFlagsBits.Speak,
  cooldowns: 5,
  category: "Config",
  inVc: true,
  sameVc: true,
  voteOnly: false,
  premium: false,
  run: async (client, message, args, prefix) => {
    if (
      !message.member.voice.channel
        .permissionsFor(message.guild.members.me)
        .has(PermissionsBitField.Flags.ViewChannel)
    )
      return message.reply(
        `${client.emoji.cross} | I don't have permission to view your voice channel!`
      );

    if (
      !message.member.voice.channel
        .permissionsFor(message.guild.members.me)
        .has(PermissionsBitField.Flags.Connect)
    )
      return message.reply(
        `${client.emoji.cross} | I don't have permission to join your voice channel!`
      );

    if (
      !message.member.voice.channel
        .permissionsFor(message.guild.members.me)
        .has(PermissionsBitField.Flags.Speak)
    )
      return message.reply(
        `${client.emoji.cross} | I don't have permission to speak in your voice channel!`
      );

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild))
      return message.channel.send(`You don't have enough Permissions !!`);
    try {
      const data = await reconnectAuto.findOne({ GuildId: message.guild.id });
      if (data) {
        await reconnectAuto.findOneAndDelete({ GuildId: message.guild.id });
        const embed = new EmbedBuilder()
          .setDescription(
            `**${client.emoji.disable} | 24/7 Mode Has Been Disabled In ${message.guild.name}**`
          )
          .setColor(client.color);
        return message.channel.send({ embeds: [embed] });
      }
      await reconnectAuto.create({
        GuildId: message.guild.id,
        TextId: message.channel.id,
        VoiceId: message.member.voice.channel.id,
      });
      await client.manager.createPlayer({
        guildId: message.guild.id,
        textId: message.channel.id,
        voiceId: message.member.voice.channel.id,
        volume: 100,
        deaf: true,
        shardId: message.guild.shardId,
      });
      const embed = new EmbedBuilder()
        .setDescription(
          `**${client.emoji.enable} | 24/7 Mode Has Been Enabled In ${message.guild.name}**`
        )
        .setColor(client.color);

      message.channel.send({ embeds: [embed] });
    } catch (e) {
      console.log(e);
      message.channel.send(`**An Error Occurred**`);
    }
  },
};
