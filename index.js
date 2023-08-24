const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const { createAudioPlayer, createAudioResource, StreamType } = require('@discordjs/voice');
const textToSpeech = require('@google-cloud/text-to-speech');
const path = require('path');
const fs = require('fs');
const util = require('util');
require('dotenv').config();

const pathToEvents = path.join(__dirname, 'events');
const pathToCommands = path.join(__dirname, 'commands');
const eventFiles = fs.readdirSync(pathToEvents).filter(file => file.endsWith('.js'));
const commandFiles = fs.readdirSync(pathToCommands).filter(file => file.endsWith('.js'));

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildVoiceStates] });
client.commands = new Collection();
client.textToSpeech = new textToSpeech.TextToSpeechClient();
client.player = createAudioPlayer();


// Load all of the bot events
for (const file of eventFiles) {
    const filePath = path.join(pathToEvents, file);
    const event = require(filePath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.once(event.name, (...args) => event.execute(...args));
    }
}

// Load all of the bot commands
for (const file of commandFiles) {
    const filePath = path.join(pathToCommands, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return console.error(`No command matching ${interaction.commandName} was found.`);
    
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.login(process.env.BOT_TOKEN);


// Rest Server
const express = require('express');
const { getVoiceConnections } = require('@discordjs/voice');
const PORT = process.env.PORT || 3030;


const restServer = express();
restServer.use(express.json());

restServer.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

restServer.post('/', (req, res) => {
    res.sendStatus(200);
});
restServer.post('/soundbyte', async (req, res) => {
    if (!req.headers.authorization) return res.sendStatus(401);

    var auth = new Buffer.from(req.headers.authorization.split(' ')[1],
    'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];

    if (user !== process.env.AUTH_USER || pass !== process.env.AUTH_PASSWORD) return res.sendStatus(401);
    if (getVoiceConnections().size === 0) return res.sendStatus(200);

    const request = {
        input: {text: req.body.message},
        voice: {languageCode: 'en-US', ssmlGender: 'FEMALE', name: 'en-US-Neural2-F'},
        audioConfig: {audioEncoding: 'OGG_OPUS', pitch: 0.80, speakingRate: 1.19},
    }

    const [response] = await client.textToSpeech.synthesizeSpeech(request);
    const writeFile = util.promisify(fs.writeFile);

    await fs.promises.mkdir('./tmp/tts', { recursive: true });
    await writeFile('./tmp/tts/tmp.ogg', response.audioContent, 'binary');

    const audioResource = createAudioResource(
        fs.createReadStream('./tmp/tts/tmp.ogg'), 
        {inputType: StreamType.OggOpus}
    );

    client.player.play(audioResource);
    res.sendStatus(200);
});