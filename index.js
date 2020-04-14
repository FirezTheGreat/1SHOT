const { Client, MessageAttachment, Collection, MessageEmbed } = require('discord.js');
const { TOKEN } = require('./config');
const bot = new Client({ disableEveryone: true });
const fs = require("fs");
const db = require('quick.db');

bot.commands = new Collection();
bot.aliases = new Collection();

["aliases", "commands"].forEach(x => bot[x] = new Collection());
["console", "command", "event"].forEach(x => require(`./handler/${x}`)(bot));

bot.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {
    require(`./handler/${handler}`)(bot);
})

bot.on('guildMemberAdd', function (member) {

    const channel = member.guild.channels.cache.find(channel => channel.name === "welcome");
    if (!channel) return;

    channel.send(`Welcome to our ${member}, please read the rules in the rules channel`);

    var r = member.guild.roles.cache.find(r => r.name === 'Community');
    member.roles.add(r)
});

bot.on('message', message => {

    if (message.content.toLowerCase() === 'noob') {
        const attachment = new MessageAttachment('https://pics.me.me/thumb_no-u-no-u-43349136.png');
        message.channel.send(attachment);
    }
    if (message.content === "Hello") {
        message.channel.send('Hi There!');
    }
    if (message.channel.type != "text") return undefined;
    db.add(`messages_${message.guild.id}_${message.author.id}`, 1)
    let messagefetch = db.fetch(`messages_${message.guild.id}_${message.author.id}`)

    let messages;
    if (messagefetch == 25) messages = 25; //Level 1
    else if (messagefetch == 65) messages = 65; // Level 2
    else if (messagefetch == 115) messages = 115; // Level 3
    else if (messagefetch == 200) messages = 200; // Level 4
    else if (messagefetch == 300) messages = 300; // Level 5
    else if (messagefetch == 410) messages = 410; // Level 6
    else if (messagefetch == 510) messages = 510; // Level 7
    else if (messagefetch == 720) messages = 720; // Level 8
    else if (messagefetch == 870) messages = 870; // Level 9
    else if (messagefetch == 1000) messages = 1000; // Level 10


    if (!isNaN(messages)) {
        db.add(`level_${message.guild.id}_${message.author.id}`, 1)
        let levelfetch = db.fetch(`level_${message.guild.id}_${message.author.id}`)

        let levelembed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`${message.author}, You have leveled up to level ${levelfetch}`)
        message.channel.send(levelembed)
    }
});

bot.login(TOKEN);