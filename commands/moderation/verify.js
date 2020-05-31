const db = require('quick.db');

module.exports = {
    config: {
        name: 'verify',
        noalias: [''],
        category: 'moderation',
        description: 'Use This To Get Verified In A Server',
        usage: ' ',
        accessableby: 'everyone'
    },
    run: async (bot, message, args) => {
        let verifychannel = db.fetch(`verificationchannel_${message.guild.id}`);
        if (!verifychannel || verifychannel === null) return;
        if(!message.guild.channels.cache.has(verifychannel)) return;

        let verifiedchannel = message.guild.channels.cache.get(verifychannel);
        if (message.channel.id !== verifiedchannel.id) return;

        let verifyrole = db.fetch(`verificationrole_${message.guild.id}`);
        if (!verifyrole || verifyrole === null) return;
        if(!message.guild.roles.cache.has(verifyrole)) return;

        let verifiedrole = message.guild.roles.cache.get(verifyrole);
        if (verifiedrole.managed) return message.channel.send("**Cannot Add That Role To The User!**").then(m => m.delete({ timeout: 2000 }));
        if (message.guild.me.roles.highest.comparePositionTo(verifiedrole) <= 0) return message.channel.send('**Role Is Currently Higher Than Me Therefore Cannot Add It To The User!**').then(m => m.delete({ timeout: 2000 }));
        if (message.member.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) return message.channel.send('**Cannot Add Role To This User! - [Higher Than Me In Role Hierachy]**').then(m => m.delete({ timeout: 2000 }));         
        
        try {
            if (message.member.roles.cache.has(verifiedrole.id)) {
                message.delete();
                return;
            }
            let m = await message.react('✅');
            message.member.roles.add(verifiedrole.id);
            m.delete({ timeout: 5000 });
        } catch {
            return;
        };
    }
};