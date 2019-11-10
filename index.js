const { Client, Attachment, RichEmbed, Collection, Util } = require('discord.js');
const { TOKEN, PREFIX, GOOGLE_API_KEY } = require('./config');
const queue = new Map();
const bot = new Client({ disableEveryone: true });
const fs = require("fs");

const YouTube = require("simple-youtube-api")
const youtube = new YouTube(GOOGLE_API_KEY);
const ytdl = require("ytdl-core");

bot.commands = new Collection();
bot.aliases = new Collection();

["aliases", "commands"].forEach(x => bot[x] = new Collection());
["console", "command", "event"].forEach(x => require(`./handler/${x}`)(bot));

bot.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {
    require(`./handler/${handler}`)(bot);
})

bot.on('guildMemberAdd', member => {

    const channel = member.guild.channels.find(channel => channel.name === "welcome");
    if (!channel) return;

    channel.send(`Welcome to our ${member}, please read the rules in the rules channel`)
});

bot.on('message', message => {
    if (message.content === 'noob') {
        const attachment = new Attachment('https://pics.me.me/thumb_no-u-no-u-43349136.png');
        message.channel.send(attachment);
    }
    if (message.content === '!av') {
        message.reply(message.author.avatarURL);
    }
    if (message.content.toLowerCase() === "Hello") {
        message.channel.send('Hi There!');
    }
});

bot.on('message', message => {
    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case 'prune':
            if (!args[1]) return message.reply('Please Define A Number')
            message.channel.bulkDelete(args[1]);
            message.delete();
            break;
    }
})

bot.on('message', async msg => { // eslint-disable-line
    if (msg.author.bot) return undefined;
    if (!msg.content.startsWith(PREFIX)) return undefined;

    const args = msg.content.split(' ');
    const searchString = args.slice(1).join(' ');
    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    const serverQueue = queue.get(msg.guild.id);

    let command = msg.content.toLowerCase().split(' ')[0];
    command = command.slice(PREFIX.length)

    if (msg.content.startsWith(`${PREFIX}play`)) {
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel) return msg.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if (!permissions.has('CONNECT')) {
            return msg.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
        }
        if (!permissions.has('SPEAK')) {
            return msg.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
        }

        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();

            for (const video of Object.values(videos)) {
                const video2 = await youtube.getVideoByID(video.id);
                await handleVideo(video2, msg, voiceChannel, true);
            }
            msg.channel.send(`Playlist: **${playlist.title}** has been added to the queue!`);
        } else {
            try {
                var video = await youtube.getVideo(url);
            } catch (error) {
                try {
                    var videos = await youtube.searchVideos(searchString, 1);
                    var video = await youtube.getVideoByID(videos[0].id);
                } catch (err) {
                    console.error(err)
                    return msg.channel.send('❌ **No matches**')
                }
            }
            return handleVideo(video, msg, voiceChannel);
        }

    } else if (msg.content.startsWith(`${PREFIX}skip`)) {
        if (!msg.member.voiceChannel) return msg.channel.send("You are not in a voice channel!");
        if (!serverQueue) return msg.channel.send('**❌ I am not connected to a voice channel**');
        serverQueue.connection.dispatcher.end();
        return msg.channel.send('✅ Successfully skipped!');
    } else if (msg.content.startsWith(`${PREFIX}leave`)) {
        if (!msg.member.voiceChannel) return msg.channel.send("You are not in a voice channel!");
        if (!serverQueue) return msg.channel.send('**❌ I am not connected to a voice channel**');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        return msg.channel.send('✅ Successfully disconnected');
    } else if (msg.content.startsWith(`${PREFIX}volume`)) {
        if (!serverQueue) return msg.channel.send("There is nothing playing");
        if (!args[1]) return msg.channel.send(`The current volume is: **${serverQueue.volume}**`);
        serverQueue.volume = args[1];
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
        return msg.channel.send(`I set the volume to: **${args[1]}**`);
    } else if (msg.content.startsWith(`${PREFIX}np`)) {
        if (!serverQueue) return msg.channel.send('There is nothing playing');
        return msg.channel.send(`Now playing: **${serverQueue.songs[0].title}**`);
    } else if (msg.content.startsWith(`${PREFIX}queue`)) {
        if (!serverQueue) return msg.channel.send("There is nothing playing");
        return msg.channel.send(`
__**Song QUEUE:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}

**Now PLaying:** ${serverQueue.songs[0].title}
        `);
    } else if (msg.content.startsWith(`${PREFIX}pause`)) {
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            return msg.channel.send("Paused!")
        } return msg.channel.send('**❌ I am not connected to a voice channel**');

    } else if (msg.content.startsWith(`${PREFIX}resume`)) {
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return msg.channel.send("Resumed");
        } return msg.channel.send('**❌ I am not connected to a voice channel**');
    }
    return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
    const serverQueue = queue.get(msg.guild.id);
    console.log(video);
    const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`
    };
    if (!serverQueue) {
        const queueConstruct = {
            textchannel: msg.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };
        queue.set(msg.guild.id, queueConstruct);

        queueConstruct.songs.push(song);
        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(msg.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.error(`I could not join the voice channel: ${error}`);
            queue.delete(msg.guild.id);
            return msg.channel.send(`I could not join the voice channel: ${error}`)
        }

    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        if (playlist) return undefined;
        else return msg.channel.send(`**${song.title}** has been added to queue!`)
    }
    return undefined;
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    console.log(serverQueue.songs)

    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', reason => {
            if (reason === 'Stream is not generating enough quickly') console.log('Song ended');
            console.log(reason);
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0])
        })
        .on('error', error => console.log(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

    serverQueue.textchannel.send(`Now playing: **${song.title}**`);
}


bot.login(TOKEN)
