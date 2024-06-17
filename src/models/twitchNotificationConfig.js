const mongoose = require('mongoose');

const twitchNotificationConfig = new mongoose.Schema({
    ChannelName : {
        type : String,
        required : true,
    },
    notificationChannelId : {
        type : String,
        required : true,
    },
    GuildId : {
        type : String,
        required : true,
    },
    discordMessageId : {
        type : String,
        // required : true
    },
    twitchStreamId : {
        type : String,
        // required : true
    }
});

module.exports = mongoose.model('twitchNotificationConfig', twitchNotificationConfig);