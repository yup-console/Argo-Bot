const {
  PermissionFlagsBits,
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} = require("discord.js");
const SetupPlayer = require("../../models/SetupPlayerSchema.js");

module.exports = {
  name: "setup player",
  aliases: ["setupplayer", "musicsetup"],
  description: "Setup music player panel for your server",
  userPermissions: PermissionFlagsBits.ManageGuild,
  cooldown: 5,
  premium: false,
  category: "Config",
  run: async (client, message, args, prefix) => {
    const modes = [
      { name: "Argo Classic", value: "classic" },
      { name: "Argo Spotify", value: "spotify" },
      { name: "Argo Simple", value: "simple" },
      { name: "Argo Special", value: "special" },
      { name: "Argo No Buttons", value: "nobuttons" },
      { name: "Argo Old School", value: "oldschool" },
      { name: "Argo Musicard", value: "musicard" },
    ];

    const modeSelectMenu = new StringSelectMenuBuilder()
      .setCustomId("selectMode")
      .setPlaceholder("Select a player mode")
      .addOptions(
        modes.map((mode) => ({
          label: mode.name,
          description: `Set player to ${mode.name}`,
          value: mode.value,
        }))
      );

    const embed = new EmbedBuilder()
      .setTitle("Argo Player Mode Setup ")
      .setColor(client.color)
      .setDescription("**<:arrow:1279039302566805534> Select Any of Player Mode to Customize Your Player Mode According to Your Needs!**")
      .addFields(
        {
          name: `1. Argo Classic`,
          value: `<:arrow:1279039302566805534> Default/Classic Mode Consist of Label Buttons with No Filters`,
        },
        {
          name: `2. Argo Spotify`,
          value: `<:arrow:1279039302566805534> Spotify User Interface Mode`,
        },
        {
          name: `3. Argo Simple`,
          value: `<:arrow:1279039302566805534> Simple Mode consist of Label buttons with Filters`,
        },
        {
          name: `4. Argo Special`,
          value: `<:arrow:1279039302566805534> Special Mode with 2 Rows Buttons System With Special Emojis & Filters`,
        },
        {
          name: `5. Argo No Buttons`,
          value: `<:arrow:1279039302566805534> No Buttons Mode for Direct Play`,
        },
        {
          name: `6. Argo Old School`,
          value: `<:arrow:1279039302566805534> Old Mode with Label and Emojis`,
        },
        {
          name: `7. Argo Musicard`,
          value: `<:arrow:1279039302566805534> Musicard Mode`,
        },
      )

    const initialMessage = await message.reply({
      content: "Please select a player mode for your server:",
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(modeSelectMenu)],
    });

    const filter = (interaction) => interaction.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({
      filter,
      time: 15000,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.customId === "selectMode") {
        const selectedMode = interaction.values[0];

        await SetupPlayer.findOneAndUpdate(
          { guildId: message.guildId },
          { $set: { playerMode: selectedMode } },
          { upsert: true }
        );

        await interaction.update({
          content: `Player mode set to ${modes.find((mode) => mode.value === selectedMode).name}`,
          components: [],
        });
      }
    });

    collector.on('end', collected => {
        if (!collected.size) initialMessage.edit({ content: "No selection made, the setup timed out.", components: [] });
      });
    },
  };
  