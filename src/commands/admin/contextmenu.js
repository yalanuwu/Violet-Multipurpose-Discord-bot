const { Client, Interaction, ContextMenuCommandBuilder, ApplicationCommandType, REST, Routes } = require('discord.js');
require('dotenv/config');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback : (client, interaction) => {
        const commandData = [
            new ContextMenuCommandBuilder()
                .setName('User Information')
                .setType(ApplicationCommandType.User),
            new ContextMenuCommandBuilder()
                .setName('Translate Message')
                .setType(ApplicationCommandType.Message),
        ]
        const rest = new REST().setToken(process.env.TOKEN);
        (async () => {
            try {
                console.log("Refreshing context menu commands");
                await rest.put(
                    Routes.applicationCommands(process.env.CLIENT_ID),
                    { body : commandData }
                )
            } catch (error) {
                console.log(error);
            }
        })();
    },
    name : 'contextmenu',
    description : 'Context menu',
}