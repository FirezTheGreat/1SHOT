const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
    config: {
        name: "addmoney",
        aliases: ["am"],
        category: "economy",
        description: "Adds Money to a user",
        usage: "[mention | ID]",
        accessableby: "Administrator, Owner"
    },
    run: async (bot, message, args) => {
        if (!message.member.hasPermission("ADMINISTRATOR", "MANAGE_GUILD")) return message.channel.send("❌ You do not have permissions to add money!");

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (isNaN(args[1])) return message.channel.send(`❌ Your Amount Is Not A Number!`);
        db.add(`money_${message.guild.id}_${user.id}`, args[1])
        let bal = await db.fetch(`money_${message.guild.id}_${user.id}`)

        let moneyEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`✅ Added ${args[1]} coins\n\nNew Balance: ${bal}`);
        message.channel.send(moneyEmbed)

    }
}