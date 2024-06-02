const WelcomeChannelSchema = require('../../models/WelcomeChannel')

/**
 * 
 * @param {import('discord.js').GuildMember} guildMember 
 */
module.exports = async (guildMember) => {
    try {
        if (guildMember.user.bot) { return; }

        const welcomeConfigs = await WelcomeChannelSchema.find({
            guildId : guildMember.guild.id,
        });

        if (!welcomeConfigs.length) { return; }

        for (const welcomeConfig of welcomeConfigs){
            const targetChannel = guildMember.guild.channels.cache.get(
                welcomeConfig.channelId
            ) || (await guildMember.guild.channels.fetch(welcomeConfig.channelId));

            if (!targetChannel) {
                WelcomeChannelSchema.findOneAndDelete({
                    guildId : guildMember.guild.id,
                    channelId : welcomeConfig.channelId,
                }).catch((e) => {console.log(e)});
                return;
            };

            const customMessage = welcomeConfig.customMessage || 'Hey {username}👋. Welcome to {server-name}!!!';

            const welcomeMessage = customMessage
                .replace('{mention-member}', `<@${guildMember.id}>`)
                .replace('{username}', guildMember.user.username)
                .replace('{server-name}', guildMember.guild.name)
                .replace('{member-count}', String(guildMember.guild.approximateMemberCount));
            
            targetChannel.send(welcomeMessage).catch((e) => { console.log(e);});
        };
    } catch (error) {
        console.log(`Error in ${__filename} : ${error}`);
    }
}