const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js')
const AutoRole = require('../../models/autoRole');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback : async (client, interaction) => {
        if (!interaction.inGuild()){
            interaction.reply("You can only run this command inside the server");
            return;
        };
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
            
        }

    },
    name : 'autorole-configure',
    description : 'Configure auto role for this server',
    options : [
        {
            name : 'role',
            description : "The role you want",
            type : ApplicationCommandOptionType.Role,
            required : true,
        }
    ],
    permissionsRequired : [PermissionFlagsBits.Administrator],
    botPermissions : [PermissionFlagsBits.ManageRoles],
}