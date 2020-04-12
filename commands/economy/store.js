const { MessageEmbed } = require('discord.js')

module.exports = {
    config: {
        name: "store",
        noalias: [""],
        category: "economy",
        description: "Shows list of items",
        usage: " ",
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {

        let embed = new MessageEmbed()
            .setDescription("**VIP Ranks**\n\nBronze: 200 Coins [.buy/.sell bronze]\n\n**Lifestyle Items**\n\nFresh Nikes: 600 [.buy/.sell nikes]\nCar: 800 [.buy/.sell car]\nMansion: 1200 [.buy/.sell mansion]")
            .setColor("GREEN")
        message.channel.send(embed)
    }
}