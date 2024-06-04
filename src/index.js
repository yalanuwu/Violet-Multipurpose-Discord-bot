const { Client, GatewayIntentBits } = require('discord.js');
const { CommandKit } = require('commandkit');
const mongoose = require('mongoose');
require('dotenv/config');

const client = new Client({
    intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent', 'GuildMessagePolls', 'GuildPresences'],
  });
  
  new CommandKit({
    client,
    commandsPath: `${__dirname}/commands`,
    eventsPath: `${__dirname}/events`,
    bulkRegister: true,
  });
  
  mongoose.connect(process.env.MONG_URI).then(() => {
    console.log('Connected to MongoDB');

    client.login(process.env.TOKEN);
  });

