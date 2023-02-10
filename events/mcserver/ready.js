const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'ready',
	once: false,
	async execute(client) {
        let embed = new EmbedBuilder()
            .setColor(0xB5F1CC)
            .setTitle('😄 Server Ready...')
            .setDescription('It looks like the server is ready to go!');
        await client.chatChannel?.send({ embeds: [embed] });
        process.stdin.on('data', (data) => {
            client.minecraftServer.serverProcess?.stdin.emit('data', data);
        })
	},
};