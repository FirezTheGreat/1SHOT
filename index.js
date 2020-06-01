const { Client, MessageAttachment, Collection, MessageEmbed } = require('discord.js');
const { PREFIX, TOKEN, DBL_API_KEY } = require('./config');
const bot = new Client({ disableMentions: 'everyone' });
const DBL = require('dblapi.js');
const dbl = new DBL(DBL_API_KEY)
const fs = require("fs");
const db = require('quick.db');
const jimp = require('jimp');

bot.phone = new Collection();
bot.commands = new Collection();
bot.aliases = new Collection();

["aliases", "commands"].forEach(x => bot[x] = new Collection());
["console", "command", "event"].forEach(x => require(`./handler/${x}`)(bot));

bot.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {
    require(`./handler/${handler}`)(bot);
});
bot.on('ready', () => {
    setInterval(() => {
        dbl.postStats(bot.guilds.cache.size);
    }, 1800000);
});

bot.on('message', async message => {
    let prefix;
    if (message.author.bot || message.channel.type === "dm") return;
        try {
            let fetched = await db.fetch(`prefix_${message.guild.id}`);
            if (fetched == null) {
                prefix = PREFIX
            } else {
                prefix = fetched
            }
        } catch (e) {
            console.log(e)
    };
  
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let messageFetch = db.fetch(`guildMessages_${message.guild.id}`)
    if (messageFetch === null) return;

    db.add(`messages_${message.guild.id}_${message.author.id}`, 1)
    let messagefetch = db.fetch(`messages_${message.guild.id}_${message.author.id}`)

    let messages;
    if (messagefetch == 0) messages = 0; //Level 0
    else if (messagefetch == 100) messages = 100; // Level 1
    else if (messagefetch == 200) messages = 200; // Level 2
    else if (messagefetch == 300) messages = 300; // Level 3
    else if (messagefetch == 400) messages = 400; // Level 4
    else if (messagefetch == 500) messages = 500; // Level 5
    else if (messagefetch == 600) messages = 600; // Level 6
    else if (messagefetch == 700) messages = 700; // Level 7
    else if (messagefetch == 800) messages = 800; // Level 8
    else if (messagefetch == 900) messages = 900; // Level 9
    else if (messagefetch == 1000) messages = 1000; // Level 10
    else if (messagefetch == 1100) messages = 1100; // Level 11
    else if (messagefetch == 1200) messages = 1200; // Level 12
    else if (messagefetch == 1300) messages = 1300; // Level 13
    else if (messagefetch == 1400) messages = 1400; // Level 14
    else if (messagefetch == 1500) messages = 1500; // Level 15
    else if (messagefetch == 1600) messages = 1600; // Level 16
    else if (messagefetch == 1700) messages = 1700; // Level 17
    else if (messagefetch == 1800) messages = 1800; // Level 18
    else if (messagefetch == 1900) messages = 1900; // Level 19
    else if (messagefetch == 2000) messages = 2000; // Level 20
    else if (messagefetch == 2100) messages = 2100; // Level 21
    else if (messagefetch == 2200) messages = 2200; // Level 22
    else if (messagefetch == 2300) messages = 2300; // Level 23
    else if (messagefetch == 2400) messages = 2400; // Level 24
    else if (messagefetch == 2500) messages = 2500; // Level 25
    else if (messagefetch == 2600) messages = 2600; // Level 26
    else if (messagefetch == 2700) messages = 2700; // Level 27
    else if (messagefetch == 2800) messages = 2800; // Level 28
    else if (messagefetch == 2900) messages = 2900; // Level 29
    else if (messagefetch == 3000) messages = 3000; // Level 30
    else if (messagefetch == 3100) messages = 3100; // Level 31
    else if (messagefetch == 3200) messages = 3200; // Level 32
    else if (messagefetch == 3300) messages = 3300; // Level 33
    else if (messagefetch == 3400) messages = 3400; // Level 34
    else if (messagefetch == 3500) messages = 3500; // Level 35
    else if (messagefetch == 3600) messages = 3600; // Level 36
    else if (messagefetch == 3700) messages = 3700; // Level 37
    else if (messagefetch == 3800) messages = 3800; // Level 38
    else if (messagefetch == 3900) messages = 3900; // Level 39
    else if (messagefetch == 4000) messages = 4000; // Level 40
    else if (messagefetch == 4100) messages = 4100; // Level 41
    else if (messagefetch == 4200) messages = 4200; // Level 42
    else if (messagefetch == 4300) messages = 4300; // Level 43
    else if (messagefetch == 4400) messages = 4400; // Level 44
    else if (messagefetch == 4500) messages = 4500; // Level 45
    else if (messagefetch == 4600) messages = 4600; // Level 46
    else if (messagefetch == 4700) messages = 4700; // Level 47
    else if (messagefetch == 4800) messages = 4800; // Level 48
    else if (messagefetch == 4900) messages = 4900; // Level 49
    else if (messagefetch == 5000) messages = 5000; // level 50

    if (!isNaN(messages)) {
        db.add(`level_${message.guild.id}_${message.author.id}`, 1)
        let levelfetch = db.fetch(`level_${message.guild.id}_${message.author.id}`)

        let levelembed = new MessageEmbed()
            .setColor('GREEN')
            .setDescription(`**${message.author}, You Have Leveled Up To Level ${levelfetch}**`)
            .setFooter(`${prefix}disablexp To Disable Level Up Messages`)
        message.channel.send(levelembed);
    };
});

bot.on('message', async message => {
    let prefix;
        try {
            let fetched = await db.fetch(`prefix_${message.guild.id}`);
            if (fetched == null) {
                prefix = PREFIX
            } else {
                prefix = fetched
            }
        } catch (e) {
            console.log(e)
    };
    try {
        if (message.mentions.has(bot.user) && !message.mentions.has(message.guild.id)) {
            return message.channel.send(`**My Prefix In This Server is - \`${prefix}\`**`)
        }
    } catch {
        return;
    };
});

bot.on('message', async message => {
  
    try {
        const hasText = Boolean(message.content);
        const hasImage = message.attachments.size !== 0;
        const hasEmbed = message.embeds.length !== 0;
        if (message.author.bot || (!hasText && !hasImage && !hasEmbed)) return;
        const origin = bot.phone.find(call => call.origin.id === message.channel.id);
        const recipient = bot.phone.find(call => call.recipient.id === message.channel.id);
        if (!origin && !recipient) return;
        const call = origin || recipient;
        if (!call.active) return;
        await call.send(origin ? call.recipient : call.origin, message, hasText, hasImage, hasEmbed);
    } catch {
        return;
    };
});

bot.on('guildMemberAdd', async member => {

    let wChan = db.fetch(`welcome_${member.guild.id}`)

    if (wChan == null) return;

    if (!wChan) return;

    let font64 = await jimp.loadFont(jimp.FONT_SANS_64_WHITE)
    let bfont64 = await jimp.loadFont(jimp.FONT_SANS_64_BLACK)
    let mask = await jimp.read('https://i.imgur.com/552kzaW.png')
    let welcome = await jimp.read('https://t.wallpaperweb.org/wallpaper/nature/1920x1080/greenroad1920x1080wallpaper3774.jpg')

    jimp.read(member.user.displayAvatarURL({ format: 'png' })).then(avatar => {
        avatar.resize(200, 200)
        mask.resize(200, 200)
        avatar.mask(mask)
        welcome.resize(1000, 300)

        welcome.print(font64, 265, 55, `Welcome ${member.user.username}`)
        welcome.print(bfont64, 265, 125, `To ${member.guild.name}`)
        welcome.print(font64, 265, 195, `There are now ${member.guild.memberCount} users`)
        welcome.composite(avatar, 40, 55).write('Welcome2.png')
        try {
            member.guild.channels.cache.get(wChan).send(``, { files: ["Welcome2.png"] })
        } catch (e) {
          
        }
    })
        var r = member.guild.roles.cache.find(r => r.name === 'Community');
        if (!r) return;
        member.roles.add(r)

});

const express = require("express");
const app = express();

const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];
app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/dreams", (request, response) => {
  response.json(dreams);
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

bot.login(TOKEN);
