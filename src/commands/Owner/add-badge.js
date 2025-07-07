const Badge = require("../../models/BadgeSchema"); // Adjust path as needed

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
    name: "add-badge",
    description: "Add a badge to a user",
    category: "Badges",
    ownerOnly: true, // Only authorized users can use this command
    run: async (client, message, args) => {
        const member = message.mentions.users.first();
        const badge = args[1];

        if (!member || !badge) {
            return message.channel.send(`${client.emoji.cross} | Please mention a user and specify a badge.`);
        }

        const badgeList = Object.keys(badgeEmojiMap);

        if (!badgeList.includes(badge)) {
            return message.channel.send(`Invalid badge. Available badges: ${badgeList.join(", ")}`);
        }

        let userBadges = await Badge.findOne({ userId: member.id });

        const emojiBadge = `${badgeEmojiMap[badge]}・${badge}`;

        if (!userBadges) {
            userBadges = new Badge({ userId: member.id, badges: [emojiBadge] });
        } else if (userBadges.badges.includes(emojiBadge)) {
            return message.channel.send(`${client.emoji.cross} | User already has this badge.`);
        } else {
            userBadges.badges.push(emojiBadge);
        }

        await userBadges.save();
        return message.channel.send(`${client.emoji.tick} | Badge **${emojiBadge}** has been added to **${member.tag}**.`);
    }
};
