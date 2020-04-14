const Discord = require('discord.js');

module.exports = {
    config: {
        name: "invitations",
        aliases: ['invites'],
        category: "info",
        description: "Shows Users Joined Through Someone's Invites",
        usage: "[mention](optional)",
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {

        let member = await message.mentions.members.first() || message.member;

        let invites = await message.guild.fetchInvites().catch((err) => {
            return;
        });
        
        let memberInvites = invites.filter(i => i.inviter && i.inviter.id === member.user.id);

        if(memberInvites.size <= 0){
            return message.channel.send("**You didn't invite anyone to the server!**", (member === message.member ? null : member));
        }

        let content = memberInvites.map(i => i).join("\n");
        let index = 0;
        memberInvites.forEach(invite => index += invite.uses);
        
        let embed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setFooter(message.guild.name, message.guild.iconURL())
            .setAuthor(`Invite Tracker for ${message.guild.name}`)
            .setDescription(`Information on Invites of ${member.displayName}`)
            .addField("**No. Invited Persons**", index)
            .addField("Invitation Codes\n\n", content);
        message.channel.send(embed);
    }
};