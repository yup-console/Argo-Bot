const { white, green } = require("chalk");
const { EmbedBuilder } = require("discord.js");
const reconnectAuto = require("../models/reconnect.js");
const wait = require("wait");
const { AutoPoster } = require("topgg-autoposter");

module.exports = async (client) => {
  client.on("ready", async () => {
    (async () => {
      try {
        const poster = AutoPoster(`${client.config.topgg_Api}`, client);
        const guildCount = await client.cluster.broadcastEval(
          (c) => c.guilds.cache.size
        );

        await poster.postStats({
          serverCount: guildCount.reduce((a, b) => a + b, 0),
          shardCount: client.cluster.info.TOTAL_SHARDS,
        });

        poster.on("posted", (stats) => {
          console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`);
        });
      } catch (error) {
        console.log(error);
      }
    })();
    
    // 247
    await wait(15000);
    const maindata = await reconnectAuto.find();
    console.log(
      `Auto Reconnect found ${
        maindata.length
          ? `${maindata.length} queue${
              maindata.length > 1 ? "s" : ""
            }. Resuming all auto reconnect queues`
          : "0 queues"
      }`,
      "player"
    );
    for (const data of maindata) {
      const text = client.channels.cache.get(data.TextId);
      const guild = client.guilds.cache.get(data.GuildId);
      const voice = client.channels.cache.get(data.VoiceId);
      if (!guild || !text || !voice) continue; // Skip invalid entries

      try {
        await client.manager.createPlayer({
          guildId: guild.id,
          textId: text.id,
          voiceId: voice.id,
          volume: 100,
          deaf: true,
          shardId: guild.shardId,
        });
        console.log(`Joined channel successfully in guild ${guild.name}`);
      } catch (error) {
        console.error(
          `Error joining channel in guild ${guild.name}: ${error.message}`
        );
        // Handle the error here (e.g., logging, retrying, etc.)
      }
    }
    console.log(`Reconnected to ${maindata.length} guilds`);

    console.log(
      white("[") +
        green("INFO") +
        white("] ") +
        green(`${client.user.username} (${client.user.id})`) +
        white(` is Ready!`)
    );
    const activities = [
      `Argo | ${client.config.prefix}help`,
      `Argo | ${client.config.prefix}play`,
      `Argo | ${client.config.prefix}setup`,
      `Music | .gg/argomusic`
    ];
    setInterval(async () => {
      await client.user.setPresence({
        activities: [
          {
            name: `${
              activities[Math.floor(Math.random() * activities.length)]
            }`,
            type: 2,
          },
        ],
        status: "online",
      });
    }, 15000);
  });
};
