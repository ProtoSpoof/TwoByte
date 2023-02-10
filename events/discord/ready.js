const { Events } = require('discord.js');
const { Settings } = require('../../config.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		if (Settings?.CHAT_CHANNEL) client.chatChannel = client.channels.cache.get(Settings.CHAT_CHANNEL);
		if (Settings?.DEVELOPER_CHANNEL) client.developerChannel = client.channels.cache.get(Settings.DEVELOPER_CHANNEL);
	},
};
