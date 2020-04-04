const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs")
const { stripIndents } = require("common-tags")
const { cyan } = require("../../colours.json")

const prefix = "!";

module.exports = {
    config: {
        name: "help",
        aliases: ["h"],
        usage: " ",
        category: "info",
        description: "Displays all commands that the bot has.",
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {
        const embed = new MessageEmbed()
            .setColor(cyan)
            .setAuthor(`${message.guild.me.displayName} Help`, message.guild.iconURL())
            .setThumbnail(bot.user.displayAvatarURL())

        if (!args[0]) {

            const sembed = new MessageEmbed()
            .setAuthor(`${message.guild.me.displayName}`, message.guild.iconURL())
            .setColor("GREEN")
            .setDescription('Message has been sent to you dms!')
            message.channel.send(sembed).then(msg => {
                msg.delete({timeout: 10000});
            })

            const categories = readdirSync("./commands/")

            embed.setDescription(`These are the available commands for ${message.guild.me.displayName}\nThe bot prefix is: **${prefix}**`)
            embed.setFooter(`${message.guild.me.displayName} | Total Commands: ${bot.commands.size}`, bot.user.displayAvatarURL());

            categories.forEach(category => {
                const dir = bot.commands.filter(c => c.config.category === category)
                const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1)
                try {
                    embed.addField(` ${capitalise} [${dir.size}]:`, dir.map(c => `\`${c.config.name}\``).join(" "))
                } catch (e) {
                    console.log(e)
                }
            })

            return message.author.send(embed)
        } else {
            let command = bot.commands.get(bot.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase())
            if (!command) return message.channel.send(embed.setTitle("Invalid Command.").setDescription(`Do \`${prefix}help\` for the list of the commands.`))
            command = command.config

            embed.setDescription(stripIndents `The bot's prefix is: \`${prefix}\`\n
            ** Command:** ${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}\n
            ** Description:** ${command.description || "No Description provided."}\n
            ** Usage:** ${command.usage ? `\`${prefix}${command.name} ${command.usage}\`` : "No Usage"}\n
            ** Accessible by:** ${command.accessableby || "everyone"}\n
            ** Aliases:** ${command.aliases ? command.aliases.join(", ") : "None."}`)
            embed.setFooter(message.guild.name, message.guild.iconURL())

            return message.channel.send(embed)
        }
    }
}
