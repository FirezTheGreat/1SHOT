const { RichEmbed } = require("discord.js");
const { green_light } = require("../../colours.json")

module.exports = {
    config: {
    name: "say",
    category: "fun",
    description: "Says your input via the bot",
    usage: "[text]",
    },
    run: (bot, message, args) => {

        if (args.length === 0)
            return message.reply("No")
            message.delete()

            const embed = new RichEmbed()
                .setDescription(args.join(" "))
                .setColor(green_light);

            message.channel.send(embed);
        
    }
}
