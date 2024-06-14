const { SlashCommandBuilder } = require('discord.js');
const AutoRole = require('../../models/autoRole');

module.exports = {
    /**
     * 
     * @param {import('commandkit').SlashCommandProps} param0 
     */
    run : async ({ interaction }) => {
        try {
            await interaction.deferReply();
            if (! (await AutoRole.exists({ guildId : interaction.guild.id }))){
                interaction.editReply("Auto Role has not been configured for this server.");
                return;
            }
            await AutoRole.findOneAndDelete({ guildId : interaction.guild.id});
            interaction.editReply("Auto Role has been disabled.");
        } catch (error) {
            console.log(`Error in file ${__filename} : ${error}`);
        }
    },
    options : {
        userPermissions : ['Administrator']
    },

    data : new SlashCommandBuilder()
        .setName('autorole-disable')
        .setDescription('Disable Auto role for this server')
}