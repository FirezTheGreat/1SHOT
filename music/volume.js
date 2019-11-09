module.exports = {
    config: {
        name: "volume",
        category: "music",
        aliases: ["v"],
        description: "Resumes music",
        usage: " ",
        accessableby: "everyone",
    }, 
    run: async (bot, message, args, ops) => {

        let fetched = ops.active.get(message.guild.id)
        if(!fetched) return message.channel.send("**There is currently no music being played!**");

        if(message.member.voiceChannel !== message.guild.me.voiceChannel) return message.channel.send("**Sorry, you are not in the same vc with the bot!**");

        if (isNaN(args[0]) || args[0] > 200 || args[0] < 0) return message.channel.send("Please input a number between 0-200");

        fetched.dispatcher.setVolume(args[0]/100);

        message.channel.send(`**Succesfully Set The Volume To ${fetched.queue[0].songTitle} to ${args[0]}**`);
    }
}
