const { MessageEmbed } = require('discord.js')
const db = require('quick.db')
const PREFIX = "."

module.exports = {
    config: {
        name: "buy",
        noalias: [""],
        category: "economy",
        description: "buys items",
        usage: "[item]",
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {
        if (!message.content.startsWith('.')) return;

        let user = message.author;

        let author = db.fetch(`money_${message.guild.id}_${user.id}`)

        let Embed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`❌ You need 200 coins to purchase Bronze VIP`);


        if (args[0] == 'bronze') {
            if (author < 200) return message.channel.send(Embed)

            db.fetch(`bronze_${message.guild.id}_${user.id}`);
            db.set(`bronze_${message.guild.id}_${user.id}`, true)

            let Embed2 = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`✅ Purchased Bronze VIP For 200 Coins`);

            db.subtract(`money_${message.guild.id}_${user.id}`, 200)
            message.channel.send(Embed2)
        } else if (args[0] == 'nikes') {
            let Embed3 = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`❌ You need 600 coins to purchase some Nikes`);

            if (author < 600) return message.channel.send(Embed3)

            db.fetch(`nikes_${message.guild.id}_${user.id}`)
            db.add(`nikes_${message.guild.id}_${user.id}`, 1)

            let Embed4 = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`✅ Purchased Fresh Nikes For 600 Coins`);

            db.subtract(`money_${message.guild.id}_${user.id}`, 600)
            message.channel.send(Embed4)
        } else if (args[0] == 'car') {
            let Embed5 = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`❌ You need 800 coins to purchase a new car`);

            if (author < 800) return message.channel.send(Embed5)

            db.fetch(`car_${message.guild.id}_${user.id}`)
            db.add(`car_${message.guild.id}_${user.id}`, 1)

            let Embed6 = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`✅ Purchased a New Car For 800 Coins`);

            db.subtract(`money_${message.guild.id}_${user.id}`, 800)
            message.channel.send(Embed6)
        } else if (args[0] == 'mansion') {
            let Embed7 = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`❌ You need 1200 coins to purchase a Mansion`);

            if (author < 1200) return message.channel.send(Embed7)

            db.fetch(`house_${message.guild.id}_${user.id}`)
            db.add(`house_${message.guild.id}_${user.id}`, 1)

            let Embed8 = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`✅ Purchased a Mansion For 1200 Coins`);

            db.subtract(`money_${message.guild.id}_${user.id}`, 1200)
            message.channel.send(Embed8)
        } else {
            if (message.content.toLowerCase() === `${PREFIX}buy`) {
                let embed9 = new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`❌ Enter an item to buy. Type ${PREFIX}store to see list of items`)
                return message.channel.send(embed9)
            }
        }
    }
}