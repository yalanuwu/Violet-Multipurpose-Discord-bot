const { ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const GuildConfiguration = require('../models/GuildConfiguration');
const suggestion = require('../models/suggestion');
const formatResults = require("../utils/formatResults");

module.exports = {
    data : {
        name : 'suggest',
        description : 'Create a suggestion',
        dm_permission : false,
    },

    /**
     * 
     * @param {Object} param0
     * @param {ChatInputCommandInteraction} param0.interaction 
     */
    run : async ({ interaction }) => {
        try {
            const guildConfiguration = await GuildConfiguration.findOne({ guildId : interaction.guildId });
        
        if (!guildConfiguration?.suggestionChannelIds.length) {
            await interaction.reply(
                'This server has not been configured to use suggestions yet.\nAsk an admin to run `/config-suggestion` to set this up'
            );
            return ;
        }

        if (!guildConfiguration?.suggestionChannelIds.includes(interaction.channelId)) {
            await interaction.reply(
                `This channel is not configured to use suggestions. Try one of these channels instead : ${guildConfiguration.suggestionChannelIds
                    .map((id) => `<#${id}>`)
                    .join(', ')} `
            );
            return ;
        }

        const modal = new ModalBuilder().setTitle('Create a suggestion').setCustomId(`suggestion-${interaction.user.id}`);
        const textInput = new TextInputBuilder()
            .setCustomId('suggestion-input')
            .setLabel('What would you like to suggest')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMaxLength(1000);
        const actionRow = new ActionRowBuilder().addComponents(textInput);

        modal.addComponents(actionRow);
        await interaction.showModal(modal);
        const filter = (i) => i.customId === `suggestion-${interaction.user.id}`;

        const modalInteraction = await interaction.awaitModalSubmit({
            filter,
            time : 1000 * 60 * 3
        }).catch((error) => console.log(error));

        await modalInteraction.deferReply({ ephemeral : true });
        let suggestionMessage;
        try {
            suggestionMessage = await interaction.channel.send(' Creating suggestion please wait ... ');
        } catch (error) {
            modalInteraction.editReply(
                'Failed to create suggestion in this channel. I may not have enough permissions '
            );
            return ;
        }

        const suggestionText = modalInteraction.fields.getTextInputValue('suggestion-input');
        const newSuggestion = new suggestion({
            authorId : interaction.user.id,
            guildId : interaction.guildId,
            messageId : suggestionMessage.id,
            content : suggestionText,
        });
        await newSuggestion.save();
        modalInteraction.editReply('Suggestion Created');
        
        
        //Suggestion Embed
        const suggestionEmbed = new EmbedBuilder()
            .setAuthor({
                name : interaction.user.username,
                iconURL : interaction.user.displayAvatarURL({ size : 256 })
            })
            .addFields([
                { name : 'Suggestion', value : suggestionText },
                { name : 'Status', value : 'Pending..'},
                {name : 'Votes', value : formatResults()}
            ])
            .setColor("Yellow")

        //Config buttons
        const upVote = new ButtonBuilder()
            .setEmoji('👍')
            .setLabel('UPVOTE')
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`suggestion.${newSuggestion.suggestionId}.upvote`)

        const downVote = new ButtonBuilder()
            .setEmoji('👎')
            .setLabel('DOWNVOTE')
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`suggestion.${newSuggestion.suggestionId}.downvote`)
        
        const approveButton = new ButtonBuilder()
            .setEmoji('✅')
            .setLabel('Approve')
            .setStyle(ButtonStyle.Success)
            .setCustomId(`suggestion.${newSuggestion.suggestionId}.approve`)
        
        const rejectButton = new ButtonBuilder()
            .setEmoji('🗑️')
            .setLabel('Reject')
            .setStyle(ButtonStyle.Danger)
            .setCustomId(`suggestion.${newSuggestion.suggestionId}.reject`)
        
        const secondRow = new ActionRowBuilder()
            .addComponents(approveButton, rejectButton)
        
        const firstRow = new ActionRowBuilder()
            .addComponents(upVote, downVote)
        
        suggestionMessage.edit({
            content : `${interaction.user} Suggestion created`,
            embeds : [suggestionEmbed],
            components : [firstRow, secondRow]
        })
        } catch (error) {
            console.log(`Error Occurred in /suggest : ${error}`);
        }
    }
}