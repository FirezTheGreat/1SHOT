module.exports = {
    config: {
        name: "queue",
        category: "music",
        aliases: ["q"],
        usage: ", q",
        description: "Shows the music queue!",
        accessableby: "everyone"
    },
    run: async (bot, message, args, ops) => {

        let fetched = ops.active.get(message.guild.id);
        if(!fetched) return message.channel.send("❌ **Nothing playing right now**");

        let queue = fetched.queue;
        let nowPlaying = queue[0];

        let resp = `__**Now Playing:**__\n**${nowPlaying.songTitle}** -- **Requested By:** ${nowPlaying.requestedby}\n\n__**Queue**__\n`;

        for (var i = 1; i < queue.length; i++) {
            resp += `${i}. **${queue[i].songTitle}** -- **Requested By:** ${queue[i].requestedby}\n`;
        }

        message.channel.send(resp)
    }
}
