const { Events } = require('discord.js');
const { SETTINGS } = require('../../config.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
        // console.log(message);
		if (message.author.bot) return
        if (message.channelId === SETTINGS.DEVELOPER_CHANNEL) return handleDevMessage(message);
        if (message.channelId === SETTINGS.CHAT_CHANNEL) return handleChatMessage(message);
	},
};

function handleDevMessage(message) {
    if (message.cleanContent === 'stop') return message.client.minecraftServer.stop();
    message.client.minecraftServer.send_command(message.cleanContent);
}

function handleChatMessage(message) {
    message.client.minecraftServer.send_command('/tellraw @a ["",{"text":"[Discord]","color":"dark_purple"}," <' +
        message.author.username +
        '> ","' +
        message.cleanContent +
        '"]'
    );
}