const Restriction = require("../../models/RestrictionSchema.js");
const {
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "unrestrict",
  aliases: ["unres"],
  description: "Unrestrict Channels",
  category: "Moderation",
  cooldown: 5,
  premium: true,

  run: async (client, message, args) => {
    // Permission check
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply("You do not have permission to use this command.");
    }

    const [type] = args;

    // Ensure type is provided
    if (!type) {
      return message.reply("Please provide a type (e.g., `text` or `voice`).");
    }

    // Fetch the channel either by mention or ID
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
    if (!channel) {
      return message.reply("Please mention a valid channel or provide a valid channel ID.");
    }

    // Find the restriction document for this guild
    let restrictionData = await Restriction.findOne({ guildId: message.guild.id });
    if (!restrictionData) {
      return message.reply("No restrictions found for this server.");
    }

    // Handle unrestricting for text channels
    if (type === "text") {
      restrictionData.restrictedTextChannels = restrictionData.restrictedTextChannels.filter(
        (id) => id !== channel.id
      );
      await restrictionData.save();
      return message.reply(`Text channel <#${channel.id}> has been unrestricted.`);
    } 
    // Handle unrestricting for voice channels
    else if (type === "voice") {
      restrictionData.restrictedVoiceChannels = restrictionData.restrictedVoiceChannels.filter(
        (id) => id !== channel.id
      );
      await restrictionData.save();
      return message.reply(`Voice channel <#${channel.id}> has been unrestricted.`);
    } else {
      return message.reply("Invalid type. Please use `text` or `voice`.");
    }
  },
};
