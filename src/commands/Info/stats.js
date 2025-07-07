const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const moment = require('moment');
const os = require("os");

module.exports = {
    name: "bi",
    aliases: ["botinfo", "stats", "st", "status", "stat"],
    description: "Get Bot Real stats !!",
    category: "Info",
    cooldown: 5,

    run: async (client, message, args, prefix) => {
       // Fetching real-time stats
const botPing = client.ws.ping.toFixed(2);
const botChannels = client.channels.cache.size;

// Check if the bot is sharded
let botGuilds;
if (client.shard && client.shard.count > 1) {
    // If sharded, get the total guild count from all shards
    botGuilds = await client.shard.fetchClientValues('guilds.cache.size')
        .then(results => results.reduce((acc, count) => acc + count, 0));
} else {
    // If not sharded, use the current guild count
    botGuilds = client.guilds.cache.size;
}


        // Memory and CPU stats
        const ramUsage = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);
        const totalMemoryGB = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
        const freeMemoryGB = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
        const cpuModel = os.cpus()[0].model;
        const cpuSpeed = os.cpus()[0].speed + ' MHz';
        const platform = os.platform();
        const arch = os.arch();

        // Uptime calculation
        let uptime = process.uptime();
        let d = Math.floor(uptime / (3600 * 24));
        let h = Math.floor((uptime % (3600 * 24)) / 3600);
        let m = Math.floor((uptime % 3600) / 60);
        let s = Math.floor(uptime % 60);
        let dDisplay = d > 0 ? d + (d === 1 ? " day, " : " days, ") : "";
        let hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
        let mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
        let sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";

        const botCreatedOn = moment.utc(client.user.createdTimestamp).format("MMMM Do YYYY, h:mm:ss a");

        // Button generator
        const createButton = (label, style, customId, disabled = false) => {
            return new ButtonBuilder()
                .setLabel(label)
                .setStyle(style)
                .setCustomId(customId)
                .setDisabled(disabled);
        };

        // Creating action rows for buttons
        const button1 = new ActionRowBuilder()
            .addComponents(
                createButton("General", ButtonStyle.Success, "first", true),
                createButton("System", ButtonStyle.Secondary, "second"),
                createButton("Team", ButtonStyle.Secondary, "third")
            );

        const button2 = new ActionRowBuilder()
            .addComponents(
                createButton("General", ButtonStyle.Secondary, "first"),
                createButton("System", ButtonStyle.Success, "second", true),
                createButton("Team", ButtonStyle.Secondary, "third")
            );

        const button3 = new ActionRowBuilder()
            .addComponents(
                createButton("General", ButtonStyle.Secondary, "first"),
                createButton("System", ButtonStyle.Secondary, "second"),
                createButton("Team", ButtonStyle.Success, "third", true)
            );

        const button4 = new ActionRowBuilder()
            .addComponents(
                createButton("General", ButtonStyle.Danger, "first", true),
                createButton("System", ButtonStyle.Danger, "second", true),
                createButton("Team", ButtonStyle.Danger, "third", true)
            );

        // Embed generator
        const createEmbed = (fields, title) => {
            return new EmbedBuilder()
                .setColor("#FF0000")
                .setTitle(title || "Bot Information")
                .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .addFields(fields)
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();
        };

        // Creating embeds for each category
        const embed1 = createEmbed([ 
            { name: "__Bot Information__", value: `**Bot Tag**: ${client.user.tag}\n**Created On**: ${botCreatedOn}\n**Discord.js**: v14.x.x\n**Servers**: ${botGuilds.toLocaleString()} servers\n**Channels**: ${botChannels.toLocaleString()}\n**Uptime**: ${dDisplay + hDisplay + mDisplay + sDisplay}\n**WS Ping**: ${botPing}ms` },
        ], "General Bot Information");

        const embed2 = createEmbed([ 
            { name: "__System Information__", value: `**Platform**: ${platform}\n**Architecture**: ${arch}\n**CPU Model**: ${cpuModel}\n**CPU Speed**: ${cpuSpeed}\n**RAM Usage**: ${ramUsage} MB / ${totalMemoryGB}\n**Free Memory**: ${freeMemoryGB}` },
        ], "System Information");

        const embed3 = createEmbed([ 
            { name: "**__Developers__**", value: `**1.** [NotGamerDev.](https://discord.com/users/762146129927340052) [ID: 762146129927340052]` },
            { name: "**__Owners__**", value: `**1.** [rajan_.sumant](https://discord.com/users/1203569730385084476) [ID: 1203569730385084476]\n**2.** [Vansh.xly](https://discord.com/users/1033232690222223380) [ID: 1033232690222223380]` },
        ], "Team Information");

        // Sending the initial embed with buttons
        const messageComponent = await message.channel.send({ embeds: [embed1], components: [button1] });

        // Collector for button interactions
        const collector = messageComponent.createMessageComponentCollector({
            filter: (interaction) => {
                if (message.author.id === interaction.user.id) return true;
                interaction.reply({ content: `❌ | This interaction is not for you.`, ephemeral: true });
                return false;
            },
            time: 600000,
            idle: 300000,
        });

        collector.on("collect", async (interaction) => {
            if (interaction.isButton()) {
                switch (interaction.customId) {
                    case "first":
                        await interaction.update({ embeds: [embed1], components: [button1] });
                        break;
                    case "second":
                        await interaction.update({ embeds: [embed2], components: [button2] });
                        break;
                    case "third":
                        await interaction.update({ embeds: [embed3], components: [button3] });
                        break;
                }
            }
        });

        collector.on("end", () => {
            messageComponent.edit({ components: [button4] });
        });
    }
};
