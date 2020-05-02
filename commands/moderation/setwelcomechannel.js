const db = require("quick.db")

module.exports = {
    config: {
        name: "setwelcomechannel",
        category: "moderation",
        aliases: ['setwc', 'swc', 'sw'],
        description: "Sets A Channel Where The Bot Can Welcome Users!",
        usage: "[channel mention | channel ID | channel name]",
        accessableby: "Administrators"
    },
    run: async (bot, message, args) => {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("**You Do Not Have The Required Permissions! - [ADMINISTRATOR]**")
        if (!args[0]) return message.channel.send("**Please Enter Channel Name or ID!**")

        let channel = message.mentions.channels.first() || bot.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase());
        if (!channel) return message.channel.send("**Please Enter A Valid Channel Name or ID!**")

        try {            
            let a = await db.fetch(`welcome_${message.guild.id}`)

            if (a === channel.id) {
                return message.channel.send("**This Channel is Already Set As Welcome Channel**")
            } else {
                bot.guilds.cache.get(message.guild.id).channels.cache.get(channel.id).send("**Welcome Channel Set!**")
                db.set(`welcome_${message.guild.id}`, channel.id)

                message.channel.send(`**Welcome Channel Has Been Set Successfully in \`${channel.name}\`**`)
            }
            return;
        } catch (e) {
            return message.channel.send("**Error - `Missing Permissions or Channel Doesn't Exist`**")
        }
    }

};