const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  Message,
} = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["h"],
  description: "help command",
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Info",
  cooldown: 5,
  run: async (client, message, args, prefix) => {
    let invite = `https://discord.com/oauth2/authorize?client_id=1131938711639183363`;
    let support = `https://discord.gg/28ezgRBkST`;
    let vote = `https://top.gg/bot/1131938711639183363/vote`;

    let em1 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${client.user.tag}`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription(
        `## [Music Commands](${support})\n\`autoplay, clear, disconnect, join, loop, lyrics, nowplaying, pause, play, queue, remove, replay, resume, search, seek, shuffle, skip, stop, volume\``
      );

    let em2 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${client.user.tag}`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription(
        `## [Filter Commands](${support})\n\`3d, alien, ambient, bass, bassboost, chill, china, chipmuk, dance, darthvader, daycore, doubletime, haunted, lofi, muffled, nightcore, reset, slowed, soft, softfocus, softguitar, cosmic, underwater, warmpad\``
      );

    let em3 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${client.user.tag}`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription(
        `## [Config Commands](${support})\n\`247, djrole, ignorechannel, prefix, restrict, setup, setupplayer, unrestrict\``
      );

    let em4 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${client.user.tag}`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription(
        `## [Info Commands](${support})\n\`profile, help, invite, links, partner, ping, stats, support, uptime, vote, avatar, premium, premiumstatus, npreq\``
      );

    let em5 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${client.user.tag}`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription(
        `## [Miscellaneous Commands](${support})\n\`blush, bonk, cat, cry, cuddle, adance, hug, kill, pat, poke, punch, roast, slap, wink\``
      );

    let em6 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${client.user.tag}`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription(
        `## [「 All Commands 」](${support})\n### 1. [Music Commands](${support})\n\`autoplay, clear, disconnect, join, loop, lyrics, nowplaying, pause, play, queue, remove, replay, resume, search, seek, shuffle, skip, stop, volume\`\n### 2. [Filter Commands](${support})\n\`3d, alien, ambient, bass, bassboost, chill, china, chipmuk, dance, darthvader, daycore, doubletime, haunted, lofi, muffled, nightcore, reset, slowed, soft, softfocus, softguitar, cosmic, underwater, warmpad\`\n### 3. [Config Commands](${support})\n\`247, djrole, ignorechannel, prefix, restrict, setup, setupplayer, unrestrict\`\n### 4. [Info Commands](${support})\n\`profile, help, invite, links, partner, ping, stats, support, uptime, vote, avatar, premium, premiumstatus, npreq\`\n### 5. [Miscellaneous Commands](${support})\n\`blush, bonk, cat, cry, cuddle, adance, hug, kill, pat, poke, punch, roast, slap, wink\``
      );

    if (!args[0]) {
      let em = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({
          name: `${client.user.tag} Help Menu`,
          iconURL: client.user.displayAvatarURL(),
        })
        .setURL("https://discord.gg/argomusic")
        .setFooter({
          text: `Thanks for Using me!`,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(
          `・My Prefix is: \`${prefix}\`\n・Total Commands: ${client.mcommands.size}\n・[Invite Argo](https://discord.com/oauth2/authorize?client_id=1131938711639183363) | [Argo Support](${client.config.ssLink}) | [Documentation](https://docs.argomusic.xyz)`
        )
        .addFields({
          name: `__**Command Categories:**__`,
          value: `<:emoji_35:1288657150809477130> \`:\` Music \n<:emoji_33:1288657113119457300> \`:\` Filters \n<:emoji_34:1288657133201784924> \`:\` Configuration \n<:emoji_31:1288657079384543346> \`:\` Information \n<:emoji_32:1288657095670894602> \`:\` Miscellaneous \n<:emoji_29:1288656992826556416> \`:\` All Commands`,
        });

      let menu = new StringSelectMenuBuilder()
        .setPlaceholder(`🎧 | Select to view the commands.`)
        .setCustomId(`help`)
        .addOptions([
          { label: `Home`, description: `Navigate to Home Page`, value: `help-home`, emoji: `<:emoji_30:1288657062661718086>` },
          { label: `Music`, description: `Check Commands under Music category`, value: `help-music`, emoji: `<:emoji_35:1288657150809477130>` },
          { label: `Filters`, description: `Check Commands under Filters category`, value: `help-filters`, emoji: `<:emoji_33:1288657113119457300>` },
          { label: `Configuration`, description: `Check Commands under Config category`, value: `help-config`, emoji: `<:emoji_34:1288657133201784924>` },
          { label: `Information`, description: `Check Commands under Information category`, value: `help-info`, emoji: `<:emoji_31:1288657079384543346>` },
          { label: `Miscellaneous`, description: `Check Commands under Miscellaneous category`, value: `help-fun`, emoji: `<:emoji_32:1288657095670894602>` },
          { label: `All Commands`, description: `Check Commands All category`, value: `help-allcmds`, emoji: `<:emoji_29:1288656992826556416>` },
        ]);

      let ro = new ActionRowBuilder().addComponents(menu);
      let b1 = new ButtonBuilder()
        .setStyle(ButtonStyle.Success)
        .setCustomId(`m1`)
        .setEmoji("<:emoji_30:1288657062661718086>");
      
      let b3 = new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setCustomId(`close`)
        .setEmoji(`<:emoji_29:1288657045343703111>`);
      let b2 = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setLabel("All Commands")
        .setCustomId(`m2`)
        .setEmoji("<:emoji_29:1288656992826556416>");

      const button = new ActionRowBuilder().addComponents(b1, b3, b2);

      let msg;
      try {
        msg = await message.channel.send({
          embeds: [em],
          components: [button, ro],
        });
      } catch (error) {
        console.error("Failed to send message:", error);
        return;
      }

      let collector = await msg.createMessageComponentCollector({
        filter: (interaction) => interaction.user.id === message.author.id,
        time: 100000 * 4,
        idle: 100000 * 2,
      });

      collector.on("collect", async (interaction) => {
        if (interaction.isStringSelectMenu()) {
          switch (interaction.values[0]) {
            case "help-home":
              await interaction.update({ embeds: [em] });
              break;
            case "help-music":
              await interaction.update({ embeds: [em1] });
              break;
            case "help-filters":
              await interaction.update({ embeds: [em2] });
              break;
            case "help-config":
              await interaction.update({ embeds: [em3] });
              break;
            case "help-info":
              await interaction.update({ embeds: [em4] });
              break;
            case "help-fun":
              await interaction.update({ embeds: [em5] });
              break;
            case "help-allcmds":
              await interaction.update({ embeds: [em6] });
              break;
            default:
              collector.stop();
          }
        } else if (interaction.isButton()) {
          switch (interaction.customId) {
            case "m1":
              await interaction.update({ embeds: [em] });
              break;
            case "m2":
              await interaction.update({ embeds: [em6] });
              break;
            case "close":
              await interaction.reply({
                content:
                  "<a:Loading:1279057508018688123> Closing the interface...",
                ephemeral: true,
              });
              try {
                await msg.delete();
              } catch (error) {
                console.error("Failed to delete message:", error);
              }
              collector.stop();
              break;
          }
        }
      });

      collector.on("end", async () => {
        if (!msg) return;
        const disabledButtons = new ActionRowBuilder().addComponents(
          b1.setDisabled(true),
          b2.setDisabled(true),
          b3.setDisabled(true),
        );
        const disabledMenu = new ActionRowBuilder().addComponents(
          menu.setDisabled(true)
        );
        try {
          await msg.edit({ components: [disabledButtons, disabledMenu] });
        } catch (error) {
          console.error("Failed to edit message:", error);
        }
      });
    }
  },
};
