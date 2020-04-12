const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
    config: {
        name: "balance",
        aliases: ["bal"],
        category: "economy",
        description: "Shows Current Balance",
        usage: "[mention | ID](optional)",
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        let bal = db.fetch(`money_${message.guild.id}_${user.id}`)

        if (bal === null) bal = 0;

        let bank = await db.fetch(`bank_${message.guild.id}_${user.id}`)
        if (bank === null) bank = 0;

        let moneyEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`**${user.user.username}'s Balance**\n\nPocket: ${bal}\nBank: ${bank}`);
        message.channel.send(moneyEmbed)
    }
}