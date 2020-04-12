const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
    config: {
        name: "profile",
        noalias: [""],
        category: "economy",
        description: "Shows profile of the user",
        usage: "[mention | ID](optional)",
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        let money = await db.fetch(`money_${message.guild.id}_${user.id}`)
        if (money === null) money = 0;

        let bank = await db.fetch(`bank_${message.guild.id}_${user.id}`)
        if (bank === null) bank = 0;

        let vip = await db.fetch(`bronze_${message.guild.id}_${user.id}`)
        if (vip === null) vip = 'None'
        if (vip === true) vip = 'Bronze'

        let shoes = await db.fetch(`nikes_${message.guild.id}_${user.id}`)
        if (shoes === null) shoes = '0'

        let newcar = await db.fetch(`car_${message.guild.id}_${user.id}`)
        if (newcar === null) newcar = '0'

        let newhouse = await db.fetch(`house_${message.guild.id}_${user.id}`)
        if (newhouse === null) newhouse = '0'

        let moneyEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`**${user.displayName}'s Profile**\n\nPocket: ${money}\nBank: ${bank}\nVIP Rank: ${vip}\n\n**Inventory**\n\nNikes: ${shoes}\nCars: ${newcar}\nMansion: ${newhouse}`);
        message.channel.send(moneyEmbed)
    }
}