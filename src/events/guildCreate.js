const {
  EmbedBuilder,
  WebhookClient,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");
const client = require("..");
const web = new WebhookClient({ url: `${client.config.join_log}` });

module.exports = async (client, guild) => {
  client.on("guildCreate", async (guild) => {
    let mainChannel;
    guild.channels.cache.forEach((x) => {
      if (
        guild.members.me
          .permissionsIn(x)
          .has([
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ViewChannel,
          ]) &&
        x.type === ChannelType.GuildText &&
        !mainChannel
      )
        mainChannel = x;
    });

    let mb = new EmbedBuilder()
      .setTitle(`Hey I am ${client.user.username}`)
      .setColor(client.color)
      .setAuthor({
        name: `Thanks for Inviting Me`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription(
        `<:arrow:1279039302566805534> I come up with default prefix as : \`${client.config.prefix}\`\n<:arrow:1279039302566805534> I am a High Quality Rythmic music bot with lots of unique features\n<:arrow:1279039302566805534> I come up with different search engines, You may try out me with \`play\`\n<:arrow:1279039302566805534> If you find any bug or want any kind of help regarding our services of Argo Bot\n<:arrow:1279039302566805534> Please consider Joining [Support server](${client.config.ssLink}) by clicking [here](${client.config.ssLink})`
      )
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setTimestamp();

    // button
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Invite Me")
        .setStyle(ButtonStyle.Link)
        .setURL(`${client.invite}`),
      new ButtonBuilder()
        .setLabel("Support Server")
        .setStyle(ButtonStyle.Link)
        .setURL(`${client.config.ssLink}`),
      new ButtonBuilder()
        .setLabel("Top.gg")
        .setStyle(ButtonStyle.Link)
        .setURL(`${client.config.topGg}`)
    );
    if (mainChannel)
      mainChannel.send({
        embeds: [mb],
        components: [row],
      });

    let invite;

    if (mainChannel)
      invite = await mainChannel?.createInvite({ maxAge: 0 }).catch(() => {});
    else invite = "Unable to fetch Invite";
    if (!invite) invite = "Unable to fetch invite";

    let em = new EmbedBuilder()
      .setTitle(`Guild Joined`)
      .setColor(client.color)
      .setAuthor({
        name: `${client.user.username}`,
        iconURL: client.user.displayAvatarURL(),
      })
      .addFields([
        {
          name: `Guild Info`,
          value: `Guild Name: ${guild.name}\nGuild Id: ${
            guild.id
          }\nGuild Created: <t:${Math.round(
            guild.createdTimestamp / 1000
          )}:R>\nGuild Joined: <t:${Math.round(
            guild.joinedTimestamp / 1000
          )}:R>\nGuild Invite: ${invite}\nGuild Owner: ${
            (await guild.members.fetch(guild.ownerId))
              ? guild.members.cache.get(guild.ownerId).user.tag
              : "Unknown User"
          }\nMemberCount: ${guild.memberCount} Members\nShardId: ${
            guild.shardId
          }`,
        },
        {
          name: `Bot Info`,
          value: `Server Count: ${await client.cluster
            .broadcastEval((c) => c.guilds.cache.size)
            .then((r) =>
              r.reduce((a, b) => a + b, 0)
            )} Servers\nUsers Count: ${await client.cluster
            .broadcastEval((c) =>
              c.guilds.cache
                .filter((x) => x.available)
                .reduce((a, g) => a + g.memberCount, 0)
            )
            .then((r) =>
              r.reduce((acc, memberCount) => acc + memberCount, 0)
            )} Users`,
        },
      ])
      .setThumbnail(guild.iconURL({ dynamic: true }));

    web.send({ embeds: [em] });
  });
};
