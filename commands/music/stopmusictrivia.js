module.exports = {
    config: {
        name: "stopmusictrivia",
        aliases: ["st", "smt"],
        category: "music",
        description: "not now",
        usage: " ",
        accessableby: "everyone"
    },
    run: async (bot, message, args, ops) => {
        const serverQueue = ops.queue3.get(message.guild.id)
        const triviaData = ops.queue2.get(message.guild.id)
        try {
            if (!triviaData.isTriviaRunning)
                return message.channel.send('No trivia is currently running');

            if (message.guild.me.voice.channel !== message.member.voice.channel) {
                return message.channel.send("Join the trivia's channel and try again");
            }

            if (!triviaData.triviaScore.has(message.author.username)) {
                return message.channel.send(
                    'You need to participate in the trivia in order to end it'
                );
            }

            triviaData.triviaQueue.length = 0;
            triviaData.wasTriviaEndCalled = true;
            triviaData.triviaScore.clear();
            serverQueue.connection.dispatcher.end();
            return message.channel.send('⏩ Music Trivia Skipped');
        }
        catch (e) {
            console.log(e)
            return undefined;
        }
    }
};