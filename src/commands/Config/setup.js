const {
  Message,
  PermissionFlagsBits,
  EmbedBuilder,
  PermissionsBitField,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} = require("discord.js");
const setupData = require("../../models/SetupSchema.js");

module.exports = {
  name: "setup",
  aliases: ["panel"],
  description: "Setup music panel for your server",
  userPermissions: PermissionFlagsBits.ManageGuild,
  // botPermissions: PermissionFlagsBits.Speak,
  cooldowns: 5,
  category: "Config",
  voteOnly: true,
  run: async (client, message, args, prefix) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild))
      return message.channel.send(`${client.emoji.cross} | You don't have enough permissions!`);

    try {
      const data = await setupData.findOne({ guildId: message.guild.id });
      if (!args[0]) {
        const embed = new EmbedBuilder()
          .setColor(client.color)
          .setDescription(
            `If you want to setup you can use ${prefix}create/delete`
          );
        return message.channel.send({ embeds: [embed] });
      }
      if (args[0].toLowerCase() === "create") {
        if (data && data.channelId && data.messageId) {
          const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`${client.emoji.cross} | Setup Already Exists at: <#${data.channelId}>`);
          return message.channel.send({ embeds: [embed] });
        }
        let channel =
          message.mentions.channels.first() ||
          message.guild.channels.cache.get(args[2]);

        if (!channel)
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setDescription(
                  `${client.emoji.cross} | Please provide me a valid channel to be created setup on!`
                ),
            ],
          });

        if (!message.guild.members.me.permissionsIn(channel).has("ViewChannel"))
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setDescription(
                  `${client.emoji.cross} | I don't have **View Channel** permissions in that channel!`
                )
                .setTitle(`Missing Permissions`),
            ],
          });

        if (
          !message.guild.members.me.permissionsIn(channel).has("SendMessages")
        )
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setDescription(
                  `${client.emoji.cross} | I don't have **Send Messages** permissions in that channel!`
                )
                .setTitle(`Missing Permissions`),
            ],
          });

        if (
          !message.guild.members.me
            .permissionsIn(channel)
            .has("ReadMessageHistory")
        )
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setDescription(
                  `${client.emoji.cross} | I don't have **Read Message History** permissions in that channel!`
                )
                .setTitle(`Missing Permissions`),
            ],
          });

        if (
          !message.guild.members.me
            .permissionsIn(channel)
            .has("UseExternalEmojis")
        )
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setDescription(
                  `${client.emoji.cross} | I don't have **Use External Emojis** permissions in that channel!`
                )
                .setTitle(`Missing Permissions`),
            ],
          });

        if (!message.guild.members.me.permissionsIn(channel).has("EmbedLinks"))
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setDescription(
                  `${client.emoji.cross} | I don't have **Embed Links** permissions in that channel!`
                )
                .setTitle(`Missing Permissions`),
            ],
          });

        if (
          !message.guild.members.me.permissionsIn(channel).has("ManageChannels")
        )
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setDescription(
                  `${client.emoji.cross} | I don't have **Manage Channels** permissions in that channel!`
                )
                .setTitle(`Missing Permissions`),
            ],
          });

        if (
          !message.guild.members.me.permissionsIn(channel).has("ManageMessages")
        )
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setDescription(
                  `${client.emoji.cross} | I don't have **Manage Messages** permissions in that channel!`
                )
                .setTitle(`Missing Permissions`),
            ],
          });

        let embedl = new EmbedBuilder()
          .setColor(client.color)
          .setImage(`https://media.discordapp.net/attachments/1241172642799816766/1249187753875210291/Picsart_24-04-17_17-00-34-515.jpg?ex=66690741&is=6667b5c1&hm=0757efb8a611f907b506fbbf5602d91e599adb158d61854e2621c866f19d0f82&=&format=webp&width=1066&height=600`)

        let em = new EmbedBuilder()
          .setColor(client.color)
          .setTitle(`__Join a Voice Channel & Request a Song__`)
          .setDescription(`**Elevate Your Music Experience with Argo**: Join Vc & Request a Song. We are here to Deliver The High Quality Music For You!`)
          .setImage(`${client.config.setupBgLink}`)
          .setAuthor({
            name: `Argo - Requests`,
            iconURL: message.guild.iconURL({ dynamic: true }),
          })
          .setFooter({
            text: `| Thanks for choosing ${client.user.username}`,
            iconURL: `https://cdn.discordapp.com/emojis/1246706215182925877.webp?size=128&quality=lossless`,
          });

        //btn
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
            .setLabel("Pause")
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

        //menu
        const filterRow = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("filterSelect")
            .setPlaceholder("Select a filter")
            .addOptions(
              {
                label: "Bass Boost",
                description: "Apply a bass boost filter",
                value: "bassboost",
                emoji: "<:filters:1243212306842783836>",
              },
              {
                label: "Nightcore",
                description: "Apply a nightcore filter",
                value: "nightcore",
                emoji: "<:filters:1243212306842783836>",
              },
              {
                label: "Vaporwave",
                description: "Apply a vaporwave filter",
                value: "vaporwave",
                emoji: "<:filters:1243212306842783836>",
              },
              {
                label: "Tremolo",
                description: "Apply a tremolo filter",
                value: "tremolo",
                emoji: "<:filters:1243212306842783836>",
              },
              {
                label: "Vibrato",
                description: "Apply a vibrato filter",
                value: "vibrato",
                emoji: "<:filters:1243212306842783836>",
              },
              {
                label: "Karaoke",
                description: "Apply a karaoke filter",
                value: "karaoke",
                emoji: "<:filters:1243212306842783836>",
              },
              {
                label: "Distortion",
                description: "Apply a distortion filter",
                value: "distortion",
                emoji: "<:filters:1243212306842783836>",
              },
              {
                label: "None",
                description: "Remove all filters",
                value: "none",
                emoji: "<:reset:1249250249462255617>",
              }
            )
        );

        let msg = await channel.send({
          embeds: [embedl, em],
          //content: content,
          components: [filterRow, row, row2],
        });

        await setupData.updateOne(
          { guildId: message.guild.id },
          {
            $set: {
              channelId: channel.id,
              messageId: msg.id,
              prefixz: prefix,
            },
          },
          { upsert: true }
        );

        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.color)
              .setTitle(`Setup Created`)
              .setDescription(
                `${client.emoji.tick} | Successfully **Created** Music Setup at ${channel}. Hope you enjoy me there`
              ),
          ],
        });
      }

      if (args[0].toLowerCase() === `delete`) {
        if (!data || (data && !data.channelId) || (data && !data.messageId)) {
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`${client.emoji.cross} | There is no setup for this guild right now!`),
            ],
          });
        }

        let ch = message.guild.channels.cache.get(data.channelId);
        if (ch) {
          let msg = await ch.messages.fetch(data.messageId).catch(() => {});
          if (msg) msg.delete().catch((e) => {});
        }
        await data.deleteOne();
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.color)
              .setTimestamp()
              .setTitle(`Deleted`)
              .setDescription(`${client.emoji.tick} | Successfully **Deleted** Server Music Setup`),
          ],
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
