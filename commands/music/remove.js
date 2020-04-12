module.exports = {
    config: {
        name: "remove",
        aliases: ["rs"],
        category: "music",
        description: "Remove Song In A Queue!",
        usage: "[song number]",
        acessableby: "everyone"
    },
    run: async (bot, message, args, ops) => {
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('I\'m sorry but you need to be in a voice channel to remove a particular song number!');
        if (message.guild.me.voice.channel !== message.member.voice.channel) {
            return message.channel.send("**You Have To Be In The Same Channel With The Bot!**");
        };
        const serverQueue = ops.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('❌ **Nothing playing in this server**');

        if (args[0] < 1 && args[0] >= serverQueue.songs.length) {
            return message.channel.send('Please enter a valid song number');
        }
        serverQueue.songs.splice(args[0] - 1, 1);
        return message.channel.send(`Removed song number ${args[0]} from queue`);
    }
};