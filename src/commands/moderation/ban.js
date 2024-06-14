const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    /**
     * 
     * @param {import('commandkit').SlashCommandProps} param0 
     * @returns 
     */
    run : async ({interaction}) => {
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
    options : {
        userPermissions : ['Administrator'],
        botPermissions : ['Administrator'],
    },

    data : new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member')
        .setDMPermission(false)
        .addUserOption((option) => 
            option 
                .setName('user-name')
                .setDescription('The user you want to ban')
                .setRequired(true)
        )
        .addStringOption((option) => 
            option 
                .setName('reason')
                .setDescription('The reason for the ban')
        )
}