
module.exports = {
    config: {
        name: 'resume',
        aliases: ["res"],
        category: "music",
        description: 'Resume command.',
        usage: "resumes music",
        accessableby: "everyone"
    },
    run: async(bot, message, args, ops) => {
        const serverQueue = ops.queue.get(message.guild.id);
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return message.channel.send('▶ **Resumed**');
        }
        return message.channel.send('There is nothing playing.');
    }
};
