const request = require('request')

async function getData(channelName, clientID, authKey) {
    return new Promise((resolve, reject) => {
        var headers = {
            'Client-Id': clientID,
            'Authorization': `Bearer ${authKey}`
        };
        request.get(
            `https://api.twitch.tv/helix/streams?user_login=${channelName}`,{headers:headers},
            (error, res, body) => {
                if (error) {
                    return console.error(error)
                }
                try{
                    resolve(JSON.parse(body))
                }catch(e){
                    reject(e)
                }
            }
        )
    });
}

module.exports = { getData };