const db = require('quick.db');

module.exports = {
    config: {
        name: "setmuterole",
        category: "moderation",
        aliases: ['setmute', 'smrole', 'smr'],
        description: "Sets A Mute Role For Muted Users!",
        usage: "[role name | role mention | role ID]",
        accessableby: "Administrators"
    },
    run: async (bot, message, args) => {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("**You Do Not Have The Required Permissions! - [ADMINISTRATOR]**")
        if (!args[0]) return message.channel.send("**Please Enter A Role Name or ID!**")

        let role = message.mentions.roles.first() || bot.guilds.cache.get(message.guild.id).roles.cache.get(args[0]) || message.guild.roles.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase());

        if (!role) return message.channel.send("**Please Enter A Valid Role Name or ID!**")

        try {
            let a = await db.fetch(`muterole_${message.guild.id}`)

            if (role.id === a) {
                return message.channel.send("**This Role is Already Set As Muterole!**")
            } else {
                db.set(`muterole_${message.guild.id}`, role.id)

                message.channel.send(`**\`${role.name}\` Has Been Set Successfully As Muterole!**`)
            }
        } catch (e) {
            return message.channel.send("**Error - `Missing Permissions or Role Doesn't Exist!`**", `\n${e.message}`)
        }
    }
}