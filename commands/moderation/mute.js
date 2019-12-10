  
const { RichEmbed } = require("discord.js")
const { red_light } = require("../../colours.json");

module.exports = {
    config: {
        name: "mute",
        description: "Mutes a member in the discord!",
        usage: "[user | <reason> (optional)]",
        category: "moderation",
        accessableby: "Administrator",
    },
    run: async (bot, message, args) => {
// check if the command caller has permission to use the command
if(!message.member.hasPermission("MANAGE_ROLES") || !message.guild.owner) return message.channel.send("You dont have permission to use this command.");

if(!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.channel.send("I don't have permission to add roles!")

//define the reason and mutee
let mutee = message.mentions.members.first() || message.guild.members.get(args[0]);
if(!mutee) return message.channel.send("Please supply a user to be muted!");

let reason = args.slice(1).join(" ");
if(!reason) reason = "No reason given"

//define mute role and if the mute role doesnt exist then create one
let muterole = message.guild.roles.find(r => r.name === "muted")
if(!muterole) {
    try{
        muterole = await message.guild.createRole({
            name: "muted",
            color: "#979797",
            permissions: []
        })
        message.guild.channels.forEach(async (channel, id) => {
            await channel.overwritePermissions(muterole, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false,
                SEND_TTS_MESSAGES: false,
                ATTACH_FILES: false,
                SPEAK: false
            })
        })
    } catch(e) {
        console.log(e.stack);
    }
}

//add role to the mentioned user and also send the user a dm explaing where and why they were muted
mutee.addRole(muterole.id).then(() => {
    mutee.send(`Hello, you have been muted in ${message.guild.name} for: ${reason}`).catch(err => console.log(err))
    message.channel.send(`${mutee.user.username} was successfully muted.`)
})

//send an embed to the modlogs channel
let embed = new RichEmbed()
    .setColor(red_light)
    .setThumbnail(mutee.user.displayAvatarURL)
    .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL)
    .addField("Moderation:", "mute")
    .addField("Muted:", mutee.user.username)
    .addField("Moderator:", message.author.username)
    .addField("Reason:", reason)
    .addField("Date:", message.createdAt.toLocaleString())

let sChannel = message.guild.channels.find(c => c.name === "modlogs")
sChannel.send(embed)
    }
}
