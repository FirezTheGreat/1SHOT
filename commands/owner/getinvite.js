const ownerid = "457556815345877003";
const Discord = require("discord.js");

module.exports = {
    config: {
        name: "getinvite",
        aliases: ['getinv', 'gi'],
        category: "owner",
        description: "Generates an invitation to the server in question.",
        usage: "[ID | name]",
        accessableby: "Owner"
    },
    run: async(bot, message, args) => {
        if (message.author.id === ownerid) {
        let guild = null;

        if (!args[0]) return message.channel.send("Enter An Name")

        if(args[0]){
            let found = bot.guilds.cache.get(args[0]);
            if(!found){
                found = bot.guilds.cache.find(g => g.name === args.join(" "));
                if(found){
                    guild = found;
                }
            }
        } else {
            return message.channel.send("Invalid Name!");
        }

        if(guild){
            let tChannel = guild.channels.cache.find(ch => ch.type == "text" && ch.permissionsFor(ch.guild.me).has("CREATE_INSTANT_INVITE"));
            if(!tChannel){
                return message.channel.send("An Error Has Occured Try Again!"); 
            }
            let invite = await tChannel.createInvite({ maxAge: 0 }).catch(err => {
                return message.channel.send(`${err} has occured!`);
            });
            message.channel.send(invite.url);
        } else {
            return message.channel.send(`\`${args.join(' ')}\` - Bot is Not in this server`);
        }
    } else {
        return message.channel.send("You Are Not The Owner!")
    }
    }

}