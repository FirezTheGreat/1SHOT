module.exports = {
    config: {
        name: 'stop',
        aliases: ['leave'],
        category: "music",
        description: "stops the music playing",
        usage: ', leave',
        acessableby: "everyone"
    },
    run: async (bot, message, args, ops) => {
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('I\'m sorry but you need to be in a voice channel to stop music!');
        if (message.guild.me.voice.channel !== message.member.voice.channel) {
            return message.channel.send("**You Have To Be In The Same Channel With The Bot!**");
          }
        const serverQueue = ops.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('There is nothing playing that I could stop for you.');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end()
        return message.channel.send('👋 **Disconnected**')
    }
};