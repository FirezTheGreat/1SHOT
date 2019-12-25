module.exports = {
    config: {
        name: 'pause',
        noalias: [''],
        category: "music",
        description: 'Pause command.',
        usage: " ",
        accessableby: "everyone"
    },
    run: async (bot, message, args, ops) => {
        const serverQueue = ops.queue.get(message.guild.id);
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            return message.channel.send('**Paused** ⏸');
        }
        return message.channel.send('There is nothing playing.');
    }
};