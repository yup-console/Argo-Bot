const { EmbedBuilder, Client, Message } = require("discord.js");
const schema = require("../../models/PremiumGuildSchema.js");
const day = require('dayjs');

module.exports = {
    name: "premiumadd",
    aliases: ["addprem"],
    description: "Generate a premium code (Owner Only)",
    category: "Owner",
    ownerOnly: true,
    run: async (client, message, args, prefix) => {
        // Only allow the specific owner ID
        if (message.author.id !== "762146129927340052") return;

        // Check if the guild ID is provided
        if (!args[0]) return message.reply("Please specify a guild ID!");

        // Validate if the guild ID exists in the bot's cache
        if (!client.guilds.cache.has(args[0]))
            return message.reply("Invalid guild ID!");

        try {
            // Find and remove any existing record for the guild
            let data = await schema.findOne({ Guild: args[0] });
            if (data) await data.delete();

            // If an expiration date is provided
            if (args[1]) {
                const Expire = day(args[1]).valueOf(); // Parse the expiration date
                await new schema({
                    Guild: args[0],
                    Expire,
                    Permanent: false, // Set as not permanent
                }).save();
            } else {
                // If no expiration date is provided, set as permanent
                await new schema({
                    Guild: args[0],
                    Expire: 0, // No expiration
                    Permanent: true, // Set as permanent
                }).save();
            }

            // Confirmation message
            message.reply("Saved Successfully!");
        } catch (err) {
            console.error(err);
            message.reply("An error occurred while saving the data.");
        }
    },
};
