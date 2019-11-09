const { Client, Attachment, RichEmbed, Collection } = require('discord.js');
const bot = new Client();
const PREFIX = "!';
const fs = require("fs");

const TOKEN = "Your token";

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
        case 'clear':
            if (!args[1]) return message.reply('Please Define A Number')
            message.channel.bulkDelete(args[1]);
            message.delete();
            break;
    }
})

bot.login(TOKEN)
