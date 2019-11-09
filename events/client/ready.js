const PREFIX = "!";
module.exports = async bot => {
    console.log(`${bot.user.username} is available now!`)
    
    var activities = [ `${bot.guilds.size} server`, `${bot.channels.size} channels!`, `${bot.users.size} users!` ], i = 0;
    setInterval(() => bot.user.setActivity(`${PREFIX}help | ${activities[i++ % activities.length]}`, { type: "WATCHING" }),5000)

}
