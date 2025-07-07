const PremiumGuild = require("../../models/PremiumGuildSchema"); // Adjust the path as necessary
const { EmbedBuilder } = require('discord.js');
const ms = require('ms'); // To handle time conversions if needed

module.exports = {
    name: "premiumstatus",
    aliases: ["premstats"],
    description: "Check Premium Status of Server",
    category: "Premium",
    ownerOnly: false,
    run: async (client, message, args, prefix) => {
        try {
            const guildId = message.guild.id;
            const premiumGuild = await PremiumGuild.findOne({ Guild: guildId });

            const embed = new EmbedBuilder().setTitle("Premium Status");

            if (!premiumGuild) {
                // If no premium data is found for the guild
                embed.setColor("Red")
                    .setDescription("This server does not have premium. Please upgrade to premium to unlock premium features.");
            } else {
                // Check if it's permanent or expired
                if (premiumGuild.Permanent) {
                    embed.setColor("Green")
                        .setDescription("This server has **permanent** premium access.");
                } else {
                    const remainingTime = premiumGuild.Expire - Date.now();
                    if (remainingTime > 0) {
                        embed.setColor("Green")
                            .setDescription(`This server has premium access for **${ms(remainingTime, { long: true })}**.`);
                    } else {
                        embed.setColor("Red")
                            .setDescription("This server's premium access has expired. Please renew or upgrade to premium.");
                    }
                }
            }

            return message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return message.channel.send("An error occurred while checking the premium status.");
        }
    }
};
