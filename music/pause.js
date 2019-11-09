module.exports = {
    config: {
        name: "pause",
        category: "music",
        description: "Pauses music",
        usage: " ",
        accessableby: "everyone",
    }, 
    run: async (bot, message, args, ops) => {

        let fetched = ops.active.get(message.guild.id)
        if(!fetched) return message.channel.send("**There is currently no music being played!**");

        if(message.member.voiceChannel !== message.guild.me.voiceChannel) return message.channel.send("**Sorry, you are not in the same vc with the bot!**");

        if(fetched.dispatcher.paused) return message.channel.send("**Already paused!**");

        fetched.dispatcher.pause();

        message.channel.send(`**Succesfully Paused ${fetched.queue[0].songTitle}**`);
    }
}
