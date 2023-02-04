const { Events } = require('discord.js');
const { Settings } = require('../config.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if (message.author.bot) return
        if (message.channelId === Settings.DeveloperChannel) return handleDevMessage(message);
        if (message.channelId === Settings.ChatChannel) return handleChatMessage(message);
	},
};

function handleDevMessage(message) {
    message.reply("test!");
}

function handleChatMessage(message) {
    message.reply("test!");
}