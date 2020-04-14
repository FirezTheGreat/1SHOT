const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { tenor_API } = require('../../config.js');

module.exports = {
    config: {
        name: 'gif',
        category: 'image',
        aliases: ['search-gif', 'search-gifs'],
        description: 'Provide a query and I will return a gif!',
        usage: "[query]",
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {
        if (!args[0]) {
            const embed = new MessageEmbed()
                .setColor("GREEN")
                .setDescription("**Please Enter A Search Query!**")
            return message.channel.send(embed)
        }
        fetch(`https://api.tenor.com/v1/random?key=${tenor_API}&q=${args[0]}&limit=1`)
            .then(res => res.json())
            .then(json => message.channel.send(json.results[0].url))
            .catch(e => {
                const sembed = new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription("**Invalid Query**")
                message.channel.send(sembed);
                return;
            });
    }
};