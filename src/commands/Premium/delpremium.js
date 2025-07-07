const { EmbedBuilder, Client, Message } = require("discord.js");
const schema = require("../../models/PremiumGuildSchema");

module.exports = {
    name: "remprem",
    aliases: ["deletepremium","premiumremove"],
    description: "Delete Premium",
    category: "premium",
    ownerOnly: true,
    run: async (client, message, args, prefix) => {
        // Check if the command is executed by the bot owner
        if (message.author.id !== "762146129927340052") return;

        // Check if the guild ID is provided
        if (!args[0]) return message.reply("Please specify a guild ID!");

        try {
            // Find the guild data in the database
            const data = await schema.findOne({ Guild: args[0] });

            // If no data is found, return a message
            if (!data) {
                return message.reply("The ID you provided is not present in the database.");
            }

            // Delete the guild data from the database using remove or deleteOne
            await schema.deleteOne({ Guild: args[0] });

            return message.reply("Successfully deleted data!");
        } catch (err) {
            console.error(err);
            return message.reply("An error occurred while trying to delete the data.");
        }
    },
};
