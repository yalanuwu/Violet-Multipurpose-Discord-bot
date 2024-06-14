const { SlashCommandBuilder } = require('discord.js');
const AutoRole = require('../../models/autoRole');

module.exports = {
    /**
     * 
     * @param {import('commandkit').SlashCommandProps} param0 
     */
    run : async({interaction}) => {
        const targetRoleId = interaction.options.get('role').value;
        try {
            await interaction.deferReply();
            let autoRole = await AutoRole.findOne({ guildId : interaction.guild.id})
            if (autoRole){
                if (autoRole.roleId === targetRoleId){
                    interaction.editReply("The auto role has already been configured for this role. To disable run `/autoRole-disable`");
                    return;
                }
                autoRole.roleId = targetRoleId;
            } else {
                autoRole = new AutoRole({
                    guildId : interaction.guild.id,
                    roleId : targetRoleId,
                });
            }
            await autoRole.save();
            interaction.editReply("Auto role has been configured. To disable run `/autoRole-disable`");
        } catch (error) {
            console.log(`Error in file : ${__filename} : ${error}`);
        }
    },
    options : {
        userPermissions : ['Administrator'],
        botPermissions : ['ManageRoles'],
    },

    data : new SlashCommandBuilder()
        .setName('autorole-config')
        .setDescription('Setup auto role for this server')
        .setDMPermission(false)
        .addRoleOption((option) => 
            option
                .setName('role')
                .setDescription('The role you want')
                .setRequired(true)
        )

}

