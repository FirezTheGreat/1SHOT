const { RichEmbed } = require('discord.js');

module.exports = {
    config: {
        name: "poll",
        description: "polling",
        noalias: "No Aliases",
        category: "info",
        usage: " [question]",
        accessableby: "Administrator",
    },
    run: async (bot, message, args) => {
        if (!message.member.hasPermission('ADMINISTRATOR'))
            return undefined;

        if (!args[0])
            return undefined;

        const embed = new RichEmbed()
            .setColor("GREEN")
            .setTitle(`Poll for 1SHOT Sever`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setDescription(args.join(' '))
            .setTitle(`Poll by ${message.author.username}`);
        var msg = await message.channel.send(embed);

        await msg.react('✅');
        await msg.react('❌');

        message.delete({ timeout: 1000 });
    }
}
