const { Client, MessageAttachment, Collection, MessageEmbed } = require('discord.js');
const { PREFIX, TOKEN, DBL_API_KEY } = require('./config');
const bot = new Client({ disableEveryone: true });
const DBL = require('dblapi.js');
const dbl = new DBL(DBL_API_KEY)
const fs = require("fs");
const db = require('quick.db');
const jimp = require('jimp');

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
        }
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
            return;
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