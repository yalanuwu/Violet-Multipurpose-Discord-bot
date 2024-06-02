const { Schema,model } = require('mongoose');

const welcomeChannelSchema = new Schema({
    guildId : {
        type : String,
        required : true,
    },
    channelId : {
        type : String,
        unique : true,
        required : true,
    },
    customMessage : {
        type : String,
        default : null,
    },
}, { timestamps : true });

module.exports = model('WelcomeChannelSchema', welcomeChannelSchema);
