const Restriction = require("../../models/RestrictionSchema.js");
const {
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "restrict",
  aliases: ["res"],
  description: "Restrict or Unrestrict Channels",
  category: "Moderation",
  cooldown: 5,
  premium: true,

  run: async (client, message, args) => {
    // Permission check
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply("<:Crossmark:1286524517417750613> | You do not have permission to use this command.");
    }

    const [type, ...rest] = args;

    // Ensure type is provided
    if (!type) {
      return message.reply("<:Crossmark:1286524517417750613> | Please provide a type (e.g., `text`, `voice`, `reset`).");
    }

    // Validate the type
    if (type === "reset") {
      // Reset all restrictions
      let restrictionData = await Restriction.findOne({ guildId: message.guild.id });
      if (!restrictionData) {
        restrictionData = new Restriction({ guildId: message.guild.id });
      }
      restrictionData.restrictedTextChannels = [];
      restrictionData.restrictedVoiceChannels = [];
      await restrictionData.save();
      return message.reply("<:sec_tick:1286524512489443409> | All channel restrictions have been reset.");
    }

    // Fetch the channel either by mention or ID
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(rest[0]);
    if (!channel) {
      return message.reply("<:Crossmark:1286524517417750613> | Please mention a valid channel or provide a valid channel ID.");
    }

    // Find or create the restriction document for this guild
    let restrictionData = await Restriction.findOne({ guildId: message.guild.id });
    if (!restrictionData) {
      restrictionData = new Restriction({ guildId: message.guild.id });
    }

    // Handle different types of restrictions
    if (type === "text") {
      // Restrict Text Channel
      if (restrictionData.restrictedTextChannels.includes(channel.id)) {
        return message.reply("<:Crossmark:1286524517417750613> | This text channel is already restricted.");
      }
      restrictionData.restrictedTextChannels.push(channel.id);
      await restrictionData.save();
      return message.reply(`<:sec_tick:1286524512489443409> | Text channel <#${channel.id}> has been restricted.`);
    } else if (type === "voice") {
      // Restrict Voice Channel
      if (restrictionData.restrictedVoiceChannels.includes(channel.id)) {
        return message.reply("<:Crossmark:1286524517417750613> | This voice channel is already restricted.");
      }
      restrictionData.restrictedVoiceChannels.push(channel.id);
      await restrictionData.save();
      return message.reply(`<:sec_tick:1286524512489443409> | Voice channel <#${channel.id}> has been restricted.`);
    } else {
      return message.reply("<:Crossmark:1286524517417750613> | Invalid type. Please use `text`, `voice`, or `reset`.");
    }
  },
};
