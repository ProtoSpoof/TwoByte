const { getVoiceConnection } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Leave the connected voice channel'),
    async execute(interaction) {
        getVoiceConnection(interaction.guild.id).destroy();
        await interaction.reply({content: 'I left the channel!', ephemeral: true});
    },
};