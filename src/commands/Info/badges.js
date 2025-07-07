const Badge = require("../../models/BadgeSchema"); // Adjust path as needed
const { EmbedBuilder } = require('discord.js');

const badgeEmojiMap = {
    "Owner": "<:owner:1289408255226810378>",
    "Developer": "<:dev:1289408268950704138>",
    "Co-Developer": "<:codev:1289408264295026760>",
    "Admim": "<:admin:1289408284410904637>",
    "Supporter": "<:supports:1289408293034262602>",
    "Mod": "<:mod:1289408297341812766>",
    "Staff": "<:staff:1289408335149531188>",
    "Team": "<:supportteam:1289408288928174222>",
    "Vip": "<:vip:1289408301481725982>",
    "Friend": "<:friends:1289408319777280012>",
    "Bughunter": "<:bug:1289408328447037521>",
    "Manager": "<:communitymanager:1289408279012970576>",
    "Special": "<:special:1289408309576728606>",
    "Premuser": "<:premiumuser:1289408324651057153>",
    "User": "<:users:1289408314576470098>"
};

module.exports = {
    name: "profile",
    alises: ["pr","badges","badge"],
    description: "View user badges",
    category: "Badges",
    ownerOnly: false, // Everyone can view their own badges
    run: async (client, message, args) => {
        const member = message.mentions.users.first() || message.author;

        const userBadges = await Badge.findOne({ userId: member.id });

        const embed = new EmbedBuilder()
            .setTitle(`<a:badge:1289419235709423708> **${member.tag}'s Badges** <a:badge:1289419235709423708>`)
            .setColor(client.color)
            .setThumbnail(member.displayAvatarURL({ dynamic: true }));

        if (!userBadges || userBadges.badges.length === 0) {
            embed.setDescription("<:Crossmark:1286524517417750613> | This user has no badges. Consider By Joining our [Support Server](https://discord.gg/PGE6mxURus) To get Some of The Badges");
        } else {
            const formattedBadges = userBadges.badges.map(badge => {
                const badgeName = badge.replace(/.*・/, ''); // Extract the badge name from the stored string
                return `${badgeEmojiMap[badgeName]}・${badgeName}`;
            });
            embed.setDescription(formattedBadges.join("\n"));
        }

        return message.channel.send({ embeds: [embed] });
    }
};
