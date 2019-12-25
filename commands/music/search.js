const { RichEmbed, Util } = require("discord.js")

module.exports = {
    config: {
        name: "search",
        category: "music",
        noalias: [''],
        description: "Searches music from YouTube",
        usage: " ",
        accessableby: "everyone"
    },
    run: async (bot, message, args, ops) => {

        const YouTube = require("simple-youtube-api");
        const youtube = new YouTube(process.env.GOOGLE_API_KEY);
        const ytdl = require('ytdl-core')

        const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
        const searchString = args.slice(1).join(' ');

        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return message.channel.send("You are not in a voice channel!");

        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) {
            return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
        }
        if (!permissions.has('SPEAK')) {
            return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
        }

        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();

            for (const video of Object.values(videos)) {
                const video2 = await youtube.getVideoByID(video.id);
                await handleVideo(video2, message, voiceChannel, true);
            }
        }
        else {
            try {

                var video = await youtube.getVideo(url);
                console.log(video)
            } catch (error) {
                try {
                    var videos = await youtube.searchVideos(searchString, 10);
                    let index = 0;
                    const sembed = new RichEmbed()
                        .setColor("GREEN")
                        .setFooter(message.member.displayName, message.author.avatarURL)
                        .setDescription(`
                    __**Song selection:**__\n
                    ${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
                    \nPlease provide a value to select one of the search results ranging from 1-10.
                                    `)
                        .setTimestamp();
                    message.channel.send(sembed).then(message2 => message2.delete(10000))
                    try {
                        var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
                            maxMatches: 1,
                            time: 10000,
                            errors: ['time']
                        });
                    } catch (err) {
                        console.log(err);
                        return message.channel.send('❌ **Timeout!**')
                    }
                    const videoIndex = parseInt(response.first().content);
                    var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                } catch (err) {
                    console.error(err);
                    return message.channel.send('🆘 I could not obtain any search results.');
                }
            }
            return handleVideo(video, message, voiceChannel);

        }

        async function handleVideo(video, message, voiceChannel, playlist = false) {
            const serverQueue = ops.queue.get(message.guild.id);
            const song = {
                id: video.id,
                title: Util.escapeMarkdown(video.title),
                url: `https://www.youtube.com/watch?v=${video.id}`,
                thumbnail: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
            };
            if (!serverQueue) {
                const queueConstruct = {
                    textchannel: message.channel,
                    voiceChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    volume: 2,
                    playing: true
                };
                ops.queue.set(message.guild.id, queueConstruct);
                queueConstruct.songs.push(song);
                try {
                    var connection = await voiceChannel.join();
                    queueConstruct.connection = connection;
                    play(message.guild, queueConstruct.songs[0], message);
                } catch (error) {
                    console.error(`I could not join the voice channel: ${error}`);
                    ops.queue.delete(message.guild.id);
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
                        .setThumbnail(song.thumbnail)
                        .setTimestamp()
                        .setDescription(`**${song.title}** has been added to queue!`)
                        .setFooter(message.member.displayName, message.author.displayAvatarURL);
                    message.channel.send(embed)
                }
            }
            return undefined;
        }
        async function play (guild, song, msg) {
            const serverQueue = ops.queue.get(guild.id);
        
            if (!song) {
                serverQueue.voiceChannel.leave()
                ops.queue.delete(guild.id);
                return;
            }
        
            const dispatcher = serverQueue.connection.playStream(await ytdl(song.url, { filter: "audioonly", highWaterMark: 1 << 20 }, {bitrate: 192000 }))
                .on('end', reason => {
                    if (reason === 'Stream is not generating enough quickly') console.log(reason);
                    else console.log('Song ended');
                    serverQueue.songs.shift();
                    play(guild, serverQueue.songs[0], msg)
        
                })
                .on('error', error => console.error(error));
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        
            const embed = new RichEmbed()
                .setColor("GREEN")
                .setTitle('Now Playing\n')
                .setThumbnail(song.thumbnail)
                .setTimestamp()
                .setDescription(`🎵 Now playing:\n **${song.title}** 🎵`)
                .setFooter(msg.member.displayName, msg.author.displayAvatarURL);
            serverQueue.textchannel.send(embed);
        
        };
    }
}