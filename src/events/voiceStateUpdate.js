const {
  ChannelType,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  PermissionsBitField,
} = require("discord.js");
const wait = require("wait");
const reconnect = require("../models/reconnect.js");

module.exports = async (client) => {
  client.on("voiceStateUpdate", async (oldState, newState) => {
    if (!newState || !newState.guild) return;

    let player = client.manager.players.get(newState.guild.id);
    const reconnectAuto = await reconnect.findOne({
      GuildId: newState.guild.id,
    });
    if (!player) return;
    if (oldState.id === client.user.id) return;
    if (
      !newState.guild.members.cache.get(client.user.id).voice.channelId ||
      !oldState.guild.members.cache.get(client.user.id).voice.channelId
    )
      return;
    if (!newState.guild.members.me.voice.channel) {
      player.destroy();
    }
    if (newState.id === client.user.id && newState.serverMute)
      newState.setMute(false);
    await wait(180000);
    if (reconnectAuto) {
      if (player) {
        const channelID = player.node.manager.connections.get(
          newState.guild.id
        );
        if (!channelID?.channelId) return;
        const playerVoiceChannel = newState.guild.channels.cache.get(
          channelID.channelId
        );
        if (
          playerVoiceChannel &&
          playerVoiceChannel.members.filter((x) => !x.user.bot).size <= 0
        ) {
          await wait(1000);
          player.setLoop("none");
          await wait(1000);
          player.data.set("autoplay", false);
          await wait(1000);
          player.queue.clear();
          await wait(1000);
          player.skip();
        }
      }
    } else {
      await wait(180000);
      if (player) {
        const channelID = player.node.manager.connections.get(
          newState.guild.id
        );
        if (!channelID?.channelId) return;
        const playerVoiceChannel = newState.guild.channels.cache.get(
          channelID.channelId
        );
        if (
          playerVoiceChannel &&
          playerVoiceChannel.members.filter((x) => !x.user.bot).size <= 0
        ) {
          player.destroy();
        }
      }
      /*let channel = client.channels.cache.get(player.textId);
          if (channel) {
            const embed = new EmbedBuilder()
              .setColor(client.color)
              .setAuthor({
                name: `${client.user.username} Alert!`,
                iconURL: client.user.displayAvatarURL(),
              })
              .setDescription(
                `**I Left The Voice Channel.** Because No One Was Listening Music With me. Enabled 247 Mode To Keep Me In VC.`
              );
            await channel.send({ embeds: [embed] });
          }*/
    }
  });
};
