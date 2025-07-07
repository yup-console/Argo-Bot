const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "npreq",
    aliases: ["noprefixrequirements","nopreq"],
    description: "Advertise premium features of the bot",
    category: "Premium",
    ownerOnly: false, // Anyone can run this command to learn about premium
    run: async (client, message, args, prefix) => {
        try {
            const embed = new EmbedBuilder()
                .setTitle("Unlock NoPrefix Now")
                .setColor(client.color)
                .setDescription("Access to All Commands Without Prefix")
                .addFields(
                    { name: "1. Boost Support Server", value: "- You can get NoPrefix by Boosting our [Support Server!](https://discord.gg/PGE6mxURus)" },
                    { name: "2. Add Argo in more than 5 Guilds", value: "- Add Argo in more than 5 Guilds with More than 1000+ Members in each server" },
                    { name: "3. Buying NoPrefix", value: "- You can buy NoPrefix at Only 50rs. for Argo" }
                )
                .setFooter({ text: "These NoPrefix Requirements Can be changed according to our needs!" })
                .setTimestamp();

            return message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return message.channel.send("An error occurred while showing premium features.");
        }
    }
};