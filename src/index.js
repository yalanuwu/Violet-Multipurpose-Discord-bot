require("dotenv").config()
const { Client, IntentsBitField, EmbedBuilder , ActivityType} = require("discord.js");
const {  Interaction, ContextMenuCommandBuilder, ApplicationCommandType, REST, Routes } = require('discord.js');
const eventHandler = require("./handlers/eventHandler")
const mongoose = require('mongoose');

const client = new Client ({
    intents : [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildPresences,
        
    ],
});
//Context menu code here
// const commandData = [
//     new ContextMenuCommandBuilder()
//         .setName('User Information')
//         .setType(ApplicationCommandType.User),
//     new ContextMenuCommandBuilder()
//         .setName('Translate Message')
//         .setType(ApplicationCommandType.Message),
// ];
// const rest = new REST().setToken(process.env.TOKEN);
// (async () => {
//     try {
//         console.log("Refreshing context menu commands");
//         await rest.put(
//             Routes.applicationCommands(process.env.CLIENT_ID),
//             { body : commandData }
//         )
//     } catch (error) {
//         console.log(error);
//     }
// })();

// client.on('ready', (c) => {
//     console.log(`✅✨ ${c.user.tag} is online.`)

//     client.user.setActivity({
//         name : 'yalan',
//         type : ActivityType.Streaming,
//         url : "https://www.twitch.tv/smthlikeyou11"
//     })
// })



// client.on("messageCreate", (message) => {
//     if (message.author.bot){
//         return
//     }
//     if (message.content === "hello" || message.content === "hi"){
//         message.reply(`Hi 👋👋 ${message.author.globalName} wassup!!!`)
//     }
// })

// client.on('interactionCreate', async (interaction) => {
//     if (!interaction.isChatInputCommand()) { return; }

//     if (interaction.commandName === 'hey'){
//         interaction.reply('hello')
//     }
    
//     if(interaction.commandName === 'add'){
//         const num1 = interaction.options.get('first-num').value
//         const num2 = interaction.options.get('second-num').value
//         interaction.reply(`The sum is ${num1 + num2}`)
//     }

//     if (interaction.commandName === "embed"){
//         const exampleEmbed = new EmbedBuilder()
//             .setTitle("Hello world")
//             .setDescription("Says hello world")
//             .setColor('Random')
//             .addFields({
//                 name : "Field one",
//                 value : "Description one",
//                 inline : true,
//             },
//             {
//                 name : "Field two",
//                 value : "Description two",
//                 inline : true,
//             }
//     );
//         interaction.reply({ embeds: [exampleEmbed]})
//     }

    

// })

// client.on('interactionCreate', async (interaction) => {
//     if (!interaction.isButton()){ return; }
//     await interaction.deferReply({ ephemeral : true })
//     const role = interaction.guild.roles.cache.get(interaction.customId);
//     const hasRole = interaction.member.roles.cache.has(role.id)
//     if(hasRole){
//         await interaction.member.roles.remove(role);
//         await interaction.editReply(`The role ${role} has been removed`);
//         return;
//     }
//     await interaction.member.roles.add(role);
//     await interaction.editReply(`The role ${role} has been added`);
// });
(async () =>{
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.MONG_URI);
        console.log("connected to database");
        eventHandler(client);
        client.login(process.env.TOKEN)
    } catch (error) {
        console.log(`Error occurred : ${error}`);
    }
})();




