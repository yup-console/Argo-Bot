const {
  Message,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "queue",
  aliases: ["q"],
  description: `Show the queue of songs`,
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Music",
  cooldown: 5,
  inVc: true,
  sameVc: true,
  dj: true,
  premium: false,
  run: async (client, message, args, prefix, player, track) => {
    //const { channel } = message.member.voice;
    if (!player) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: "No Player Found For This Guild",
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setColor(client.color);

      return message.channel.send({ embeds: [embed] });
    }
    if (player.queue == 0) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: "Queue Is Empty",
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setColor(client.color);

      return message.channel.send({ embeds: [embed] });
    }
    async function ButtonS(page) {
      const buttonsRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("first")
          .setLabel("First")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page === 1),
        new ButtonBuilder()
          .setCustomId("previous")
          .setLabel("Previous")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page === 1),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel("Next")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page === totalPages),
        new ButtonBuilder()
          .setCustomId("last")
          .setLabel("Last")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page === totalPages)
      );
      return buttonsRow;
    }
    const totalSongsPerPage = 10;
    const totalPages = Math.ceil(player.queue.length / totalSongsPerPage);
    let page = 1;
    if (args[0]) {
      if (isNaN(args[0])) {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: "Invalid Page Number",
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setColor(client.color);

        return message.channel.send({ embeds: [embed] });
      }
      if (args[0] > totalPages) {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: "Invalid Page Number",
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setColor(client.color);

        return message.channel.send({ embeds: [embed] });
      }
      page = parseInt(args[0]);
    }
    const start = (page - 1) * totalSongsPerPage;
    const end = page * totalSongsPerPage;
    const tracks = player.queue.slice(start, end);
    const embed = new EmbedBuilder()
      .setAuthor({
        name: `Queue of ${message.guild.name}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setColor(client.color)
      .setDescription(
        tracks
          .map(
            (track, index) =>
              `( \`${start + (index + 1)}\` ) [${
                track.title.length > 15
                  ? track.title.slice(0, 15) + "..."
                  : track.title || "**Unknown Track**"
              }](${client.config.ssLink}) [ ${
                track.requester || "**Argo**"
              } ] `
          )
          .join("\n")
      )
      .setFooter({ text: `Page ${page} of ${totalPages}` });
    const msg = await message.channel.send({
      embeds: [embed],
      components: [await ButtonS(page)],
    });
    const filter = (interaction) => interaction.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({
      filter,
      time: 60000 * 10,
    });
    collector.on("collect", async (interaction) => {
      if (interaction.customId === "first") {
        page = 1;
        const start = (page - 1) * totalSongsPerPage;
        const end = page * totalSongsPerPage;
        const tracks = player.queue.slice(start, end);
        const embed = new EmbedBuilder()
          .setAuthor({
            name: `Queue of ${message.guild.name}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setColor(client.color)
          .setDescription(
            tracks
              .map(
                (track, index) =>
                  `( \`${start + (index + 1)}\` ) [${
                    track.title.length > 15
                      ? track.title.slice(0, 15) + "..."
                      : track.title || "**Unknown Track**"
                  }](${client.config.ssLink}) [ ${
                    track.requester || "**Argo**"
                  } ] `
              )
              .join("\n")
          )
          .setFooter({ text: `Page ${page} of ${totalPages}` });
        await interaction.update({
          embeds: [embed],
          components: [await ButtonS(page)],
        });
      }
      if (interaction.customId === "previous") {
        page--;
        const start = (page - 1) * totalSongsPerPage;
        const end = page * totalSongsPerPage;
        const tracks = player.queue.slice(start, end);
        const embed = new EmbedBuilder()
          .setAuthor({
            name: `Queue of ${message.guild.name}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setColor(client.color)
          .setDescription(
            tracks
              .map(
                (track, index) =>
                  `( \`${start + (index + 1)}\` ) [${
                    track.title.length > 15
                      ? track.title.slice(0, 15) + "..."
                      : track.title || "**Unknown Track**"
                  }](${client.config.ssLink}) [ ${
                    track.requester || "**Argo**"
                  } ] `
              )
              .join("\n")
          )
          .setFooter({ text: `Page ${page} of ${totalPages}` });
        await interaction.update({
          embeds: [embed],
          components: [await ButtonS(page)],
        });
      }
      if (interaction.customId === "next") {
        page++;
        const start = (page - 1) * totalSongsPerPage;
        const end = page * totalSongsPerPage;
        const tracks = player.queue.slice(start, end);
        const embed = new EmbedBuilder()
          .setAuthor({
            name: `Queue of ${message.guild.name}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setColor(client.color)
          .setDescription(
            tracks
              .map(
                (track, index) =>
                  `( \`${start + (index + 1)}\` ) [${
                    track.title.length > 15
                      ? track.title.slice(0, 15) + "..."
                      : track.title || "**Unknown Track**"
                  }](${client.config.ssLink}) [ ${
                    track.requester || "**Argo**"
                  } ] `
              )
              .join("\n")
          )
          .setFooter({ text: `Page ${page} of ${totalPages}` });
        await interaction.update({
          embeds: [embed],
          components: [await ButtonS(page)],
        });
      }
      if (interaction.customId === "last") {
        page = totalPages;
        const start = (page - 1) * totalSongsPerPage;
        const end = page * totalSongsPerPage;
        const tracks = player.queue.slice(start, end);
        const embed = new EmbedBuilder()
          .setAuthor({
            name: `Queue of ${message.guild.name}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setColor(client.color)
          .setDescription(
            tracks
              .map(
                (track, index) =>
                  `( \`${start + (index + 1)}\` ) [${
                    track.title.length > 15
                      ? track.title.slice(0, 15) + "..."
                      : track.title || "**Unknown Track**"
                  }](${client.config.ssLink}) [ ${
                    track.requester || "**Argo**"
                  } ] `
              )
              .join("\n")
          )
          .setFooter({ text: `Page ${page} of ${totalPages}` });
        await interaction.update({
          embeds: [embed],
          components: [await ButtonS(page)],
        });
      }
    });
    collector.on("end", async () => {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `Queue of ${message.guild.name}`,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setColor(client.color)
        .setDescription(
          tracks
            .map(
              (track, index) =>
                `( \`${start + (index + 1)}\` ) [${
                  track.title.length > 15
                    ? track.title.slice(0, 15) + "..."
                    : track.title || "**Unknown Track**"
                }](${client.config.ssLink}) [ ${
                  track.requester || "**Argo**"
                } ] `
            )
            .join("\n")
        )
        .setFooter({ text: `Page ${page} of ${totalPages}` });
      await msg.edit({ embeds: [embed], components: [] });
    });
  },
};
