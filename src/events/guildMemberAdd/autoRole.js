const { Client, GuildMember} = require('discord.js');
const AutoRole = require('../../models/autoRole');

/**
 * 
 * @param {Client} client
 * @param {GuildMember} member 
 */
module.exports = async ( client, member ) => {
    try {
        let guild = member.guild;
        if (!guild) {
            return;
        };
        const autoRole = await AutoRole.findOne({ guildId : interaction.guild.id });
        if (!autoRole) return;
        await member.roles.add(autoRole.roleId);
    } catch (error) {
        console.log(`Error in file : ${__filename} : ${error}`);
    }
}