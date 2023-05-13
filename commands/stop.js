const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the MineCraft Server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false),
    async execute(interaction) {
        let embed = new EmbedBuilder()
            .setColor(0x8BD3E6)
            .setTitle('🛑 Stopping Server...')
            .setDescription('Give me a second to stop everything!');

        await interaction.reply({ embeds: [embed] });
        interaction.client.minecraftServer.stop_server();
    },
};