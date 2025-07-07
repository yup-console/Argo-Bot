const {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
} = require("discord.js");

const db = require("../models/SetupSchema");

module.exports = async (client) => {
  client.on("interactionCreate", async (interaction) => {
    let player = client.manager.players.get(interaction.guildId);

    if (interaction.isButton()) {
      if (interaction.customId === "setup_pause") {
        if (await check(interaction, player)) {
          let state = player.paused ? "Resumed" : "Paused";

          const filterRow = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId("filterSelect")
              .setPlaceholder("Select a filter")
              .addOptions(
                {
                  label: "Bass Boost",
                  description: "Apply a bass boost filter",
                  value: "bassboost",
                  emoji: "<:filtersss:1279054729543946260>",
                },
                {
                  label: "Nightcore",
                  description: "Apply a nightcore filter",
                  value: "nightcore",
                  emoji: "<:filtersss:1279054729543946260>",
                },
                {
                  label: "Vaporwave",
                  description: "Apply a vaporwave filter",
                  value: "vaporwave",
                  emoji: "<:filtersss:1279054729543946260>",
                },
                {
                  label: "Tremolo",
                  description: "Apply a tremolo filter",
                  value: "tremolo",
                  emoji: "<:filtersss:1279054729543946260>",
                },
                {
                  label: "Vibrato",
                  description: "Apply a vibrato filter",
                  value: "vibrato",
                  emoji: "<:filtersss:1279054729543946260>",
                },
                {
                  label: "Karaoke",
                  description: "Apply a karaoke filter",
                  value: "karaoke",
                  emoji: "<:filtersss:1279054729543946260>",
                },
                {
                  label: "Distortion",
                  description: "Apply a distortion filter",
                  value: "distortion",
                  emoji: "<:filtersss:1279054729543946260>",
                },
                {
                  label: "None",
                  description: "Remove all filters",
                  value: "none",
                  emoji: "<:replay:1278699930529042453>",
                }
              )
          );

          const row = new ActionRowBuilder()
            .addComponents(
            new ButtonBuilder()
            .setCustomId("setup_vol+")
            .setLabel("Vol+")
            .setStyle(ButtonStyle.Success)
            )
            .addComponents(
            new ButtonBuilder()
              .setCustomId("setup_pause")
              .setLabel(!player.paused ? "Resume" : "Pause")
              .setStyle(ButtonStyle.Primary)
            )
            .addComponents(
            new ButtonBuilder()
              .setCustomId("setup_skip")
              .setLabel("Skip")
              .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
            new ButtonBuilder()
              .setCustomId("setup_vol-")
              .setLabel("Vol-")
              .setStyle(ButtonStyle.Danger)
            );

          const row2 = new ActionRowBuilder()
            .addComponents(
            new ButtonBuilder()
              .setCustomId("setup_shuffle")
              .setLabel("Shuffle")
              .setStyle(ButtonStyle.Success)
            )
            .addComponents(
            new ButtonBuilder()
              .setCustomId("setup_replay")
              .setLabel("Replay")
              .setStyle(ButtonStyle.Primary)
            )
            .addComponents(
            new ButtonBuilder()
              .setCustomId("setup_clear")
              .setLabel("Clear")
              .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
            new ButtonBuilder()
              .setCustomId("setup_stop")
              .setLabel("X")
              .setStyle(ButtonStyle.Danger)
            )

          await player.pause(!player.paused);
          await interaction.update({
            components: [filterRow, row, row2],
          });

          return await interaction.channel
            .send({
              content: `<:sec_tick:1286524512489443409> | Player is ${state} by ${interaction.user.username}`,
            })
            .then((msg) => {
              setTimeout(async () => {
                await msg.delete().catch(() => {});
              }, 5000);
            })
            .catch(() => {});
        }
      } else if (interaction.customId === "setup_replay") {
        if (await check(interaction, player)) {
          await player.seek(0);
          await interaction.deferUpdate();
          return await interaction.channel
            .send({
              content: `<:sec_tick:1286524512489443409> | Replaying the current track.`,
            })
            .then((msg) => {
              setTimeout(async () => {
                await msg.delete().catch(() => {});
              }, 5000);
            })
            .catch(() => {});
        }
      } else if (interaction.customId === "setup_skip") {
        if (await check(interaction, player)) {
          await player.skip();
          await interaction.deferUpdate();
          return await interaction.channel
            .send({
              content: `<:sec_tick:1286524512489443409> | Skipped the track. Action by: ${interaction.user.username}`,
            })
            .then((msg) => {
              setTimeout(async () => {
                await msg.delete().catch(() => {});
              }, 5000);
            })
            .catch(() => {});
        }
      } else if (interaction.customId === "setup_shuffle") {
        if (await check(interaction, player)) {
          await interaction.deferUpdate();

          await player.queue.shuffle();

          return await interaction.channel
            .send({
              content: `<:sec_tick:1286524512489443409> | Player has been shuffled by: ${interaction.user.username}`,
            })
            .then(async (msg) => {
              setTimeout(async () => {
                await msg.delete().catch(() => {});
              }, 5000);
            })
            .catch(() => {});
        }
      } else if (interaction.customId === "setup_stop") {
        if (await check(interaction, player)) {
          await interaction.deferUpdate();

          player.setLoop("none");
          player.data.set("autoplay", false);
          player.queue.clear();
          player.skip();

          return await interaction.channel
            .send({
              content: `<:sec_tick:1286524512489443409> | Player has been stopped by: ${interaction.user.username}`,
            })
            .then((msg) => {
              setTimeout(async () => {
                await msg.delete().catch(() => {});
              }, 5000);
            });
        }
      } else if (interaction.customId === "setup_clear") {
        if (await check(interaction, player)) {
          await interaction.deferUpdate();

          player.queue.clear();

          return await interaction.channel
            .send({
              content: `<:sec_tick:1286524512489443409> | Queue has been cleared by: ${interaction.user.username}`,
            })
            .then((msg) => {
              setTimeout(async () => {
                await msg.delete().catch(() => {});
              }, 5000);
            });
        }
      } else if (interaction.customId === "setup_vol+") {
        if (await check(interaction, player)) {
          await interaction.deferUpdate();

          let vol = player.options.volume;
          player.setVolume(vol + 5);

          return await interaction.channel
            .send({
              content: `<:sec_tick:1286524512489443409> | Volume has been changed by: ${interaction.user.username}`,
            })
            .then((msg) => {
              setTimeout(async () => {
                await msg.delete().catch(() => {});
              }, 5000);
            });
        }
      } else if (interaction.customId === "setup_vol-") {
        if (await check(interaction, player)) {
          await interaction.deferUpdate();

          let vol = player.options.volume;
          player.setVolume(vol - 5);

          return await interaction.channel
            .send({
              content: `<:sec_tick:1286524512489443409> | Volume has been changed by: ${interaction.user.username}`,
            })
            .then((msg) => {
              setTimeout(async () => {
                await msg.delete().catch(() => {});
              }, 5000);
            });
        }
      }
    } else if (interaction.isStringSelectMenu()) {
      if (interaction.customId === "filterSelect") {
        if (await check(interaction, player)) {
          await interaction.deferUpdate();
          const selectedFilter = interaction.values[0];
          await applyFilter(player, selectedFilter);

          const embed = new EmbedBuilder()
            .setDescription(`<:sec_tick:1286524512489443409> | **Filter applied:** \`${selectedFilter}\``)
            .setColor(client.color);

          interaction.channel
            .send({ embeds: [embed], ephemeral: true })
            .then((msg) => {
              setTimeout(async () => {
                await msg.delete().catch(() => {});
              }, 5000);
            });
        }
      }
    }
    async function check(interaction, player) {
      if (interaction.isButton() || interaction.isStringSelectMenu()) {
        if (!interaction.member.voice.channel) {
          await interaction.reply({
            content: `<:Crossmark:1286524517417750613> | You must be sitting in a voice channel.`,
            ephemeral: true,
          });
          return false;
        }

        if (
          interaction.guild.members.me.voice.channel &&
          interaction.member.voice.channel.id !==
            interaction.guild.members.me.voice.channel.id
        ) {
          await interaction.reply({
            content: `<:Crossmark:1286524517417750613> | You must be in the same voice channel.`,
            ephemeral: true,
          });
          return false;
        }

        if (!player) {
          await interaction.reply({
            content: `<:Crossmark:1286524517417750613> | Player doesn't exist currently.`,
            ephemeral: true,
          });
          return false;
        }
      }
      return true;
    }
  });
};

async function applyFilter(player, filter) {
  switch (filter) {
    case "bassboost":
      await player.shoukaku.setFilters({
        equalizer: [
          { band: 0, gain: 0.25 },
          { band: 1, gain: 0.25 },
          { band: 2, gain: 0.25 },
          { band: 3, gain: 0.25 },
          { band: 4, gain: 0.25 },
          { band: 5, gain: 0.25 },
          { band: 6, gain: 0.25 },
          { band: 7, gain: 0.25 },
          { band: 8, gain: 0.25 },
          { band: 9, gain: 0.25 },
        ],
      });
      break;
    case "nightcore":
      await player.shoukaku.setFilters({
        timescale: { pitch: 1.25, rate: 1.25 },
      });
      break;
    case "vaporwave":
      await player.shoukaku.setFilters({
        timescale: { pitch: 0.85, rate: 0.85 },
      });
      break;
    case "tremolo":
      await player.shoukaku.setFilters({
        tremolo: { frequency: 2.0, depth: 0.5 },
      });
      break;
    case "vibrato":
      await player.shoukaku.setFilters({
        vibrato: { frequency: 2.0, depth: 0.5 },
      });
      break;
    case "karaoke":
      await player.shoukaku.setFilters({
        karaoke: {
          level: 1.0,
          monoLevel: 1.0,
          filterBand: 220.0,
          filterWidth: 100.0,
        },
      });
      break;
    case "distortion":
      await player.shoukaku.setFilters({
        distortion: {
          sinOffset: 0.5,
          sinScale: 0.5,
          cosOffset: 0.5,
          cosScale: 0.5,
          tanOffset: 0.5,
          tanScale: 0.5,
          offset: 0.5,
          scale: 0.5,
        },
      });
      break;
    case "none":
      await player.shoukaku.setFilters({});
      break;
  }
}
