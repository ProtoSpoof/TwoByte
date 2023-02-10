const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'exit',
	once: false,
	async execute(client, code, signal) {
        let embed = new EmbedBuilder();

        if (client.minecraftServer.started) {
            embed.setColor(0xFF6D6A)
                .setTitle('😡 Server Stopped Suddenly...')
                .setDescription('I think the server crashed. I\'ll try to get it started again, but please contact an administrator.');
            await client.chatChannel?.send({embeds: [embed]});
            client.minecraftServer.started = false;
            client.minecraftServer.ready = false;
            return client.minecraftServer.start_server();
        }

        embed.setColor(0xB5F1CC)
        .setTitle('😕 Server Stopped...')
        .setDescription('I got the server stopped for you!');
        await client.chatChannel?.send({ embeds: [embed] });
	},
};