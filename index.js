const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

// Render apgavystė, kad veiktų nemokamai
const app = express();
app.get('/', (req, res) => res.send('Botas gyvas!'));
app.listen(process.env.PORT || 3000);

// Boto smegenys
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    console.log('ShadowWolf išlindo iš miško!');
});
client.on('messageCreate', (message) => {
  if (message.content === '!ping') {
    message.reply('Pong! Aš gyvas, brolau!');
  }
});
client.login(process.env.BOT_TOKEN);
