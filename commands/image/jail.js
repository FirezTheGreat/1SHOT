const Discord = require("discord.js");
const { AME_API } = require('../../config');
const AmeClient = require('amethyste-api');
const AmeAPI = new AmeClient(AME_API);

module.exports = {
    config: {
        name: "jail",
        category: "image",
        noalias: [''],
        description: "Sends User To Jail",
        usage: '[mention](optional)',
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {
        let user = await message.mentions.members.first() || message.member;
        let m = await message.channel.send("**Please Wait...**");
        let buffer = await AmeAPI.generate("jail", { url: user.user.displayAvatarURL({ format: "png", size: 1024 }) });
        let attachment = new Discord.MessageAttachment(buffer, "jail.png");
        m.delete({ timeout: 5000 });
        message.channel.send(attachment);
    }
};
