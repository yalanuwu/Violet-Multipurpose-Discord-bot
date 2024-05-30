const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder } = require('discord.js');
const NotificationConfig = require('../../models/NotificationConfig');
const Parser = require('rss-parser');

const parser = new Parser();

/**
 * 
 * @param {import('commandkit').SlashCommandProps} param0 
 */
async function run ({ interaction }) {
    try {
        await interaction.deferReply({ ephemeral : true });
        const targetYtChannelId = interaction.options.getString('youtube-id');
        const targetNotificationChannel = interaction.options.getChannel('target-channel');
        const targetCustomMessage = interaction.options.getString('custom-message');

        const duplicateExists = await NotificationConfig.exists({
            notificationChannelId : targetNotificationChannel.id,
            ytChannelId : targetYtChannelId,
        });
        if (duplicateExists) {
            interaction.followUp(
                'Youtube channel already configured for the text channel.\n Run `/notification-remove` first.'
            );
            return ;
        };
        const YOUTUBE_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${targetYtChannelId}`;
        const feed = await parser.parseURL(YOUTUBE_RSS_URL).catch((e) => {
            interaction.followUp('There was an error parsing the channel. Ensure the ID is correct.');
            return ;
        });
        if (!feed) return;

        const channelName = feed.title;

        const notificationConfig = new NotificationConfig({
            guildId : interaction.guildId,
            notificationChannelId : targetNotificationChannel.id,
            ytChannelId : targetYtChannelId,
            lastChecked : new Date(),
            customMessage : targetCustomMessage,
            lastCheckedVid : null,
        });

        if (feed.items.length) {
            const latestVideo = feed.items[0];
            notificationConfig.lastCheckedVid = {
                id : latestVideo.id.split(':')[2],
                pubDate : latestVideo.pubDate,
            };
        };

        notificationConfig.save()
            .then(() => {
                const embed = new EmbedBuilder()
                    .setTitle('✅Youtube notification config successful')
                    .setDescription(`${targetNotificationChannel} will receive notification whenever there is new upload by ${channelName}`)
                    .setTimestamp();
                interaction.followUp({ embeds : [embed] });
            })
            .catch((e) => {
                interaction.followUp('Unexpected database error. Please try again.')
            })

    } catch (error) {
        console.log(`Error in ${__filename}\n`, error);
    }
};

const data = new SlashCommandBuilder()
    .setName('notification-config')
    .setDescription('Setup Youtube notification for channel')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) => 
        option
            .setName('youtube-id')
            .setDescription('The ID of the youtube channel')
            .setRequired(true)
    )
    .addChannelOption((option) => 
        option
            .setName('target-channel')
            .setDescription('Select the chanel where you want your notification')
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
            .setRequired(true)
    )
    .addStringOption((option) => 
        option
            .setName('custom-message')
            .setDescription('Templates : {VIDEO_TITLE} {VIDEO_URL} {CHANNEL_NAME} {CHANNEL_URL}')
    );

module.exports = { data, run };