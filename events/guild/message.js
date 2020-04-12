const prefix = ".";
const queue2 = new Map();
const queue3 = new Map();
const queue = new Map();
module.exports = async (bot, message) => { 
    if(message.author.bot || message.channel.type === "dm") return;

    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();

    if(!message.content.startsWith(prefix)) return;
    try{
        let ops = {
            queue2: queue2,
            queue: queue,
            queue3: queue3
        }
    
    var commandfile = bot.commands.get(cmd) || bot.commands.get(bot.aliases.get(cmd))
    if(commandfile) commandfile.run(bot, message, args, ops)
    } catch (e) {
        console.log(e);
    }
}
