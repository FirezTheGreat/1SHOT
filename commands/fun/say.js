const { MessageEmbed } = require("discord.js");
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
            return message.channel.send("No")
        message.delete({timeout: 1000})

        const embed = new MessageEmbed()
            .setDescription(args.join(" "))
            .setColor(greenlight);

        message.channel.send(embed)


    }
}
