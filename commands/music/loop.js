module.exports = {
    config: {
        name: 'loop',
        aliases: ["repeat"],
        category: "music",
        description: 'Repeats all songs in the queue',
        usage: "loops the music",
        accessableby: "everyone"
    },
    run: async (bot, message, args, ops) => {
        const serverQueue = ops.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('There is nothing playing.');

        if (!serverQueue.loop) {
            serverQueue.loop = true;
            return message.channel.send('🔁 The queue repeat has been enabled.');
        } else {
            serverQueue.loop = false;
            return message.channel.send('🔁 The queue repeat has been disabled.');
        }
    }
};