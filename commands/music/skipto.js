module.exports = {
    config: {
        name: "skipto",
        noalias: "",
        category: "music",
        description: "Skips To A Particular Song In Queue",
        usage: "[song number](put acc. to distance between songs)",
        accessableby: "everyone"
    },
    run: async (bot, message, args, ops) => {
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('I\'m sorry but you need to be in a voice channel to skip to a particular song!');
        const serverQueue = ops.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('❌ **Nothing playing in this server**');

        if (message.guild.me.voice.channel !== message.member.voice.channel) {
            return message.channel.send("**You Have To Be In The Same Channel With The Bot!**");
          }

        if (args[0] < 1 && args[0] >= serverQueue.songs.length) {
            return message.channel.send('Please enter a valid song number');
        }

        serverQueue.songs.splice(0, args[0] - 2);
        serverQueue.connection.dispatcher.end();
        return;
    }
};
