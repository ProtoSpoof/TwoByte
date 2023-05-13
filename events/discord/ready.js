const { Events } = require('discord.js');
const { SETTINGS } = require('../../config.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        if (SETTINGS?.CHAT_CHANNEL) client.chatChannel = client.channels.cache.get(SETTINGS.CHAT_CHANNEL);
        if (SETTINGS?.DEVELOPER_CHANNEL) client.developerChannel = client.channels.cache.get(SETTINGS.DEVELOPER_CHANNEL);
        client.minecraftServer.start_server();
    },
};