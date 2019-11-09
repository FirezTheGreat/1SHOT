module.exports = {
    config: {
        name: "resume",
        category: "music",
        noaliases: "",
        description: "Resumes music",
        usage: " ",
        accessableby: "everyone",
    }, 
    run: async (bot, message, args, ops) => {

        let fetched = ops.active.get(message.guild.id)
        if(!fetched) return message.channel.send("**There is currently no music being played!**");

        if(message.member.voiceChannel !== message.guild.me.voiceChannel) return message.channel.send("**Sorry, you are not in the same vc with the bot!**");

        if(!fetched.dispatcher.paused) return message.channel.send("**This music is not paused!**");

        fetched.dispatcher.resume();

        message.channel.send(`**Succesfully Resumed ${fetched.queue[0].songTitle}**`);
    }
}
