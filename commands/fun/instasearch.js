const { RichEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  config: {
    name: "instasearch",
    aliases: ["sinsta"],
    category: "fun",
    description: "Find out some nice instagram statistics",
    usage: ", sinsta [username]",
    accessableby: "everyone"
  },
    run: async (client, message, args) => {
        const name = args.join(" ");

        if (!name) {
            return message.reply("Maybe it's useful to actually search for someone...!")
                .then(m => m.delete(5000));
        }

        const url = `https://instagram.com/${name}/?__a=1`;
        
        let res; 

        try {
            res = await fetch(url).then(url => url.json());
        } catch (e) {
            return message.reply("I couldn't find that account... :(")
                .then(m => m.delete(5000));
        }

        const account = res.graphql.user;

        const embed = new RichEmbed()
            .setColor("GREEN")
            .setTitle(account.full_name)
            .setURL(`https://instagram.com/${name}`)
            .setThumbnail(account.profile_pic_url_hd)
            .addField("Profile information",`**- Username:** ${account.username}`)
            .addField("**Full name:**", `${account.full_name}`)
            .addField("**Biography:**", `${account.biography.length == 0 ? "none" : account.biography}`)
            .addField("**Posts:**", `${account.edge_owner_to_timeline_media.count}`)
            .addField("**Followers:**", `${account.edge_followed_by.count}`)
            .addField("**Private account:**", `${account.is_private ? "Yes 🔐" : "No 🔓"}`);

        message.channel.send(embed);
    }
}