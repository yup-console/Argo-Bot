const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  AttachmentBuilder,
} = require("discord.js");
const setplayer = require("../models/SetupPlayerSchema.js");
const setup = require("../models/SetupSchema.js");
const updateMessage = require("../handlers/setupQueue.js");
const { ClassicPro } = require('musicard');
const fs = require("fs");

module.exports = async (client) => {
  client.manager.on("playerStart", async (player, track) => {
    try {
      const playerConfig = await setplayer.findOne({ guildId: player.guildId });
      const mode = playerConfig?.playerMode || 'classic';

      const updateData = await setup.findOne({ guildId: player.guildId });
    

    await updateMessage(player, client, track);
    if (updateData) {
      if (updateData.channelId == player.textId) return;
    }
  
      player.previousTrack = player.currentTrack || null;
      player.currentTrack = track;
  
      const embeded = createEmbed(track, client);
      if (mode === "musicard") {
        // Generate the Musicard image and send it
        ClassicPro({
          thumbnailImage: track.thumbnail.dynamic ? track.thumbnail.dynamic() : track.thumbnail,
        backgroundColor: '#070707',
        progress: 10,
        progressColor: '#FF0000',
        progressBarColor: '#5F2D00',
        name: track.title,
        nameColor: '#FF0000',
        author: track.author,
        authorColor: '#696969',
        startTime: '0:00',
        endTime: `${convertMilliseconds(track.length)}`,
        timeColor: '#FF4D4D',
        }).then((imageBuffer) => {
          // Save the generated image and send it
          const filePath = `./musicard-${player.guildId}.png`;
          fs.writeFileSync(filePath, imageBuffer);
          const attachment = new AttachmentBuilder(filePath);
          client.channels.cache
            .get(player.textId)
            .send({ files: [attachment] });
        });
      } else {
        // For other modes, continue with sending the embed and buttons
        const componentRows = setupPlayerButtons(player, track, mode);
        const nplaying = await client.channels.cache
          .get(player.textId)
          .send({ embeds: [embeded], components: componentRows });
  
      const filter = (interaction) => {
        return (
          interaction.guild.members.me.voice.channel &&
          interaction.guild.members.me.voice.channelId === interaction.member.voice.channelId
        );
      };

      const collector = nplaying.createMessageComponentCollector({
        filter,
        time: player.queue.current.length,
      });
  
      collector.on("collect", async (interaction) => {
        await handleInteraction(interaction, player, client, track, nplaying, embeded, mode);
      });

      
      collector.on("end", async (collected, reason) => {
      if (reason === "time") {
        nplaying.edit({ embeds: [embeded], components: [] });
      }
    });
    }
    } catch (error) {
      console.error(`Error in playerStart for guild ${player.guildId}:`, error);
    }
  

function createEmbed(track, client) {
  return new EmbedBuilder()
    .setAuthor({
      name: "| Now Playing",
      iconURL: client.user.displayAvatarURL(),
    })
    .setDescription(
      `${client.emoji.playing} **[${
        track.title.length > 50
          ? track.title.slice(0, 50) + "... "
          : track.title || "Unknown Track"
      }](${client.config.ssLink})**`
    )
    .addFields(
      { name: `${client.emoji.author} Author:`, value: `${track.author || "Unknown"}`, inline: true },
      { name: `${client.emoji.requester} Requester:`, value: `${track.requester || "**Argo**"}`, inline: true },
      { name: `${client.emoji.duration} Duration:`, value: `${convertMilliseconds(track.length)}`, inline: true }
    )
    .setThumbnail(track.thumbnail)
    .setColor(client.color)
    .setTimestamp();
}

function setupPlayerButtons(player, track, mode) {
  const rows = [];
  
  switch (mode) {
    case "classic":
      const classicRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("pause")
          .setLabel(player.paused ? "Resume" : "Pause")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("skip")
          .setLabel("Skip")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("shuffle")
          .setLabel("Shuffle")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("replay")
          .setLabel("Replay")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("stop")
          .setLabel("Stop")
          .setStyle(ButtonStyle.Danger)
      );
      rows.push(classicRow);
      break;

      case "musicard":
        break;

    case "spotify":
      const spotifyRow1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("previous")
          .setEmoji("<:previous:1282504990526541824>")
          .setStyle(ButtonStyle.Success)
          .setDisabled(!player.previousTrack),
        new ButtonBuilder()
          .setCustomId("pause")
          .setEmoji(player.paused ? "<:resume:1282506814562500709>" : "<:pause:1282506564514873444>")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("skip")
          .setEmoji("<:skip:1282505018691289189>")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("stop")
          .setEmoji("<:stop:1282507509881376788>")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("replay")
          .setEmoji("<:replayy:1282518712934600815>")
          .setStyle(ButtonStyle.Success)
      );
      const spotifyRow2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("volumeUp")
          .setEmoji("<:volup:1282510511719583847>")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("volumeDown")
          .setEmoji("<:voldown:1282510526542516347>")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("loop")
          .setEmoji("<:loopop:1282518716894019626>")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("shuffle")
          .setEmoji("<:shuffle:1282511526233636915>")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("save")
          .setEmoji("<:save:1282507858398937118>")
          .setStyle(ButtonStyle.Success)
      );
      rows.push(spotifyRow1, spotifyRow2);
      break;

    case "simple":
      const simpleRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("pause")
          .setLabel(player.paused ? "Resume" : "Pause")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("skip")
          .setLabel("Skip")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("shuffle")
          .setLabel("Shuffle")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("replay")
          .setLabel("Replay")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("stop")
          .setLabel("Stop")
          .setStyle(ButtonStyle.Secondary)
      );
      const filterRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("filterSelect")
          .setPlaceholder("Select a filter...")
          .addOptions([
            { label: "Bass Boost", description: "Apply Bassboost Filter To Current Playing", emoji: "<:filters:1283742322223218788>", value: "bassboost" },
            { label: "Nightcore", description: "Apply Nightcore Filter To Current Playing", emoji: "<:filters:1283742322223218788>", value: "nightcore" },
            { label: "Vaporwave", description: "Apply Vaporwave Filter To Current Playing", emoji: "<:filters:1283742322223218788>", value: "vaporwave" },
            { label: "Tremolo", description: "Apply Tremolo Filter To Current Playing", emoji: "<:filters:1283742322223218788>", value: "tremolo" },
            { label: "Vibrato", description: "Apply Vibrato Filter To Current Playing", emoji: "<:filters:1283742322223218788>", value: "vibrato" },
            { label: "Karaoke", description: "Apply Karaoke Filter To Current Playing", emoji: "<:filters:1283742322223218788>", value: "karaoke" },
            { label: "Distortion", description: "Apply Distortion Filter To Current Playing", emoji: "<:filters:1283742322223218788>", value: "distortion" },
            { label: "None", description: "Reset All Filters From Current Playing", emoji: "<:replayy:1282518712934600815>", value: "none" },
          ])
      );
      rows.push(filterRow, simpleRow);
      break;

    case "special":
      const specialrow1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("previous")
          .setEmoji("<:emoji_24:1287027241649180736>")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(!player.previousTrack),
        new ButtonBuilder()
          .setCustomId("pause")
          .setEmoji(player.paused ? "<:emoji_30:1287029056960991275>" : "<:emoji_25:1287028961687375902>")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("skip")
          .setEmoji("<:emoji_25:1287028940816257134>")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("stop")
          .setEmoji("<:emoji_28:1287029010794156113>")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("replay")
          .setEmoji("<:emoji_36:1287034965158002778>")
          .setStyle(ButtonStyle.Secondary)
      );
      const specialrow2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("volumeUp")
          .setEmoji("<:emoji_26:1287028972907134996>")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("volumeDown")
          .setEmoji("<:emoji_27:1287028988975255595>")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("loop")
          .setEmoji("<:emoji_34:1287034459748569198>")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("shuffle")
          .setEmoji("<:emoji_33:1287034051148120154>")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("save")
          .setEmoji("<:emoji_31:1287029155623604368>")
          .setStyle(ButtonStyle.Secondary)
      );
      const specialFilterRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("filterSelect")
          .setPlaceholder("Select a filter...")
          .addOptions([
            { label: "Bass Boost", description: "Apply Bassboost Filter To Current Playing", emoji: "<:filtersss:1279054729543946260>", value: "bassboost" },
            { label: "Nightcore", description: "Apply Nightcore Filter To Current Playing", emoji: "<:filtersss:1279054729543946260>", value: "nightcore" },
            { label: "Vaporwave", description: "Apply Vaporwave Filter To Current Playing", emoji: "<:filtersss:1279054729543946260>", value: "vaporwave" },
            { label: "Tremolo", description: "Apply Tremolo Filter To Current Playing", emoji: "<:filtersss:1279054729543946260>", value: "tremolo" },
            { label: "Vibrato", description: "Apply Vibrato Filter To Current Playing", emoji: "<:filtersss:1279054729543946260>", value: "vibrato" },
            { label: "Karaoke", description: "Apply Karaoke Filter To Current Playing", emoji: "<:filtersss:1279054729543946260>", value: "karaoke" },
            { label: "Distortion", description: "Apply Distortion Filter To Current Playing", emoji: "<:filtersss:1279054729543946260>", value: "distortion" },
            { label: "None", description: "Reset All Filters From Current Playing", emoji: "<:replay:1278699930529042453>", value: "none" },
          ])
      );
      rows.push(specialFilterRow, specialrow1, specialrow2);
      break;

    case "noButtons":
      return rows;

    case "oldschool":
      const oldSchoolRow = new ActionRowBuilder();
      oldSchoolRow.addComponents(
        new ButtonBuilder()
          .setCustomId("previous")
          .setEmoji("<:previous:1282504990526541824>")
          .setLabel("Previous")
          .setDisabled(!player.previousTrack)
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("pause")
          .setEmoji(player.paused ? "<:resume:1282506814562500709>" : "<:pause:1282506564514873444>")
          .setLabel(player.paused ? "Resume" : "Pause")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("skip")
          .setEmoji("<:skip:1282505018691289189>")
          .setLabel("Skip")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("stop")
          .setEmoji("<:stop:1282507509881376788>")
          .setLabel("Stop")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("replay")
          .setEmoji("<:replayy:1282518712934600815>")
          .setLabel("Replay")
          .setStyle(ButtonStyle.Secondary)
      );
      rows.push(oldSchoolRow);
      break;

    default:
      console.warn(`Unrecognized mode: ${mode}. No buttons generated.`);
      break;
  }

  return rows;
}

async function handleInteraction(interaction, player, client, track, nplaying, embeded, mode) {
  const id = interaction.customId;
  switch (id) {
    case "pause":
      await handlePause(player, interaction, nplaying, embeded, mode);
      break;
    case "skip":
      await handleSkip(player, interaction, nplaying, embeded, mode);
      break;
    case "stop":
      await handleStop(player, interaction, nplaying);
      break;
    case "replay":
      await handleReplay(player, interaction, nplaying, embeded, mode);
      break;
    case "shuffle":
      await handleShuffle(player, interaction);
      break;
    case "previous":
      await handlePrevious(player, interaction, nplaying, embeded, mode);
      break;
    case "volumeUp":
      await handleVolumeUp(player, interaction);
      break;
    case "volumeDown":
      await handleVolumeDown(player, interaction);
      break;
    case "loop":
      await handleLoop(player, interaction);
      break;
    case "save":
      await handleSave(interaction, track, client);
      break;
  }
}

async function handlePause(player, interaction, nplaying, embeded, mode) {
  await player.pause(!player.paused);
  const pauseState = player.paused ? "Paused" : "Resumed";
  const pauseEmbed = new EmbedBuilder()
    .setDescription(`<:sec_tick:1286524512489443409> | **Song has been:** \`${pauseState}\``)
    .setColor("#00FF00");

  await interaction.update({ embeds: [embeded], components: setupPlayerButtons(player, player.currentTrack, mode) });
  interaction.followUp({ embeds: [pauseEmbed], ephemeral: true });
}

async function handleSkip(player, interaction, nplaying, embeded, mode) {
  // Remove buttons/filter menu from the previous message
  await nplaying.edit({ components: [] });

  await player.skip();
  const skipEmbed = new EmbedBuilder()
    .setDescription("<:sec_tick:1286524512489443409> | **Song has been:** `Skipped`")
    .setColor("#00FF00");

  interaction.reply({ embeds: [skipEmbed], ephemeral: true });
}

async function handleStop(player, interaction, nplaying) {
  if (!player) {
    return; // Player does not exist
  }

  await player.setLoop("none");
  await player.data.set("autoplay", false);
  await player.queue.clear();
  await player.skip();

  const stopEmbed = new EmbedBuilder()
    .setDescription("<:sec_tick:1286524512489443409> | **Song has been:** `Stopped`")
    .setColor("#FF0000");

  try {
    // Remove components here as well
    await nplaying.edit({ embeds: [stopEmbed], components: [] });
  } catch (error) {
    console.error("Error editing message:", error);
  }

  await interaction.reply({ embeds: [stopEmbed], ephemeral: true });
}




async function handleReplay(player, interaction, nplaying, embeded, mode) {
  await player.seek(0);
  const replayEmbed = new EmbedBuilder()
    .setDescription("<:sec_tick:1286524512489443409> | **Song has been:** `Replayed`")
    .setColor("#00FF00");

  await nplaying.edit({ embeds: [embeded], components: setupPlayerButtons(player, player.currentTrack, mode) });
  interaction.reply({ embeds: [replayEmbed], ephemeral: true });
}

async function handleShuffle(player, interaction) {
  await player.queue.shuffle();
  const shuffleEmbed = new EmbedBuilder()
    .setDescription(`<:sec_tick:1286524512489443409> | **Queue has been:** \`Shuffled\``)
    .setColor("#00FF00");

  interaction.reply({ embeds: [shuffleEmbed], ephemeral: true });
}

async function handlePrevious(player, interaction, nplaying, embeded, mode) {
  const previousTrack = player.previousTrack;
  if (!previousTrack) {
    const errorEmbed = new EmbedBuilder()
      .setColor("#FF0000")
      .setDescription("**No Previous Track to Play**");
    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }

  // Play the previous track
  await player.play(previousTrack);
  const backEmbed = new EmbedBuilder()
    .setDescription("<:sec_tick:1286524512489443409> | **Replaying Previous Track**")
    .setColor("#00FF00");

  await nplaying.edit({ embeds: [embeded], components: [] });
  interaction.reply({ embeds: [backEmbed], ephemeral: true });
}

async function handleVolumeUp(player, interaction) {
  let volumeUp = player.volume + 10;
  if (volumeUp > 100) volumeUp = 100;
  player.setVolume(volumeUp);
  interaction.reply({ content: `Volume increased to ${volumeUp}.`, ephemeral: true });
}

async function handleVolumeDown(player, interaction) {
  let volumeDown = player.volume - 10;
  if (volumeDown < 0) volumeDown = 0;
  player.setVolume(volumeDown);
  interaction.reply({ content: `Volume decreased to ${volumeDown}.`, ephemeral: true });
}

async function handleLoop(player, interaction) {
  if (player.loop === "none") {
    player.setLoop("track");
    interaction.reply({ content: "Looping current track.", ephemeral: true });
  } else {
    player.setLoop("none");
    interaction.reply({ content: "Loop disabled.", ephemeral: true });
  }
}

async function handleSave(interaction, track, client) {
  const savedEmbed = new EmbedBuilder()
    .setAuthor({ name: "Saved song to DM", iconURL: client.user.displayAvatarURL() })
    .setDescription(
      `<:queue:1279037678163198044> | **Saved [${track.title}](${client.config.ssLink}) to your DM.**`
    )
    .addFields(
      { name: "Song Duration", value: `\`${convertMilliseconds(track.length)}\``, inline: true },
      { name: "Song Author", value: `\`${track.author || "Unknown"}\``, inline: true },
      { name: "Requested Guild", value: `\`${interaction.guild.name}\``, inline: true }
    )
    .setThumbnail(`${track.thumbnail}`)
    .setColor(client.color);

  try {
    await interaction.user.send({ embeds: [savedEmbed] });
    interaction.reply({ content: "<:sec_tick:1286524512489443409> | Song saved to your DM!", ephemeral: true });
  } catch (error) {
    interaction.reply({
      content: "<:Crossmark:1286524517417750613> | Unable to send DM. Please enable DMs and try again.",
      ephemeral: true,
    });
  }
}

});
}

function convertMilliseconds(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const hoursStr = hours > 0 ? hours + ":" : "";
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;
  const secondsStr = seconds < 10 ? "0" + seconds : seconds;

  return `${hoursStr}${minutesStr}:${secondsStr}`;
}
