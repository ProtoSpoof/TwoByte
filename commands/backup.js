const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('backup')
        .setDescription('Backup and restart the MineCraft Server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false),
    async execute(interaction) {
        let embed = new EmbedBuilder()
            .setColor(0x8BD3E6)
            .setTitle('💾 Backing Up...')
            .setDescription('The server will be back in just a minute!');
        
        await interaction.reply({ embeds: [embed] });
        interaction.client.minecraftServer.backup_server();
    },
};