
module.exports = {
    name : "ping",
    description : "Gives the ping of the bot",
    // devOnly : Boolean,
    testOnly : true,
    // options : Object[]


    callback: async (client, interaction) => {
        await interaction.deferReply();
        const reply = await interaction.fetchReply();
        const ping = reply.createdTimestamp - interaction.createdTimestamp
        interaction.editReply(`Pong!! Client ${ping} ms`);

    },

};