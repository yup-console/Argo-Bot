const { readdirSync } = require("fs")
const { white, green } = require("chalk");

module.exports = async (client) => {
    try {
        readdirSync("./src/commands/").forEach((dir) => {
          const commands = readdirSync(`./src/commands/${dir}`).filter((f) =>
            f.endsWith(".js")
          );
    
          for (const cmd of commands) {
            const command = require(`../commands/${dir}/${cmd}`);
            if (command.name) {
              client.mcommands.set(command.name, command);
            } else {
              console.log(`${cmd} is not ready`);
            }
          }
        });
        console.log(white('[') + green('INFO') + white('] ') + green('Command ') + white('Events') + green(' Loaded!'));
      } catch (error) {
        console.log(error);
      }
};