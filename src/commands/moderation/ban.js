const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name : "ban",
    description : "Ban a selected member",
    // devOnly : Boolean,
    // testOnly : Boolean,

    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */

    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get('user-name').value;
        const reason = interaction.options.get('reason')?.value || "No reason provided";

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if (!targetUser){
            await interaction.editReply("The given user doesn't exists.");
            return;
        };
        if (targetUser.id === interaction.guild.ownerId){
            await interaction.editReply("Cant't ban the owner.");
            return ;
        };
        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;

        if (targetUserRolePosition >= requestUserRolePosition){
            await interaction.editReply("Can't ban the given member cause the roles are equal/higher than your role");
            return ;
        };
        if (targetUserRolePosition >= botRolePosition){
            await interaction.editReply("Can't ban the given user cause bot doesn't have higher role than the member");
            return ;
        }

        try {
            await targetUser.ban({ reason });
            await interaction.editReply(`Banned the user ${targetUser}\nReason : ${ reason }`);
        } catch (error) {
            console.log(`Can't ban member some error occurred ${error}`);
        }

    },

    options : [
        {
            name : "user-name",
            description : "The user name you want to ban!",
            required : true,
            type : ApplicationCommandOptionType.Mentionable,
        },
        {
            name : "reason",
            description : "The reason you want to ban!",
            // required : true,
            type : ApplicationCommandOptionType.String,
        }
    ],
    permissionsRequired : [PermissionFlagsBits.Administrator],
    botPermissions : [PermissionFlagsBits.Administrator],


    

};