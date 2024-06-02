const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const welcomeChannelSchema = require('../../models/WelcomeChannel');

/**
 * 
 * @param {import('commandkit').SlashCommandProps} param0 
 */
async function run({ interaction }) {
    try {
        const targetChannel = interaction.options.getChannel('target-channel');
        await interaction.deferReply({ephemeral : true});
        const query = {
            guildId : interaction.guildId,
            channelId : targetChannel.id,
        };

        const channelExistInDb = await welcomeChannelSchema.exists(query);
        if(!channelExistInDb){
            interaction.followUp('That channel has not been configured for welcome messages');
            return;
        };

        welcomeChannelSchema.findOneAndDelete(query)
            .then(() => {
                interaction.followUp(`Removed ${targetChannel} from receiving welcome messages`);
            })
            .catch((error) => {
                interaction.followUp(`Error in DB. Please try again later.`);
                console.log(`DB error in ${__filename}`,error);
            })
    } catch (error) {
        console.log(`Error in ${__filename}\n`, error);
    }
}

const data = new SlashCommandBuilder()
    .setName('remove-welcome-channel')
    .setDescription('Remove welcome channel')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
        option
            .setName('target-channel')
            .setDescription('The channel to remove welcome feature from')
            .addChannelTypes(ChannelType.GuildAnnouncement, ChannelType.GuildText)
            .setRequired(true)
    );

module.exports = { data , run };