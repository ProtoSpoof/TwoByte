const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Start the MineCraft Server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false),
    async execute(interaction) {
        let embed = new EmbedBuilder()
            .setColor(0x8BD3E6)
            .setTitle('⚡ Starting Server...')
            .setDescription('Give me a second to get the server ready!');

        await interaction.reply({ embeds: [embed] });
        interaction.client.minecraftServer.start_server();
    },
};