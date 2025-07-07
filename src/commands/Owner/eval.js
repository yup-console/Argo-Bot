const { EmbedBuilder } = require("discord.js");
const { inspect } = require(`util`);
module.exports = {
    name: "eval",
    aliases: ["jadu","jsk"],
    description: "Eval Command",
    // userPermissions: PermissionFlagsBits.SendMessages,
    // botPermissions: PermissionFlagsBits.SendMessages,
    category: "Owner",
    ownerOnly: false,
    run: async (client, message, args, prefix) => {
      let sumant = ['958583892326117437'];
      if (!sumant.includes(message.author.id)) return;
        else{
            if(!args[0])
            {
                return message.channel.send({embeds : [new EmbedBuilder().setColor(client.color).setDescription(`<:Crossmark:1286524517417750613> | Provide me something to evaluate`)]})
            }
            let ok;
            try{
                ok = await eval(args.join(' '));
                ok = inspect(ok,{depth : 0});
            } catch(e) { ok = inspect(e,{depth : 0}) }
            let em = new EmbedBuilder().setColor(client.color).setDescription(`\`\`\`js\n${ok}\`\`\``);
            return message.channel.send({embeds : [em]});
        }
    }
}