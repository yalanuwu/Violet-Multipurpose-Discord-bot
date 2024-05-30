//ROCK PAPER SCISSOR MULTIPLAYER GAME
const { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const choices = [
    {name : 'Rock', emoji : '🪨', beats : 'Scissor'},
    {name : 'Paper', emoji : '📃', beats : 'Rock'},
    {name : 'Scissor', emoji : '✂️', beats : 'Paper'},
];

module.exports = {
    /**
     * 
     * @param {Object} param0 
     * @param {ChatInputCommandInteraction} param0.interaction
     */
    run : async ({interaction}) => {
        try {
            const targetUser = interaction.options.getUser('user');
            if (interaction.user.id === targetUser.id){
                interaction.reply({
                    content : 'You can\'t play rock-paper-scissor with yourself',
                    ephemeral : true,
                });
                return;
            };

            if (targetUser.bot) {
                interaction.reply({
                    content : "Can't play with bot",
                    ephemeral : true,
                });
                return;
            };

            const embed = new EmbedBuilder()
                .setTitle('ROCK-PAPER-SCISSOR')
                .setDescription(`It's ${targetUser}'s turn`)
                .setColor('Aqua')
                .setTimestamp(new Date())

            const buttons = choices.map((choice) => {
                return new ButtonBuilder()
                    .setCustomId(choice.name)
                    .setLabel(choice.name)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(choice.emoji)
            });

            const row = new ActionRowBuilder().addComponents(buttons)

            const reply = await interaction.reply({
                content : `${targetUser}, you have been challenged in a game of rock paper scissor by ${interaction.user}. To start playing click one of the buttons below`,
                components : [row],
                embeds : [embed],
            });

            const targetUserInteraction = await reply.awaitMessageComponent({
                filter : (i) => i.user.id === targetUser.id,
                time : 30000,
            }).catch(async (error) => {
                embed.setDescription(`Game over. ${targetUser} didn't respond in time`);
                await reply.edit({embeds : [embed], components : []});
            });

            if (!targetUserInteraction){
                return;
            };

            const targetUserChoice = choices.find(
                (choice) => choice.name === targetUserInteraction.customId,
            );

            await targetUserInteraction.reply({
                content : `You picked ${targetUserChoice.name + targetUserChoice.emoji}`,
                ephemeral : true,
            });
            
            //Edit the embed every time user selects an option
            embed.setDescription(`It's currently ${interaction.user}'s turn`);
            await reply.edit({
                content : `${interaction.user} it's turn now`,
                ephemeral : true,
                embeds : [embed],
            });

            const initialUserInteraction = await reply.awaitMessageComponent({
                filter : (i) => i.user.id === interaction.user.id,
                time : 30000,
            }).catch(async (error) => {
                embed.setDescription(`Game over. ${interaction.user} didn't respond in time`);
                await reply.edit({embeds : [embed], components : []});
            });

            if (!initialUserInteraction){
                return;
            };

            const initialUserChoice = choices.find(
                (choice) => choice.name === initialUserInteraction.customId
            );

            let result;
            if (targetUserChoice.beats === initialUserChoice.name) { result = `${targetUser} won`};
            if (initialUserChoice.beats === targetUserChoice.name) { result = `${interaction.user} won`};
            if (initialUserChoice.name === targetUserChoice.name) { result = `It's a tie.`};

            embed.setDescription(
                `${targetUser} picked  ${targetUserChoice.name + targetUserChoice.emoji}\n
                ${interaction.user} picked ${initialUserChoice.name + initialUserChoice.emoji}\n\n
                ${result}`
            );

            reply.edit({ embeds : [embed], components : [] });
        } catch (error) {
            console.log(`Error with /rps : ${error}`);
        }
    },
    data : {
        name : 'rps',
        description : 'Play rock paper scissor with another user',
        dm_permission : false,
        options : [
            {
                name : 'user',
                description : 'The user you want to play against',
                type : ApplicationCommandOptionType.User,
                required : true,
            }
        ]
    },

}