const { Client, Interaction, PermissionFlagsBits} = require('discord.js');
const AutoRole = require('../../models/autoRole');


module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback : async (client, interaction) => {
        try {
            await interaction.deferReply();
            if (! (await AutoRole.exists({ guildId : interaction.guild.id }))){
                interaction.editReply("Auto Role has not been configured for this server.");
                return;
            }
            await AutoRole.findOneAndDelete({ guildId : interaction.guild.id});
            interaction.editReply("Auto Role has been disabled.");
        } catch (error) {
            console.log(error);
        }
    },
    name: 'autorole-disable',
    description : 'Disable autoRole function',
    permissionsRequired : [PermissionFlagsBits.Administrator],

}