const { MessageEmbed }= require("discord.js");
const db = require("quick.db");

module.exports = {
    config: {
        name: "removemoney",
        aliases: ["rm"],
        category: "economy",
        description: "Removes money from a user",
        usage: "[mention | ID](optional)",
        accessableby: "Administrator, Owner"
    },
    run: async (bot, message, args) => {
        if (!message.member.hasPermission("ADMINISTRATOR", "MANAGE_GUILD")) return message.channel.send("❌ You do not have permissions to remove money!");

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!args[0]) return message.channel.send("Mention A User!")
      
        if (isNaN(args[1])) return;
        db.subtract(`money_${message.guild.id}_${user.id}`, args[1])
        let bal = await db.fetch(`money_${message.guild.id}_${user.id}`)

        let moneyEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`✅ Removed ${args[1]} coins\n\nNew Balance: ${bal}`);
        message.channel.send(moneyEmbed)

    }
}