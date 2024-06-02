const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const WelcomeChannelSchema = require('../../models/WelcomeChannel');

/**
 * 
 * @param {import('commandkit').SlashCommandProps} param0 
 */
async function run({ interaction }) {
    try {
        const targetChannel = interaction.options.getChannel('target-channel');
        const customMessage = interaction.options.getString('custom-message');
        await interaction.deferReply({ephemeral : true});

        const query = {
            guildId : interaction.guildId,
            channelId : targetChannel.id,
        };

        const channelExistInDb = await WelcomeChannelSchema.exists(query);
        if (channelExistInDb) {
            interaction.followUp('This channel has already been configured for welcome');
            return;
        };

        const newWelcomeChannel = new WelcomeChannelSchema({
            ...query,
            customMessage,
        });

        newWelcomeChannel.save()
            .then(() => {
                interaction.followUp(`Configured ${targetChannel} to receive welcome Message`);
            })
            .catch(() => {
                interaction.followUp('Database Error. Please try again later');
                console.log(`Database error in ${__filename} :\n`, error)
            })
    } catch (error) {
        console.log(`Error in ${__filename} : ${error}`)
    }
}

const data = new SlashCommandBuilder()
    .setName('setup-welcome-channel')
    .setDescription('Setup a channel for welcome messages')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
        option
            .setName('target-channel')
            .setDescription('The channel you want to get welcome messages in')
            .addChannelTypes(ChannelType.GuildAnnouncement, ChannelType.GuildText)
            .setRequired(true)
    )
    .addStringOption((option) => 
        option
            .setName('custom-message')
            .setDescription('TEMPLATES : {mention-member} {username} {server-name} {member-count}')
    );

module.exports = { data , run }