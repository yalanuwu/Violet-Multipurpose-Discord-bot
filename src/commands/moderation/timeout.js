const { SlashCommandBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
    /**
     * 
     * @param {import('commandkit').SlashCommandProps} param0 
     */
    run : async ({interaction}) => {
        const mentionable = interaction.options.get('target-user').value;
        const duration = interaction.options.get('time-duration').value;
        const reason = interaction.options.get('reason')?.value || "No reason provided";

        await interaction.deferReply();
        const targetUser = await interaction.guild.members.fetch(mentionable);
        if (!targetUser) {
            await interaction.editReply("User doesn't exist");
            return ;
        }
        if (targetUser.user.bot){
            await interaction.editReply("Can't timeout a bot");
            return ;
        }
        const msDuration = ms(duration);
        if (isNaN(msDuration)){
            await interaction.editReply("Not a valid duration time");
            return ;
        }
        if (msDuration < 5000 || msDuration > 2.419e9){
            await interaction.editReply("The timeout duration can't be less than 5 sec or more than 28 days");
            return ;
        }
        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;

        if (targetUserRolePosition >= requestUserRolePosition){
            await interaction.editReply("Can't timeout the given member cause the roles are equal/higher than your role");
            return ;
        };
        if (targetUserRolePosition >= botRolePosition){
            await interaction.editReply("Can't timeout the given user cause bot doesn't have higher role than the member");
            return ;
        };
        //TImeout logic
        try {
            const { default : prettyMs } = await import('pretty-ms');
            if (targetUser.isCommunicationDisabled()){
                await targetUser.timeout(msDuration, reason);
                await interaction.editReply(`${targetUser}'s timeout has been updated to ${prettyMs(msDuration, { verbose : true })}\nReason : ${reason}`);
                return ;
            }
            await targetUser.timeout(msDuration, reason);
            await interaction.editReply(`${targetUser} has been timed out for ${prettyMs(msDuration, { verbose : true })}\nReason: ${ reason }`);
        } catch (error) {
            console.log(`Can't timeout member because some error occurred : ${error}`);
        };
    },
    data : new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout the mentioned user')
        .setDMPermission(false)
        .addUserOption((option) => 
            option
                .setName('target-user')
                .setDescription('The user you want to timeout')
                .setRequired(true)
        )
        .addStringOption((option) => 
            option
                .setName('time-duration')
                .setDescription('Timeout duration(1m, 1h , 1d)')
                .setRequired(true)
        )
        .addStringOption((option) => 
            option
                .setName('reason')
                .setDescription('The reason you want to timeout the member')
        )
}