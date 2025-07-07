const client = require("../index");

module.exports = async (client) => {

client.manager.shoukaku.on("ready", (name) =>
  console.log(`Lavalink ${name}: Ready!`)
);
client.manager.shoukaku.on("error", (name, error) =>
  console.error(`Lavalink ${name}: Error Caught,`, error)
);
client.manager.shoukaku.on("close", (name, code, reason) =>
  console.warn(
    `Lavalink ${name}: Closed, Code ${code}, Reason ${reason || "No reason"}`
  )
);
client.manager.shoukaku.on("debug", (name, info) =>
  console.debug(`Lavalink ${name}: Debug,`, info)
);
client.manager.shoukaku.on("disconnect", (name, players, moved) => {
  if (moved) return;
  players.forEach((player) => player.connection.disconnect());
  console.warn(`Lavalink ${name}: Disconnected`);
});
}