const { RichEmbed } = require("discord.js");
const { promptMessage } = require("../../functions");

const chooseArr = ["🗻", "📰", "✂"];

module.exports = {
    config: {
        name: "rps",
        category: "fun",
        noalias: "No Aliases",
        description: "Rock Paper Scissors Game. React to one of the emojis to play the game.",
        usage: " ",
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {
        const embed = new RichEmbed()
            .setColor("#ffffff")
            .setFooter(message.guild.me.dispatcher, bot.user.displayAvatarURL)
            .setDescription("Add a reaction to one of those emojis to play the game!")
            .setTimestamp();

        const m = await message.channel.send(embed);
        const reacted = await promptMessage(m, message.author, 30, chooseArr);

        const botChoice = chooseArr[Math.floor(Math.random() * chooseArr.length)];

        const result = await getResult(reacted, botChoice);
        await m.clearReactions();

        embed
            .setDescription("")
            .addField(result, `${reacted} vs ${botChoice}`);

        m.edit(embed);

        function getResult(me, botChosen) {
            if ((me === "🗻" && botChosen === "✂") ||
                (me === "📰" && botChosen === "🗻") ||
                (me === "✂" && botChosen === "📰")) {
                return "You won!";
            } else if (me === botChosen) {
                return "Its a tie!";
            } else {
                return "You lost!";
            }

        }

    }
}