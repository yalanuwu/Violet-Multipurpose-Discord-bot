require("dotenv").config()
const {REST, Routes, ApplicationCommandOptionType} = require("discord.js");
const { type } = require("os");

const commands = [
    {
        name : 'hey',
        description : 'hey command',
    },
    {
        name : 'add',
        description : 'Adds two numbers',
        options : [
            {
                name : 'first-num',
                description : 'the first number',
                type : ApplicationCommandOptionType.Number,
                required : true,
            },
            {
                name : 'second-num',
                description : 'the second number',
                type : ApplicationCommandOptionType.Number,
                required : true,
            }
        ]
        
    },
    {
        name : 'embed',
        description : "creates an embed",
    },
]

const rest = new REST({version : '10'}).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering Slash commands')

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ), {body : commands}
        )

        console.log('Slash command registered successfully')

    } catch (error) {
        console.log(`There was an error : ${error}`)
    }
} )();

