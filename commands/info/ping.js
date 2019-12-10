const { RichEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "ping",
        category: "info",
        usage: " ",
        description: "Returns latency and API ping",
    },
    run: async (bot, message, args) => {
        const embed = new RichEmbed()
            .setColor("GREEN")
            .setDescription(`🏓 Pong!\nLatency is ${Math.floor(message.createdAt)}ms \nAPI Latency is ${Math.round(bot.ping)}ms`)
            .setTimestamp()
        return message.channel.send(embed);
    }
}