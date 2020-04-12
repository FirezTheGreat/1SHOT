module.exports = {
    config: {
        name: 'pause',
        noalias: 'No Aliases',
        category: "music",
        description: 'Pause command.',
        usage: " ",
        accessableby: "everyone"
    },
    run: async (bot, message, args, ops) => {
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('I\'m sorry but you need to be in a voice channel to pause music!');
        if (message.guild.me.voice.channel !== message.member.voice.channel) {
            return message.channel.send("**You Have To Be In The Same Channel With The Bot!**");
        };
        const serverQueue = ops.queue.get(message.guild.id);
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause(true);
            return message.channel.send('**Paused** ⏸');
        }
        return message.channel.send('There is nothing playing.');
    }
};