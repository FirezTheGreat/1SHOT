module.exports = {
    config: {
        name: "skip",
        category: "music",
        aliases: ["s"],
        description: "Skips a song",
        usage: ", s",
        accessableby: "everyone",
    }, 
    run: async (bot, message, args, ops) => {

        let fetched = ops.active.get(message.guild.id);
        if(!fetched) return message.channel.send("❌ **Nothing playing right now!**");

        if(message.member.voiceChannel !== message.guild.me.voiceChannel) return message.channel.send("Sorry you are currently aren\'t in the same channel as bot!");

        let userCount = message.member.voiceChannel.members.size;

        let required = Math.ceil(userCount/2);

        if (!fetched.queue[0].voteSkips) fetched.queue[0].voteSkips = [];

        if(fetched.queue[0].voteSkips.includes(message.member.id)) return message.channel.send(`**Sorry, you already voted to skip!** ${fetched.queue[0].voteSkips.length}/${required} required.`);
        fetched.queue[0].voteSkips.push(message.member.id);

        ops.active.set(message.guild.id, fetched);

        if(fetched.queue[0].voteSkips.length >= required) {
            message.channel.send("✅ **Succesfully skipped song!**");

            return fetched.dispatcher.emit("finish");

        }

        message.channel.send(`**Succesfully Voted To Skip! ${fetched.queue[0].voteSkips.length}/${required} required`);
    }


}
