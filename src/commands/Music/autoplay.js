const { Message, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "autoplay",
  aliases: ["ap"],
  description: `Play random songs.`,
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Music",
  cooldown: 5,
  inVc: true,
  sameVc: true,
  premium: false,
  dj: true,
  run: async (client, message, args, prefix, player) => {
    try {
    const { channel } = message.member.voice;
    
    if (!player) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: "No Player Found For This Guild",
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setColor(client.color);

      return message.channel.send({ embeds: [embed] });
    }

    if (player.data.get("autoplay")) {
      // get undifined = turn on + set data
      await player.data.set("autoplay", false);
      //await player.queue.clear();

      const embed = new EmbedBuilder()
        .setDescription("<:sec_tick:1286524512489443409> | *Autoplay has been:* `Deactivated`")
        .setColor(client.color);

      return message.reply({ embeds: [embed] });
    } else {
      const identifier = player.queue.current.identifier;
      const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
      const res = await player.search(search, { requester: message.user });
      if (!res.tracks.length)
        return message.reply(
          `Engine \`${player.queue.current.sourceName}\` not support!`
        );

      await player.data.set("autoplay", true);
      await player.data.set("requester", message.user);
      await player.data.set("identifier", identifier);
      await player.queue.add(res.tracks[1]);

      const embed = new EmbedBuilder()
        .setDescription("<:sec_tick:1286524512489443409> | Autoplay has been: `Activated`")
        .setColor(client.color);

      return message.reply({ embeds: [embed] });
    }
  }catch(err) { 
    const embed = new EmbedBuilder()
    .setAuthor({
      name: "No Player Found For This Guild",
      iconURL: message.author.displayAvatarURL({ dynamic: true }),
    })
    .setFooter({ text : `If You Want To Enable Autoplay Then Play Something You Like`, iconURL: message.guild.iconURL({ dynamic: true})})
    .setColor(client.color)
  
  return message.channel.send({ embeds: [embed] });
  }
}
}
