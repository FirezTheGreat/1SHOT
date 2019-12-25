const { RichEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    config: {
        name: "instasearch",
        category: "fun",
        aliases: ["sinsta", "searchinsta"],
        description: "searches insta ids",
        usage: "[name]",
        accessableby: "everyone",
    },
    run: async (bot, message, args) => {
        const name = args.join(" ");

        if(!name) {
            return message.channel.send("**Please enter a name!**")
                .then(m => m.delete(5000));
        }

        const url = `https://instagram.com/${name}/?__a=1`;
        const res = await fetch(url).then(url => url.json());

        if(!res.graphql.user.username) {
            return message.channel.send('I couldn\'t find that account')
                .then(m => m.delete(5000));
        }
        const account = res.graphql.user;

        const embed = new RichEmbed()
            .setColor("GREEN")
            .setTitle(account.full_name)
            .setURL(`https://instagram.com/${name}`)
            .setThumbnail(account.profile_pic_url_hd)
            .setDescription("Profile Info")
            .addField("**Username**", `${account.username}`)
            .addField("**Full Name**", `${account.full_name}`)
            .addField("**Bio**", `${account.biography.length == 0 ? "none": account.biography}`)
            .addField("**Posts**", `${account.edge_owner_to_timeline_media.count}`)
            .addField("**Followers**", `${account.edge_followed_by.count}`)
            .addField("**Following**", `${account.edge_follow.count}`)
            .addField("**Private Account**", `${account.is_private ? "Yes🔒" : "No 🔓"}`)
        message.channel.send(embed)
    }
}