const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  } = require("discord.js");

  module.exports = {
    name: "sccount",
    aliases: ["uc", "scserver"],
    description: "Kuchh nahi hai",
    category: "Owner",
    cooldown: 5,
    ownerOnly: true,
    run: async (client, message, args, prefix) => {
        const botGuilds = client.guilds.cache.size;
        const usersCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0).toLocaleString();

        const embed = new EmbedBuilder()
        .setTitle("HAHA")
        .setDescription(`**Servers**: ${botGuilds.toLocaleString()} servers\n**Users**: ${usersCount}`)

        return message.channel.send({ embeds: [embed] });

    }
}



      