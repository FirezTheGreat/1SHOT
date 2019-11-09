const ytdl = require("ytdl-core");
const active = new Map()
module.exports = {
    config: {
        name: "play",
        category: "music",
        aliases: ["p"],
        description: "Plays Music.",
        usage: ", p (link)",
        accessableby: "everyone"
    },
    run: async (bot, message, args, ops) => {
        if (!message.member.voiceChannel) return message.channel.send("❌ **You have to be in a voice channel to use this command.**");

        if (!args[0]) return message.channel.send("**Give a link!**");

        let validate = await ytdl.validateURL(args[0]);
        if (!validate) {

            let commandFile = require(`./search.js`);
            return commandFile.run(bot, message, args, ops);
        }

        let info = await ytdl.getInfo(args[0]);

        let data = ops.active.get(message.guild.id) || {};
        if (!data.connection) data.connection = await message.member.voiceChannel.join();
        if (!data.queue) data.queue = [];
        data.guildID = message.guild.id;

        data.queue.push({
            songTitle: info.title,
            requestedby: message.author.tag,
            url: args[0],
            announceChannel: message.channel.id
        });

        if (!data.dispatcher) play(bot, ops, data);
        else {
            message.channel.send(`Added To Queue: ${info.title} | Requested By: ${message.author.tag}`);
        }
        ops.active.set(message.guild.id, data);
    }

    
}
async function play(bot, ops, data) {
    bot.channels.get(data.queue[0].announceChannel).send(`Now Playing: ${data.queue[0].songTitle} | Requested By: ${data.queue[0].requestedby}`);

    data.dispatcher = await data.connection.playStream(ytdl(data.queue[0].url, { filter: "audioonly" }));
    data.dispatcher.guildID = data.guildID;

    data.dispatcher.once('finish', function () {
        finish(bot, ops, this);
    });
}
function finish(bot, ops, dispatcher) {

    let fetched = ops.active.get(dispatcher.guildID);

    fetched.queue.shift();
    if (fetched.queue.length > 0) {
        ops.active.set(dispatcher.guildID, fetched);

        play(bot, ops, fetched);
    } else {
        ops.active.delete(dispatcher.guildID);

        let vc = bot.guilds.get(dispatcher.guildID).me.voiceChannel;
        if (!vc) vc.leave();
    }
}
