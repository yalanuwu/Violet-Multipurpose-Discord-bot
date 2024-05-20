require("dotenv").config()
const { Client, IntentsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType } = require("discord.js")

const client = new Client ({
    intents : [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        
    ],
})



const roles = [
    {
        id : "1236418493986115654",
        label : "blue-role",
    },
    {
        id : "1236418665855848509",
        label : "red-role",
    },
]

client.on('ready', async (c) => {
    try {
        const channel = await client.channels.cache.get('1234809062894342198');
        if (!channel) {return ;}
        const row = new ActionRowBuilder();
        
        roles.forEach((role) => {
            row.components.push(
                new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary)
            )
        });

        await channel.send({
            content : "Claim a role",
            components : [row],
        });

        process.exit();

    } catch (error) {
        console.log(error);
    }
});

client.login(process.env.TOKEN)