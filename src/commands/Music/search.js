const { AttachmentBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

module.exports = {
  name: "search",
  description: `Search A Song Based On Your Interest!`,
  premium: true,
  run: async (client, message, args, prefix, player) => {
    const query = args.join(" ");
    if (!query) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`**${prefix}search** \`<song name>\``),
        ],
      });
    }

    try {
      await message.channel.sendTyping();
      let result = await client.manager.search(query, {
        requester: message.author,
      });

      if (!result.tracks.length)
        return message.reply(`No results found for \`${query}\``);

      const topTracks = result.tracks.slice(0, 10); // Get top 10 tracks

      // Call the function to generate the image for the top 10 tracks
      await createSearchCard(topTracks);

      // Send the generated image
      const attachment = new AttachmentBuilder('./search-card.png');
      const row = createSelectMenu(topTracks); // Create select menu with the top 10 tracks

      const searchMessage = await message.channel.send({
        files: [attachment],
        components: [row], // Attach the select menu to the message
      });

      // Create a collector to handle menu selection
      const filter = (interaction) => interaction.isStringSelectMenu() && interaction.customId === 'select-song' && interaction.user.id === message.author.id;
      const collector = searchMessage.createMessageComponentCollector({ filter, time: 60000 });

      collector.on('collect', async (interaction) => {
        try {
          // Defer reply immediately to acknowledge the interaction
          await interaction.deferReply();  // Acknowledge the interaction immediately
      
          const selectedIndex = parseInt(interaction.values[0], 10); // Get the selected track index
          const selectedTrack = topTracks[selectedIndex]; // Fetch the corresponding track
      
          // Ensure the user is in a voice channel
          if (!message.member.voice.channelId) {
            return interaction.editReply({
              content: '**You are not in a voice channel!**',
              ephemeral: true, // Use ephemeral message
            });
          }
      
          // Ensure player is initialized before attempting to play the song
          if (!player) {
            player = await client.manager.createPlayer({
              guildId: message.guild.id,
              voiceId: message.member.voice.channelId,
              textId: message.channel.id,
            });
          }
      
          // Add track to the queue and play if not already playing
          player.queue.add(selectedTrack);
          if (!player.playing && !player.paused && !player.queue.size) {
            player.play();
          }
      
          // Edit the deferred reply instead of follow-up
          await interaction.editReply({
            content: `🎶 Now playing **${selectedTrack.title}** by ${selectedTrack.author}`,
          });
      
        } catch (error) {
          console.error('Error handling select menu interaction:', error);
          // Safely edit reply in case of errors
          await interaction.editReply({
            content: 'An error occurred while processing your selection.',
            ephemeral: true,
          });
        }
      });
      

      collector.on('end', (collected) => {
        if (!collected.size) {
          searchMessage.edit({ content: 'Search selection timed out.', components: [] });
        }
      });

    } catch (e) {
      console.error(e);
    }
  },
};

// Function to create the search card image for 10 tracks
async function createSearchCard(tracks) {
  const canvas = createCanvas(800, 1000); // Increase height to fit 10 results
  const ctx = canvas.getContext('2d');

  // Background color
  ctx.fillStyle = '#282a36';
  ctx.fillRect(0, 0, 800, 1000);

  // Loop through each track and add to the image
  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];
    const yPosition = 20 + i * 95; // Calculate vertical position for each result

    // Load album thumbnail
    const thumbnail = await loadImage(track.thumbnail);
    ctx.drawImage(thumbnail, 20, yPosition, 70, 70);

    // Song Title
    ctx.font = 'bold 30px Sans';
    ctx.fillStyle = '#fff';
    ctx.fillText(track.title, 100, yPosition + 40);

    // Artist or Channel Name
    ctx.font = '20px Sans';
    ctx.fillStyle = '#bbb';
    ctx.fillText(`By: ${track.author}`, 100, yPosition + 70);
  }

  // Save the image to a file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('./search-card.png', buffer);
}

// Function to create a select menu for the top 10 tracks
function createSelectMenu(tracks) {
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('select-song') // Ensure this ID matches with your interaction handler
    .setPlaceholder('Choose a song to play')
    .addOptions(
      tracks.map((track, index) => ({
        label: track.title.substring(0, 25), // Truncate title to avoid overflow
        description: `By: ${track.author}`,
        value: index.toString(), // The value is the index of the song in the array
      }))
    );

  const row = new ActionRowBuilder().addComponents(selectMenu); // Add the menu to a row
  return row;
}
