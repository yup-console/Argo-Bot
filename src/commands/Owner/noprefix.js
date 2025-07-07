const {
  Message,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const noPrefix = require("../../models/NoPrefixSchema.js");
const pkg = require("lodash");
const { chunk } = pkg;

module.exports = {
  name: "noprefix",
  aliases: ["nopre"],
  description: "Add or remove users from the NoPrefix list",
  category: "Owner",
  ownerOnly: true,
  run: async (client, message, args, prefix) => {
    if (!client.config.ownerIDS.includes(message.author.id)) return;

    try {
      let userId;
      if (message.mentions.users.size) {
        userId = message.mentions.users.first().id;
      } else if (args[1] && !isNaN(args[1])) {
        userId = args[1];
      }

      if (!args[0]) {
        const embed = new EmbedBuilder()
          .setColor(client.color)
          .setDescription(`Use ${prefix}noprefix add/remove followed by a user mention or ID`);
        return message.channel.send({ embeds: [embed] });
      }

      if (args[0].toLowerCase() === "add") {
        if (!userId) {
          const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription("Please provide a valid user mention or ID to add.");
          return message.channel.send({ embeds: [embed] });
        }

        const data = await noPrefix.findOne({ userId });
        if (data) {
          const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription("User already has NoPrefix.");
          return message.channel.send({ embeds: [embed] });
        }

        await noPrefix.create({ userId });
        const embed = new EmbedBuilder()
          .setColor(client.color)
          .setDescription(`Now <@${userId}> is added to the NoPrefix list.`);
        return message.channel.send({ embeds: [embed] });
      }

      if (args[0].toLowerCase() === "remove") {
        if (!userId) {
          const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription("Please provide a valid user mention or ID to remove.");
          return message.channel.send({ embeds: [embed] });
        }

        const data = await noPrefix.findOne({ userId });
        if (!data) {
          const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription("This user doesn't have NoPrefix.");
          return message.channel.send({ embeds: [embed] });
        }

        await noPrefix.findOneAndDelete({ userId });
        const embed = new EmbedBuilder()
          .setColor(client.color)
          .setDescription(`Now <@${userId}> is removed from the NoPrefix list.`);
        return message.channel.send({ embeds: [embed] });
      }

      if (args[0].toLowerCase() === "list" || args[0].toLowerCase() === "show") {
        const data = await noPrefix.find();
        if (!data.length) {
          const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription("No users found in the NoPrefix list.");
          return message.channel.send({ embeds: [embed] });
        }

        let users = [];
        for (let i = 0; i < data.length; i++) {
          try {
            const user = await client.users.fetch(data[i].userId);
            users.push(
              `[${i + 1}]. [${user.globalName || user.username}](https://discord.com/users/${user.id})`
            );
          } catch (e) {
            continue;
          }
        }

        if (users.length < 11) {
          const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(users.sort().join("\n"))
            .setTitle("No Prefix List");
          return message.channel.send({ embeds: [embed] });
        } else {
          const queue = users.map((x) => `${x}`);
          const maps = chunk(queue, 10);
          const pages = maps.map((x) => x.join("\n"));
          let page = 0;
          const embed = new EmbedBuilder()
            .setTitle("No Prefix List")
            .setDescription(`${pages[page]}`)
            .setAuthor({
              name: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            })
            .setThumbnail(message.guild.iconURL({ dynamic: true }));

          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("prev")
              .setLabel("Previous")
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId("stop")
              .setLabel("Stop")
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId("next")
              .setLabel("Next")
              .setStyle(ButtonStyle.Secondary)
          );

          const msg = await message.reply({ embeds: [embed], components: [row] });
          const collector = msg.createMessageComponentCollector({
            filter: (b) => b.user.id === message.author.id,
            time: 100000 * 7,
          });

          collector.on("collect", async (interaction) => {
            if (interaction.isButton()) {
              if (interaction.customId === "prev") {
                page = page > 0 ? --page : pages.length - 1;
                return interaction.update({
                  embeds: [embed.setDescription(pages[page])],
                });
              } else if (interaction.customId === "stop") {
                collector.stop();
                return;
              } else if (interaction.customId === "next") {
                page = page + 1 < pages.length ? ++page : 0;
                return interaction.update({
                  embeds: [embed.setDescription(pages[page])],
                });
              }
            }
          });

          collector.on("end", async () => {
            if (msg) await msg.edit({ components: [] });
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
};
