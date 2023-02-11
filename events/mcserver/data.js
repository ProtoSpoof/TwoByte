const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'data',
	once: false,
	async execute(client, data) {
		console.log(data = data.toString());
        let tokens = data.split('\n');
    
        tokens.forEach(token => {
            token = token.substring(token.indexOf(']') + 2);
            let tokenType = token.substring(0, token.indexOf(':'));
            let tokenContent = token.substring(token.indexOf(':') + 2);
            if (tokenContent.length > 2000) tokenContent = tokenContent.substring(0, 1999) + '...';
            
            if (!client.minecraftServer.ready) return;

            let embed = new EmbedBuilder();
        
            if (isCommandChatData(tokenContent)) {
                return client.developerChannel?.send(token);
            }
            
            // We only care about server info that has this type (generally)
            if (!tokenType.includes('[Server thread/INFO] [minecraft/')) return;
            
            // These are always chat messages sent by players always send these to discord
            if (tokenContent.charAt(0) == '<') {
                let username = tokenContent.substring(1, tokenContent.indexOf('>'));
                embed.setColor(0xFCC2FC)
                    .setAuthor({ name: username, iconURL: `https://minotar.net/helm/${username}/256` })
                    .setDescription(tokenContent.substring(tokenContent.indexOf(' ') + 1));

                return client.chatChannel?.send({ embeds: [embed] });
            }

            // Everything else should be a message seen by players
            embed.setColor(0xB1A2CA).setDescription(tokenContent)
            return client.chatChannel?.send({embeds: [embed]});
        });
	},
};


function isCommandChatData(dataContent) {
    // Empty server
    if (dataContent.startsWith('No player was found')) return true;

    // This indicates a system message for audit purposes afaict
    if (dataContent.startsWith('[')) return true;

    // Ignore system messages about logging in and out
    if (dataContent.includes('logged in with entity id') || dataContent.includes('lost connection:')) return true;

    // Ignore death messages for things like villagers
    if (dataContent.includes('ServerLevel[')) return true;

    // Ignore backups
    if (dataContent.startsWith('Automatic saving is now')) return true;

    // Ignore stopping
    if (dataContent.startsWith('ThreadedAnvil')) return true;
    if (dataContent.startsWith('Stopping')) return true;
    if (dataContent.startsWith('Saving')) return true;

    // Ignore unknown commands
    if (dataContent.startsWith('Unknown or incomplete command')) return true;
    if (dataContent.startsWith('<') && !dataContent.includes('>')) return true;

}