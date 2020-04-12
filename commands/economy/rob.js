const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const ms = require("parse-ms");

module.exports = {
  config: {
    name: "rob",
    noalias: [""],
    category: "economy",
    description: "Robs someone",
    usage: "[mention]",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    let user = message.mentions.members.first();

    if (!args[0]) return message.channel.send("who")

    let embed2 = new MessageEmbed()
      .setColor("GREEN")
      .setDescription(`❌ You cannot rob yourself`)

    if (message.mentions.users.first().id === message.author.id) {
      return message.channel.send(embed2)
    }

    let targetuser = await db.fetch(`money_${message.guild.id}_${user.id}`)
    let author = await db.fetch(`rob_${message.guild.id}_${user.id}`)
    let author2 = await db.fetch(`money_${message.guild.id}_${message.author.id}`)

    let timeout = 600000;

    if (author !== null && timeout - (Date.now() - author) > 0) {
      let time = ms(timeout - (Date.now() - author));

      let timeEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setDescription(`❌ You have already robbed someone\n\nTry again in ${time.minutes}m ${time.seconds}s `);
      message.channel.send(timeEmbed)
    } else {

      let moneyEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setDescription(`❌ You need atleast 100 coins in your wallet to rob someone`);

      if (author2 < 100) {
        return message.channel.send(moneyEmbed)

      }
      let moneyEmbed2 = new MessageEmbed()
        .setColor("GREEN")
        .setDescription(`❌ ${user.user.username} does not have anything you can rob`);

      let random = Math.floor((Math.random() * 100)) + 1;

      if (targetuser < random) {
        return message.channel.send(moneyEmbed2)
      } else {

        let embed = new MessageEmbed()
          .setDescription(`✅ You robbed ${user} and got away with ${random} coins`)
          .setColor("GREEN")
        message.channel.send(embed)

        db.subtract(`money_${message.guild.id}_${user.id}`, random)
        db.add(`money_${message.guild.id}_${message.author.id}`, random)
        db.set(`rob_${message.guild.id}_${user.id}`, Date.now())

      }
    };
  }
} 