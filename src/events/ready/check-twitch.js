const fs = require('fs');
require('dotenv/config');

const Stream = require('../../utils/getStreams');
const Auth = require('../../utils/auth');
const Channel = require('../../utils/channelData');

const twitchNotificationConfig = require('../../models/twitchNotificationConfig');
const { EmbedBuilder } = require('discord.js');

/**
 * 
 * @param {import('discord.js').Client} client 
 */
module.exports = (client) => {
    UpdateAuthConfig();
    
    var Check = async function(){
        const tempDataArray = await twitchNotificationConfig.find();
        const configData = JSON.parse(fs.readFileSync('./config.json'));
    
        for (const tempData of tempDataArray){
            if (!tempData.ChannelName) return;
    
            let StreamData = await Stream.getData(tempData.ChannelName, process.env.TWITCH_ID, configData.authToken);
            // console.log(StreamData);
            if (StreamData.data.length == 0) continue;
    
            StreamData = StreamData.data[0];
    
            //channel data for thumbnail
            const ChannelData = await Channel.getData(tempData.ChannelName, process.env.TWITCH_ID, configData.authToken);
            if (!ChannelData) continue;
    
            //embed structure
            var sendEmbed = new EmbedBuilder()
                .setTitle(`🔴 ${StreamData.user_name} is now live`)
                .setDescription(StreamData.title)
                .setURL(`https://www.twitch.tv/${StreamData.user_login}`)
                .setColor(6570404)
                .addFields([
                    { name : "Playing :", value : `${StreamData.game_name}`, inline : true },
                    { name : "Viewers:", value : `${StreamData.viewer_count}`, inline : true },
                    { name : "twitch", value : `[Watch Stream](https://twitch.tv/${StreamData.user_login})`}
                ])
                .setFooter({
                    text : StreamData.started_at
                })
                .setImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${StreamData.user_login}-640x360.jpg?cacheBypass=${(Math.random()).toString()}`)
                .setThumbnail(`${ChannelData.thumbnail_url}`)
            
            const targetGuild = client.guilds.cache.get(tempData.GuildId) || (await client.guilds.fetch(tempData.GuildId));
            if(!targetGuild) {
                await twitchNotificationConfig.findOneAndDelete({_id : tempData._id});
                continue;
            };
    
            const targetChannel = targetGuild.channels.cache.get(tempData.notificationChannelId) || (await targetGuild.channels.fetch(tempData.notificationChannelId));
            if (!targetChannel) {
                await twitchNotificationConfig.findOneAndDelete({_id : tempData._id});
                continue;
            }
    
            if (tempData.twitchStreamId == StreamData.id) {
                targetChannel.messages.fetch(tempData.discordMessageId).then(msg => {
                    msg.edit({ embeds : [sendEmbed] })
                })
            } else {
                await targetChannel.send({ embeds : [sendEmbed] }).then(msg => {
                    tempData.discordMessageId = msg.id;
                    tempData.twitchStreamId = StreamData.id;
                })
            }
    
            tempData.save().catch((e) => {
                console.log(`Error in saving data to database`);
            });
        }
    }

    var updateAuth = async function() {
        UpdateAuthConfig();
    };
    
    async function UpdateAuthConfig(){
    
        //get the auth key
        const authKey = await Auth.getKey(process.env.TWITCH_ID, process.env.TWITCH_SECRET);
        if (!authKey) return;
    
        //write the new auth key
        var tempConfig = JSON.parse(fs.readFileSync('./config.json'));
        tempConfig.authToken = authKey;
        fs.writeFileSync('./config.json', JSON.stringify(tempConfig));
    }
    
    Check();
    setInterval(Check, 120000);

    updateAuth();
    setInterval(updateAuth, 3.6e+6);
    
};







