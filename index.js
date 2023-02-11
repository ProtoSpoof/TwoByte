const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { MinecraftServer } = require('./MinecraftServer.js');


const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const eventsPathDiscord = path.join(__dirname, 'events/discord');
const eventFilesDiscord = fs.readdirSync(eventsPathDiscord).filter(file => file.endsWith('.js'));
const eventsPathMCServer = path.join(__dirname, 'events/mcserver');
const eventFilesMCServer = fs.readdirSync(eventsPathMCServer).filter(file => file.endsWith('.js'));

// Config & env variable stuff
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.commands = new Collection();
client.minecraftServer = new MinecraftServer('java @user_jvm_args.txt @libraries/net/minecraftforge/forge/1.19.2-43.2.0/win_args.txt --nogui %*', 
                                            __dirname + '\\server', '[Server thread/INFO] [minecraft/DedicatedServer]: Done');

// Load Commands
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Load Client Events
for (const file of eventFilesDiscord) {
	const filePath = path.join(eventsPathDiscord, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Load MC Server Events
for (const file of eventFilesMCServer) {
	const filePath = path.join(eventsPathMCServer, file);
	const event = require(filePath);
	if (event.once) {
		client.minecraftServer.once(event.name, (...args) => event.execute(client, ...args));
	} else {
		client.minecraftServer.on(event.name, (...args) => event.execute(client, ...args));
	}
}

client.login(process.env.TOKEN);