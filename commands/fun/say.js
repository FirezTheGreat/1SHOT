const { RichEmbed } = require("discord.js");
const { greenlight } = require("../../colours.json")

module.exports = {
    config: {
    name: "say",
    category: "fun",
    noalias: "No Aliases",
    description: "Says your input via the bot",
    usage: "[text]",
    accessableby: "everyone"
    },
    run: (bot, message, args) => {

        if (args.length === 0)
            return message.reply("No")
            message.delete(2000)

            const embed = new RichEmbed()
                .setDescription(args.join(" "))
                .setColor(greenlight);

            message.channel.send(embed);
        
    }
}
