const twitchNotificationConfig = require('../../models/twitchNotificationConfig');
const {SlashCommandBuilder, ChannelType} = require('discord.js')

/**
 * 
 * @param {import('commandkit').SlashCommandProps} param0 
 */
async function run ({interaction}){

    const targetTwitchName = interaction.options.getString('streamer-name') 
    const targetChannelId = interaction.options.getChannel('channel')
    const docs = await twitchNotificationConfig.findOne({
        ChannelName : targetTwitchName,
        notificationChannelId : targetChannelId.id
    });
    await interaction.deferReply({ephemeral : true});
        
        
    if (!docs) {
        interaction.followUp("The channel is not configured for notification in the mentioned channel");
        return;
    }
    twitchNotificationConfig.findOneAndDelete({ _id: docs._id })
        .then((e) => {
            interaction.followUp(`Removed notification for channel : ${targetTwitchName}`)
        })
        .catch((e) => {
            interaction.followUp(`Error in database. Please try again later. ${e}`)
        })
}

const data = new SlashCommandBuilder()
    .setName('remove-twitch-channel')
    .setDescription('Remove twitch id\'s ')
    .setDMPermission(false)
    .addStringOption((option) => 
        option
            .setName('streamer-name')
            .setDescription('Mention the id of the streamer')
            .setRequired(true)
    )
    .addChannelOption((option) => 
        option
            .setName('channel')
            .setDescription('The configured channel')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildAnnouncement, ChannelType.GuildText)
    )

module.exports = { data, run };