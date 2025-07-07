const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const IgnoreChannelSchema = require("../../models/IgnoreChannelSchema.js");

module.exports = {
  name: "ignorechannel",
  aliases: ["ignorechan", "ignorech"],
  description: "Ignore or unignore a channel for bot commands",
  cooldowns: 5,
  category: "Config",
  userPermissions: [PermissionsBitField.Flags.ManageGuild],
  botPermissions: [PermissionsBitField.Flags.ManageGuild],
  run: async (client, message, args, prefix) => {
    if (!args[0]) {
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(
          `Please specify whether to \`add\` or \`remove\` a channel.`
        );
      return message.channel.send({ embeds: [embed] });
    }

    const action = args[0].toLowerCase();
    const channel = message.mentions.channels.first() || message.channel;

    if (action === "add") {
      const existingData = await IgnoreChannelSchema.findOne({
        guildId: message.guild.id,
        channelId: channel.id,
      });

      if (existingData) {
        const embed = new EmbedBuilder()
          .setColor(client.color)
          .setDescription(
            `This channel is already ignored for bot commands.`
          );
        return message.channel.send({ embeds: [embed] });
      }

      await IgnoreChannelSchema.create({
        guildId: message.guild.id,
        channelId: channel.id,
      });

      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(
          `Channel <#${channel.id}> is now ignored for bot commands.`
        );
      return message.channel.send({ embeds: [embed] });
    }

    if (action === "remove") {
      const existingData = await IgnoreChannelSchema.findOne({
        guildId: message.guild.id,
        channelId: channel.id,
      });

      if (!existingData) {
        const embed = new EmbedBuilder()
          .setColor(client.color)
          .setDescription(`This channel is not ignored for bot commands.`);
        return message.channel.send({ embeds: [embed] });
      }

      await IgnoreChannelSchema.findOneAndDelete({
        guildId: message.guild.id,
        channelId: channel.id,
      });

      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(
          `Channel <#${channel.id}> is no longer ignored for bot commands.`
        );
      return message.channel.send({ embeds: [embed] });
    }

    if (action === "list") {
      const ignoredChannels = await IgnoreChannelSchema.find({
        guildId: message.guild.id,
      });

      if (!ignoredChannels.length) {
        const embed = new EmbedBuilder()
          .setColor(client.color)
          .setDescription(`There are no ignored channels in this server.`);
        return message.channel.send({ embeds: [embed] });
      }

      const channelsList = ignoredChannels
        .map((ch, index) => `${index + 1}. <#${ch.channelId}>`)
        .join("\n");

      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setTitle(`Ignored Channels`)
        .setDescription(channelsList);

      return message.channel.send({ embeds: [embed] });
    }

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`Invalid action. Use \`add\`, \`remove\`, or \`list\`.`);
    return message.channel.send({ embeds: [embed] });
  },
};
