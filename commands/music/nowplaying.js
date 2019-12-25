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
        return message.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`);
    }
};