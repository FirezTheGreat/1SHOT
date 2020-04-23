module.exports = {
    config: {
        name: "purge",
        aliases: ["delete", "clear"],
        category: "moderation",
        description: "Deletes messages from a channel",
        usage: "delete [amount of messages]",
        accessableby: "Administrator"
    },
    run: async (bot, message, args) => {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You Don't Have Sufficient Permissions!")
        if (isNaN(args[0]))
            return message.channel.send('**Please supply a valid amount to purges messages**');

        if (args[0] > 100)
            return message.channel.send("**Please supply a number less than 100**");

        if (args[0] < 1)
            return message.channel.send("**Please supply a number more than 1 or 1**");

        message.channel.bulkDelete(args[0])
            .then(messages => message.channel.send(`**Succesfully deleted \`${messages.size}/${args[0]}\` messages**`).then(msg => msg.delete({ timeout: 2000 })))
    }
}