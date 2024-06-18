const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
} = require("discord.js");
const NotificationConfig = require("../../models/NotificationConfig");

/**
 *
 * @param {import('commandkit').SlashCommandProps;} param0
 */
async function run({ interaction }) {
    await interaction.deferReply({ ephemeral: true });
    const targetChannelId = interaction.options.getString("youtube-id");
    const targetNotificationChannel = interaction.options.getChannel("target-channel");

    const docs = await NotificationConfig.findOne({
        ytChannelId: targetChannelId,
        notificationChannelId: targetNotificationChannel.id,
    });

    if (!docs) {
        interaction.followUp("This channel is not configured for notification");
        return;
    }
    NotificationConfig.findOneAndDelete({ _id : docs._id })
        .then((e) => {
            interaction.followUp("Turned off notifications for that channel");
        })
        .catch((e) => {
            interaction.followUp(
                "There was an error in database. Please try again later"
            );
        });
}

const data = new SlashCommandBuilder()
    .setName("notification-remove")
    .setDescription("Removes the notification configuration")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
        option
            .setName("youtube-id")
            .setDescription("The ID of the channel")
            .setRequired(true)
    )
    .addChannelOption((option) =>
        option
            .setName("target-channel")
            .setDescription("The channel you want to remove notification from")
            .setRequired(true)
            .addChannelTypes(
                ChannelType.GuildAnnouncement,
                ChannelType.GuildText
            )
    );

module.exports = { data, run };
