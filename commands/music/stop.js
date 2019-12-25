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
		const { voiceChannel } = message.member;
		if (!voiceChannel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		const serverQueue = ops.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('There is nothing playing that I could stop for you.');
		serverQueue.songs = [];
        serverQueue.connection.dispatcher.end()
        return message.channel.send('👋 **Disconnected**')
	}
};