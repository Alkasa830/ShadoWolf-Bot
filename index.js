const { Client, GatewayIntentBits } = require('discord.js');
const { DisTube } = require('distube');
const { SoundCloudPlugin } = require('@distube/soundcloud');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const distube = new DisTube(client, {
  plugins: [new SoundCloudPlugin()],
  emitAddListHandler: true, // Kad grojaraščiai suktųsi be problemų!
});

client.on('ready', () => {
  console.log(`Brolau, tavo vilkas ${client.user.tag} jau miške ir pasiruošęs groti!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith('!')) return;

  const args = message.content.slice(1).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Muzikos paleidimas
  if (command === 'play') {
    const query = args.join(' ');
    if (!query) return message.reply('Brolau, parašyk pavadinimą! Minčių skaityti dar neišmokau.');
    if (!message.member.voice.channel) return message.reply('Lipk į balso kanalą, kitaip dainuosiu tik sienoms!');

    try {
      distube.play(message.member.voice.channel, query, {
        message,
        textChannel: message.channel,
        member: message.member,
      });
      message.reply('Ieškau tavo garsų po visą internetą...');
    } catch (e) {
      message.reply('Oi, traktorius užklimpo – kažkoks erroras!');
    }
  }

  // Muzikos stabdymas
  if (command === 'stop') {
    const queue = distube.getQueue(message);
    if (!queue) return message.reply('Nėra ko stabdyti, čia tylu kaip per šermenis!');
    queue.stop();
    message.reply('Viskas, tyla! Tegul kaimynai atsikvepia.');
  }

  // Dainos praleidimas
  if (command === 'skip') {
    const queue = distube.getQueue(message);
    if (!queue) return message.reply('Nėra ko skipinti!');
    try {
      distube.skip(message);
      message.reply('Metam šitą, varom kitą!');
    } catch (e) {
      message.reply('Nepavyko praleisti, brolau...');
    }
  }
});

// Įvykiai, kai daina prasideda ar grojaraštis prisideda
distube.on('playSong', (queue, song) =>
  queue.textChannel.send(`Dabar groja: **${song.name}** – va čia tai muzika!`)
);

distube.on('addList', (queue, playlist) =>
  queue.textChannel.send(`Pridėjau grojaraštį **${playlist.name}** (${playlist.songs.length} dainų). Turėsim ką veikti!`)
);

client.login('TAVO_BOTO_TOKENAS'); // ČIA ĮRAŠYK SAVO TOKENĄ!
