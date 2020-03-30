const {
  Client,
  Attachment,
  RichEmbed,
  Collection,
  Util
} = require("discord.js");
const PREFIX = "!";
const { TOKEN } = require("./config");
const bot = new Client({ disableEveryone: true });
const fs = require("fs");

bot.commands = new Collection();
bot.aliases = new Collection();

["aliases", "commands"].forEach(x => (bot[x] = new Collection()));
["console", "command", "event"].forEach(x => require(`./handler/${x}`)(bot));

bot.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {
  require(`./handler/${handler}`)(bot);
});

bot.on("guildMemberAdd", function(member) {
  const channel = member.guild.channels.find(
    channel => channel.name === "welcome"
  );
  if (!channel) return;

  channel.send(
    `Welcome to our ${member}, please read the rules in the rules channel`
  );

  var r = member.guild.roles.find("name", "Community");
  member.addRole(r);
});

bot.on("message", msg => {
  if (msg.content.toLowerCase() === "noob") {
    const attachment = new Attachment(
      "https://pics.me.me/thumb_no-u-no-u-43349136.png"
    );
    msg.channel.send(attachment);
  }
  if (msg.content.toLowerCase() === `${PREFIX}av`) {
    msg.channel.send(msg.author.avatarURL);
  }
  if (msg.content === "Hello") {
    msg.channel.send("Hi There!");
  }
  if (msg.content.toLowerCase() === `${PREFIX}link`) {
    msg.channel.send(
      "https://discordapp.com/oauth2/authorize?client_id=635668132308058142&permissions=8&scope=bot"
    );
  }
});

bot.login(TOKEN);
