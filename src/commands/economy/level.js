const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const Level = require('../../models/level');
const calculateLevelXp = require('../../utils/calculateLevelXp')
const canvacord = require('canvacord');

module.exports = {
    
    /**
     * 
     * @param {import('commandkit').SlashCommandProps} param0 
     */
    run : async ({ client, interaction }) => {
        if (!interaction.inGuild()) {
            interaction.reply('You can only run this command inside a server.');
            return;
        };

        await interaction.deferReply();

        const mentionedUserId = interaction.options.get('target-user')?.value;
        const targetUserId = mentionedUserId || interaction.member.id;
        const targetUserObj = await interaction.guild.members.fetch(targetUserId);

        const fetchedLevel = await Level.findOne({
            userId: targetUserId,
            guildId: interaction.guild.id,
        });

        if (!fetchedLevel) {
            interaction.editReply(
              mentionedUserId
                ? `${targetUserObj.user.tag} doesn't have any levels yet. Try again when they chat a little more.`
                : "You don't have any levels yet. Chat a little more and try again."
            );
            return;
        }
      
        let allLevels = await Level.find({ guildId: interaction.guild.id }).select(
            '-_id userId level xp'
        );
      
        allLevels.sort((a, b) => {
            if (a.level === b.level) {
              return b.xp - a.xp;
            } else {
              return b.level - a.level;
            }
        });
      
        let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;
        canvacord.Font.loadDefault();
        const rank = new canvacord.RankCardBuilder()
            .setDisplayName(targetUserObj.user.displayName)
            .setAvatar(targetUserObj.user.displayAvatarURL({ size : 256 }))
            .setRank(currentRank)
            .setLevel(fetchedLevel.level)
            .setCurrentXP(fetchedLevel.xp)
            .setRequiredXP(calculateLevelXp(fetchedLevel.level))
            .setStatus(targetUserObj.presence.status)
            .setUsername(targetUserObj.user.username)
            
        const data = await rank.build({
            format : 'png'
        });
        const attachment = new AttachmentBuilder(data);
        interaction.editReply({ files : [attachment] })
    },

    data : new SlashCommandBuilder()
        .setName('level')
        .setDescription('Show the rank / xp of the user')
        .setDMPermission(false)
        .addUserOption((option) => 
            option
                .setName('target-user')
                .setDescription('show the rank / xp of the target-user')
                
        )
    
}