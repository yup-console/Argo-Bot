const { Message, PermissionFlagsBits, EmbedBuilder, PermissionsBitField } = require("discord.js");
const pSchema = require('../../models/PrefixSchema.js');

module.exports = {
  name: "prefix",
  aliases: ["set-prefix", "setprefix"],
  description: "Change Bot Prefix !!",
  userPermissions: PermissionFlagsBits.ManageGuild,
  botPermissions: PermissionFlagsBits.SendMessages,
  cooldowns: 5,
  category: "Config",
  premium: false,
  run: async (client, message, args, prefix) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.channel.send(`${client.emoji.cross} | You don't have enough Permissions !!`);
    const newPrefix = args[0];
    const data = await pSchema.findOne({ serverId: message.guild.id });
        if (!newPrefix) return message.channel.send({
            embeds: [new EmbedBuilder().setColor(client.color).setDescription(`${client.emoji.cross} | Please Provide a Prefix.`)], allowedMentions: { repliedUser: false }
        });
        if (newPrefix.length > 5) return message.channel.send({
            embeds: [new EmbedBuilder().setColor(client.color)
                .setDescription(`${client.emoji.cross} | This prefix is too long, you have max 5 caracters`)], allowedMentions: { repliedUser: false }
        });
        if (!data) {
            let newprefix = new pSchema({ serverId: message.guild.id, prefix: newPrefix });
            newprefix.save();
        }
        if (data) {
            await data.updateOne({ prefix: newPrefix });
        }
        message.reply({ embeds: [new EmbedBuilder().setColor(client.color).setDescription(`${client.emoji.tick} | Set prefix to: \`${newPrefix}\``)], allowedMentions: { repliedUser: false } }).catch((err) => { console.log(err.msg); });
    
}
};

