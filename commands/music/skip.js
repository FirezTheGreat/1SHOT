module.exports = {
    config: {
        name: 'skip',
        aliases: ['s'],
        category: "music",
        description: 'Skip command.',
        usage: "skips the song playing",
        accessableby: 'everyone',
    },
run: async(bot, message, args, ops) => {
        const { voiceChannel } = message.member;
        if (!voiceChannel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
        const serverQueue = ops.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('❌ **Nothing playing in this server**');
        serverQueue.connection.dispatcher.end()
        return message.channel.send('⏩ Skipped')
    }
};