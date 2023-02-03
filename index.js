const fs = require('node:fs');
const path = require('node:path');
const { Client, EmbedBuilder, GatewayIntentBits, Collection } = require('discord.js');

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

// Config & env variable stuff
const configPath = './config.json';
const config = require(configPath);
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.commands = new Collection();

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

// Load Events
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}




// client.on('ready', () => {
//   console.log(`Logged in as ${client.user.tag}!`);
// });

// client.on("messageCreate", message => {
//     if (message.author.bot) return
//     if (message.channelId === config.DeveloperChannel) return handleDevMessage(message);
//     if (message.channelId === config.ChatChannel) return handleChatMessage(message);
// });

// client.on('interactionCreate', async interaction => {
//     if (!interaction.isChatInputCommand()) return;

//     const command = interaction.client.commands.get(interaction.commandName);

//     if (!command) return console.error(`No command matching ${interaction.commandName} was found.`);

//     try {
//         await command.execute(interaction);
//     } catch (error) {
//         console.error(error);
//         let embed = new EmbedBuilder()
//             .setColor(0xff0000)
//             .setTitle('❌ Error ❌')
//             .setDescription('There was an error while executing the command... 😰');
//         await interaction.reply({ embeds: [embed] });
//     }
// });

function handleDevMessage(message) {
    console.log(message.content);
}

function handleChatMessage(message) {
    console.log(message.content);
}


client.login(process.env.TOKEN);