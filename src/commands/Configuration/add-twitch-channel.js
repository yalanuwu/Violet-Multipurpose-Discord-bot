const { SlashCommandBuilder, ChannelType } = require("discord.js");
const twitchNotificationConfig = require("../../models/twitchNotificationConfig");

/**
 * 
 * @param {import('commandkit').SlashCommandProps} param0 
 */
async function run({client, interaction}) {
    try {
        await interaction.deferReply({ephemeral : true});
        const targetTwitchId = interaction.options.getString('streamer-name');
        const targetChannelId = interaction.options.getChannel('channel');

        const duplicateExists = await twitchNotificationConfig.exists({
            ChannelName : targetTwitchId,
            notificationChannelId : targetChannelId.id
        });

        if (duplicateExists) {
            interaction.followUp(
                'Twitch channel already added. Use `remove-twitch-channel` to remove.'
            );
            return;
        };

        const TwitchNotificationConfig = new twitchNotificationConfig({
            ChannelName : targetTwitchId,
            notificationChannelId : targetChannelId.id,
            GuildId : interaction.guildId,
            twitchStreamId : null,
            discordMessageId : null
        });

        TwitchNotificationConfig.save()
            .then(() => {
                interaction.followUp('Channel Added Successfully');
            })
            .catch((e) => {
                interaction.followUp('Database error. Please try again later.');
            })
        
        
    } catch (error) {
        console.log(`Error in ${__filename} : ${error}`)
    }

}

const data = new SlashCommandBuilder()
    .setName('add-twitch-channel')
    .setDescription('Add twitch id\'s ')
    .setDMPermission(false)
    .addStringOption((option) => 
        option
            .setName('streamer-name')
            .setDescription('Add the id of the streamer')
            .setRequired(true)
    )
    .addChannelOption((option) => 
        option
            .setName('channel')
            .setDescription('The channel where you want your notification')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildAnnouncement, ChannelType.GuildText)
    )

module.exports = { data, run };