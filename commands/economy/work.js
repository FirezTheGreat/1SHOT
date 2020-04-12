const db = require('quick.db')
const { MessageEmbed } = require('discord.js')
const ms = require("parse-ms");

module.exports = {
    config: {
        name: "work",
        aliases: ["wr"],
        category: "economy",
        description: "Work to Earn Money",
        usage: " ",
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {

        let user = message.author;
        let author = await db.fetch(`work_${message.guild.id}_${user.id}`)

        let timeout = 1800000;

        if (author !== null && timeout - (Date.now() - author) > 0) {
            let time = ms(timeout - (Date.now() - author));

            let timeEmbed = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`❌ You have already worked recently\n\nTry again in ${time.minutes}m ${time.seconds}s `);
            message.channel.send(timeEmbed)
        } else {

            let replies = ['Programmer', 'Builder', 'Waiter', 'Busboy', 'Chief', 'Mechanic']

            let result = Math.floor((Math.random() * replies.length));
            let amount = Math.floor(Math.random() * 80) + 1;
            let embed1 = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`✅ You worked as a ${replies[result]} and earned ${amount} coins`);
            message.channel.send(embed1)

            db.add(`money_${message.guild.id}_${user.id}`, amount)
            db.set(`work_${message.guild.id}_${user.id}`, Date.now())
        };
    }
}