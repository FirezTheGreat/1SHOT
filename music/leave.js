module.exports = {
    config: {
        name: "leave",
        usage: ", dc",
        category: "music",
        description: "Leaves voice channel.",
        accessableby: "everyone"
    },
    
    
    run: async(bot, message, args, ops) => {
    if(!message.member.voiceChannel) return message.channel.send("**Please connect to a voice channel!**");

    if(!message.guild.me.voiceChannel) return message.channel.send("❌ **I am not connected to a voice channel!**");

    if(message.guild.me.voiceChannelID !== message.member.voiceChannelID) return message.channel.send("Sorry, you aren\'t connected to the voice channel.");
    
    message.guild.me.voiceChannel.leave();

    message.channel.send("✅ **Succesfully Disconnected!**")
}
}
