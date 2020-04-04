const { MessageEmbed } = require('discord.js')

module.exports = {
    config: {
        name: 'nowplaying',
        category: "music",
        aliases: ["np"],
        description: 'Now playing command.',
        usage: "Shows current song playing",
        accessableby: "everyone"
    },
    run: async (bot, message, args, ops) => {
        const serverQueue = ops.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('❌ **Nothing playing in this server**');
        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle('Now Playing\n')
            .setThumbnail(serverQueue.songs[0].thumbnail)
            .setTimestamp()
            .setDescription(`🎶 Now playing: **${serverQueue.songs[0].title}**`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL());
        message.channel.send(embed);
        return undefined;
    }
};