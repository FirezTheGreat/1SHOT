const { Util, RichEmbed } = require('discord.js');

const YouTube = require("simple-youtube-api");
const youtube = new YouTube(process.env.GOOGLE_API_KEY);
const ytdl = require('ytdl-core');

module.exports = {
    config: {
        name: 'play',
        category: "music",
        aliases: ["p"],
        description: 'Play command.',
        usage: ', p [link | song name]',
        accessableby: "everyone"
    },
    run: async (bot, message, args, ops) => {

        args = message.content.split(' ');
        const searchString = args.slice(1).join(' ');
        const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';

        const { voiceChannel } = message.member;
        if (!voiceChannel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
        if (!permissions.has('SPEAK')) return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');


        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();

            for (const video of Object.values(videos)) {
                const video2 = await youtube.getVideoByID(video.id);
                await handleVideo(video2, message, voiceChannel, true);
            }
            return message.channel.send(`Playlist: **${playlist.title}** has been added to the queue!`);
        } else {
            try {
                var video = await youtube.getVideo(url);
            } catch (error) {
                try {
                    var videos = await youtube.searchVideos(searchString, 1);
                    var video = await youtube.getVideoByID(videos[0].id);
                } catch (err) {
                    console.error(err)
                    return message.channel.send('❌ **No matches**')
                }
            }
            return handleVideo(video, message, voiceChannel);
        }

        async function handleVideo(video, message, voiceChanne, playlist = false) {
            const serverQueue = ops.queue.get(message.guild.id);
            const song = {
                id: video.id,
                title: Util.escapeMarkdown(video.title),
                url: `https://www.youtube.com/watch?v=${video.id}`,
                thumbnail: `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`
            };

            if (!serverQueue) {
                const queueConstruct = {
                    textchannel: message.channel,
                    voiceChannel,
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
                    play(queueConstruct.songs[0]);
                } catch (error) {
                    console.error(`I could not join the voice channel: ${error}`);
                    queue.delete(message.guild.id);
                    return undefined;
                }
        
            } else {
                serverQueue.songs.push(song);
                if (playlist) return undefined;
                else {
                    const sembed = new RichEmbed()
                        .setColor("GREEN")
                        .setTitle("Added To Queue")
                        .setThumbnail(song.thumbnail)
                        .setTimestamp()
                        .setDescription(`**${song.title}** has been added to queue! | Requested By **${message.author.username}**`)                        .setFooter(message.member.displayName, message.author.displayAvatarURL);
                    message.channel.send(sembed)
                }
            }
            return undefined;
        }
        async function play(song) {
            const queue = ops.queue.get(message.guild.id);
            if (!song) {
                queue.voiceChannel.leave();
                ops.queue.delete(message.guild.id);
                return;
            }

            const dispatcher = queue.connection.playStream(await ytdl(song.url, { filter: "audioonly", highWaterMark: 1 << 20 }, { bitrate: 192000 }))
                .on('end', reason => {
                    if (reason === 'Stream is not generating quickly enough.') console.log(reason);
                    else return undefined;
                    queue.songs.shift();
                    play(queue.songs[0]);
                })
                .on('error', error => console.error(error));
            dispatcher.setVolumeLogarithmic(queue.volume / 5);
            const embed = new RichEmbed()
                .setColor("GREEN")
                .setTitle('Now Playing\n')
                .setThumbnail(song.thumbnail)
                .setTimestamp()
                .setDescription(`🎵 Now playing:\n **${song.title}** 🎵`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL);
            queue.textchannel.send(embed);
        };
    }
};