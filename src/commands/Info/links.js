const {
    Message,
    PermissionFlagsBits,
    EmbedBuilder,
    ButtonStyle,
    ButtonBuilder,
    ActionRowBuilder,
  } = require("discord.js");
  
  module.exports = {
    name: "links",
    aliases: ["link"],
    description: "Check Out My Links",
    // userPermissions: PermissionFlagsBits.SendMessages,
    // botPermissions: PermissionFlagsBits.SendMessages,
    category: "Info",
    cooldown: 5,
    //premium: true,
  
    run: async (client, message, args, prefix) => {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Argo")
          .setStyle(ButtonStyle.Link)
          .setEmoji("<:invite:1279039307985977354>")
          .setURL(
            `https://discord.com/oauth2/authorize?client_id=1131938711639183363`
          ),
        new ButtonBuilder()
          .setLabel("Argo Pro")
          .setStyle(ButtonStyle.Link)
          .setEmoji("<:invite:1279039307985977354>")
          .setURL(
            "https://discord.com/oauth2/authorize?client_id=939758802532716575&permissions=45768987437137&scope=bot%20applications.commands"
          ),
        new ButtonBuilder()
          .setLabel("Support Server")
          .setStyle(ButtonStyle.Link)
          .setEmoji("<:support:1279039313451159553>")
          .setURL(`${client.config.ssLink}`),
        
        new ButtonBuilder()
          .setLabel("Vote")
          .setStyle(ButtonStyle.Link)
          .setEmoji("<:vote:1279039296774602764>")
          .setURL(`https://top.gg/bot/1131938711639183363/vote`),

        new ButtonBuilder()
          .setLabel("Documents")
          .setStyle(ButtonStyle.Link)
          .setEmoji("<:docs:1279039299697774603>")
          .setURL(`https://docs.argomusic.xyz`),
      );
  
      message.reply({ components: [row] });
    },
  };
  