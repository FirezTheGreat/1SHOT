const Discord = require('discord.js');
const { AME_API } = require('../../config');
const AmeClient = require('amethyste-api');
const AmeAPI = new AmeClient(AME_API)

module.exports = {
    config: {
        name: "tobecontinued",
        aliases: ['tbc'],
        category: "image",
        description: "Shows A ToBeContinued Image",
        usage: "[mention](optional)",
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {

        let user = await message.mentions.members.first() || message.member;
        let m = await message.channel.send("**Please Wait...**");
        let buffer = await AmeAPI.generate("tobecontinued", { url: user.user.displayAvatarURL({ format: "png", size: 512 }) });
        let attachment = new Discord.MessageAttachment(buffer, "tobecontinued.png");
        m.delete({ timeout: 5000 });
        message.channel.send(attachment);
    }
};