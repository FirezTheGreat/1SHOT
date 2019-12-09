const { Client, Attachment, RichEmbed, Collection, Util } = require('discord.js');
const { TOKEN, PREFIX, GOOGLE_API_KEY } = require('./config');
const queue = new Map();
const bot = new Client({ disableEveryone: true });
const fs = require("fs");

const YouTube = require("simple-youtube-api");
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

bot.on('guildMemberAdd', function (member) {

    const channel = member.guild.channels.find(channel => channel.name === "welcome");
    if (!channel) return;

    channel.send(`Welcome to our ${member}, please read the rules in the rules channel`);

    var r = member.guild.roles.find('name', 'Community');
    member.addRole(r)
});

bot.on('message', msg => {

    if (msg.content.toLowerCase() === 'noob') {
        const attachment = new Attachment('https://pics.me.me/thumb_no-u-no-u-43349136.png');
        msg.channel.send(attachment);
    }
    if (msg.content.toLowerCase() === `${PREFIX}av`) {
        msg.channel.send(msg.author.avatarURL);
    }
    if (msg.content === "Hello") {
        msg.channel.send('Hi There!');
    }
    if (msg.content.toLowerCase() === `${PREFIX}link`) {
        msg.channel.send("https://discordapp.com/oauth2/authorize?client_id=635668132308058142&permissions=8&scope=bot")
    }
});

bot.on('message', async msg => {
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
        if (!voiceChannel) return msg.channel.send('❌ **You have to be in a voice channel to use this command.**');

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
            return msg.channel.send(`Playlist: **${playlist.title}** has been added to the queue!`);
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

    }else if (msg.content.startsWith(`${PREFIX}search`)) {
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel) return msg.channel.send("You are not in a voice channel!");

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
        }
        else {
            try {

                var video = await youtube.getVideo(url);
            } catch (error) {
                try {
                    var videos = await youtube.searchVideos(searchString, 10);
                    let index = 0;
                    const sembed = new RichEmbed()
                        .setColor("GREEN")
                        .setFooter(msg.member.displayName, msg.author.avatarURL)
                        .setDescription(`
                    __**Song selection:**__\n
                    ${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
                    \nPlease provide a value to select one of the search results ranging from 1-10.
                                    `)
                        .setTimestamp();        
                    msg.channel.send(sembed).then(msg2 => msg2.delete(10000))
                    try {
                        var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
                            maxMatches: 1,
                            time: 10000,
                            errors: ['time']
                        });
                    } catch (err) {
                        console.log(err);
                        return msg.channel.send('❌ **Timeout!**')
                    }
                    const videoIndex = parseInt(response.first().content);
                    var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                } catch (err) {
                    console.error(err);
                    return msg.channel.send('🆘 I could not obtain any search results.');
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
        if (!serverQueue) return msg.channel.send("**There is nothing playing**");
        if (!args[1]) return msg.channel.send(`The current volume is: **${serverQueue.volume}**`);
        serverQueue.volume = args[1];
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
        return msg.channel.send(`I set the volume to: **${args[1]}**`);
    } else if (msg.content.startsWith(`${PREFIX}np`)) {
        if (!serverQueue) return msg.channel.send('**There is nothing playing**');
        return msg.channel.send(`Now playing: **${serverQueue.songs[0].title}**`);
    } else if (msg.content.startsWith(`${PREFIX}queue`)) {
        if (!serverQueue) return msg.channel.send("**There is nothing playing**");
        const embed = new RichEmbed()
            .setColor("GREEN")
            .setTimestamp()
            .setTitle("__**Song QUEUE:**__\n")
            .setDescription(`${serverQueue.songs.map(song => `**${song.title}**\n`).join('\n')}\n\n🔻**__Now Playing__:**🔻\n ${serverQueue.songs[0].title}\n\n **Requested By:** ${msg.author.username}`);
        msg.channel.send(embed)
    } else if (msg.content.startsWith(`${PREFIX}pause`)) {
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            return msg.channel.send("Paused!");
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
            play(msg.guild, queueConstruct.songs[0], msg);
        } catch (error) {
            console.error(`I could not join the voice channel: ${error}`);
            queue.delete(msg.guild.id);
            return undefined;
        }

    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        if (playlist) return undefined;
        else {
            const embed = new RichEmbed()
                .setColor("GREEN")
                .setTitle("Added To Queue")
                .setTimestamp()
                .addField(`**${song.title}** has been added to queue! | Requested By **${msg.author.username}**`)
                .setFooter(msg.member.displayName, msg.author.displayAvatarURL);
            msg.channel.send(embed)
        }
    }
    return undefined;
}

function play(guild, song, msg) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave()
        queue.delete(guild.id);
        return;
    }


    const dispatcher = serverQueue.connection.playStream(ytdl(song.url, { filter: "audioonly", highWaterMark: 1 << 20, }, {bitrate: 192000 }))
        .on('end', reason => {
            if (reason === 'Stream is not generating enough quickly') console.log(reason);
            else console.log('Song ended');
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0])

        })
        .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

    const embed = new RichEmbed()
        .setColor("GREEN")
        .setTitle('Now Playing\n')
        .setTimestamp()
        .setDescription(`🎵 Now playing:\n **${song.title}** 🎵 | Requested By: ${msg.author.username}`)
        .setFooter(msg.member.displayName, msg.author.displayAvatarURL);
    serverQueue.textchannel.send(embed);

};

bot.login(TOKEN);
