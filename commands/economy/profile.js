const { Canvas } = require('canvas-constructor');
const { createCanvas, loadImage } = require('canvas');
const { MessageAttachment } = require('discord.js');
const { get } = require('node-superfetch');
const db = require('quick.db');
const { crFormat } = require('../../functions')

Canvas.registerFont(`${process.cwd()}/assets/fonts/RobotoRegular.ttf`, "RobotoRegular")
Canvas.registerFont(`${process.cwd()}/assets/fonts/courbd.ttf`, "Courier New")
Canvas.registerFont(`${process.cwd()}/assets/fonts/Impact.ttf`, "Impact")

module.exports = {
    config: {
        name: "profile",
        aliases: ['prof'],
        category: 'economy',
        description: 'Shows User Profile',
        usage: '[mention | username | nickname | ID]',
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
        if (user.user.bot) return message.channel.send(`**Bots Don't Have A Profile!**`);

        let works = db.fetch(`works_${user.id}`)
        if (works === null) works = 0;

        let begs = db.fetch(`begs_${user.id}`)
        if (begs === null) begs = 0;

        let games = db.fetch(`games_${user.id}`)
        if (games === null) games = 0;

        let workTag;
        if (works >= 100) workTag = 'Workaholic'
        if (!workTag) workTag = ''

        let begTag;
        if (begs >= 100) begTag = 'Beggar'
        if (!begTag) begTag = ''

        let gamesTag;
        if (games >= 100) gamesTag = 'Gamer'
        if (!gamesTag) gamesTag = ''

        let bg = db.fetch(`bg_${user.id}`)
        if (bg === null) bg = 'https://images.wallpaperscraft.com/image/cat_profile_muzzle_eyes_113734_3840x2400.jpg'

        let money = db.fetch(`money_${user.id}`)
        if (money === null) money = 0;

        let bank = db.fetch(`bank_${user.id}`)
        if (bank === null) bank = 0;

        let level = db.fetch(`level_${message.guild.id}_${user.id}`)
        if (level === null) level = 0;

        let info = db.fetch(`info_${user.id}`)
        if (info === null) info = 'No Info'
        
        let xp = db.fetch(`messages_${message.guild.id}_${user.id}`)
        if (xp == null) xp = 1

        let vip = db.fetch(`bronze_${user.id}`)
        if (vip === null) vip = '0'
        if (vip === true) vip = '1'

        let fish = db.fetch(`fish_${user.id}`)
        if (fish === null) fish = 0

        let uLevel = level + 1;
        let nxtLvlXp = uLevel * 100;
        let difference = xp / nxtLvlXp * 353;
        let balance = money;
        let Info = info
        let background = bg;
        let work = works;

        try {
            async function createCanvas() {
                var username = user.user.username;
                var name = username.length > 10 ? username.substring(0, 12) + "..." : username;
                var { body: avatar } = await get(user.user.displayAvatarURL({ format: 'jpg', size: 1024 }));
                var { body: background1 } = await get(background)
                var { body: background2 } = await get('https://cdn.glitch.com/ccfc9e2e-e1fa-4dd0-838d-c3b5bb122b10%2Fprofile.png?v=1589468840464');

                return new Canvas(600, 500)
                    .setColor('#000000')
                    .addImage(background1, 0, 0, 600, 500)
                    .addBeveledImage(background2, 0, 0, 600, 400)
                    .setTextFont('30px Impact')
                    .addText(`${name}'s Profile Card`, 190, 105)
                    .addText('Fishes', 445, 140)
                    .addText('-', 530, 140)
                    .addText(`${crFormat(fish)}`, 550, 140)
                    .setTextFont('20px Impact')
                    .addText('Tags', 525, 190)
                    .addText(workTag, 507, 230)
                    .addText(begTag, 520, 270)
                    .addText(gamesTag, 520, 310)
                    .setTextFont('30px Impact')
                    .addText('_______', 505, 190)
                    .addText('_______', 505, 230)
                    .addText('_______', 505, 270)
                    .addText('_______', 505, 310)
                    .addText('_____________________', 150, 396)
                    .addText('_____________________', 152, 423)
                    .addText('|', 148, 422)
                    .addText('|', 503, 422)
                    .setTextFont('28px Courier New')
                    .addText(`About ${user.user.username}`, 160, 182)
                    .setTextFont('30px Impact')
                    .addText('Level', 190, 140)
                    .addText('Ranks', 310, 140)
                    .setTextFont('23px Impact')
                    .addText('Works', 31, 260)
                    .addText('Begs', 31, 315)
                    .addText('Games', 31, 370)
                    .addText('-', 97, 260)
                    .addText('-', 85, 315)
                    .addText('-', 100, 370)
                    .addText(`${crFormat(work)}`, 31, 285)
                    .addText(`${crFormat(begs)}`, 31, 340)
                    .addText(`${crFormat(games)}`, 31, 395)
                    .setTextFont('30px Impact')
                    .addText('Total XP', 160, 340)
                    .addText('Balance', 160, 380)
                    .addText(`${crFormat(xp)}`, 273, 340)
                    .addText(`$${crFormat(balance)}`, 278, 380)
                    .setTextAlign('center')
                    .setTextFont('20px Courier New')
                    .setTextFont('30px Impact')
                    .addText(`${level}`, 280, 140)
                    .addText(`${vip}`, 410, 140)
                    .addText('-', 260, 140)
                    .addText('-', 393, 140)
                    .addText('-', 263, 340)
                    .addText('-', 268, 380)
                    .setColor("#459466")
                    .addRect(154, 400, difference, 25)
                    .setTextFont("18px RobotoRegular")
                    .setColor("#000000")
                    .setTextAlign('left')
                    .addText(`${Info}`, 165, 200)
                    .addText(`XP: ${xp} / ${nxtLvlXp}`, 300, 418)
                    .addCircularImage(avatar, 90, 93, 89, 104)
                    .toBufferAsync();
            }

            const attachment = new MessageAttachment(await createCanvas(), 'profile.png')
            message.channel.send(attachment)

        } catch (e) {
            console.log(e)
            return message.channel.send(`Oh no an error occurred :( \`${e.message}\` try again later.`);
        }
    }
}