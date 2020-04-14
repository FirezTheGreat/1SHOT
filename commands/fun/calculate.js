const Discord = require('discord.js');
const math = require('mathjs');

module.exports = {
    config: {
        name: "calculate",
        aliases: ['calc', 'calculator'],
        description: "Shows Calculated Answers Of User's Query",
        usage: "[query](mathematical)",
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {

        if (!args[0]) return message.channel.send("**Enter Something To Calculate**");

        let result;
        try {
            result = math.evaluate(args.join(" ").replace(/[x]/gi, "*").replace(/[,]/g, ".").replace(/[÷]/gi, "/"));
        } catch (e) {
            return message.channel.send("**Enter Valid Calculation!**");
        }

        let embed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor(`${bot.user.username} Calculator`, message.author.displayAvatarURL({ dynamic: true }))
            .addField("**Operation**", `\`\`\`Js\n${args.join("").replace(/[x]/gi, "*").replace(/[,]/g, ".").replace(/[÷]/gi, "/")}\`\`\``)
            .addField("**Result**", `\`\`\`Js\n${result}\`\`\``)
            .setFooter(message.guild.name, message.guild.iconURL());
        message.channel.send(embed);
    }
}