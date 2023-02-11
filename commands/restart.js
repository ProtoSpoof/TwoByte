const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('Restart the MineCraft Server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false),
    async execute(interaction) {
        let embed = new EmbedBuilder()
            
        embed.setColor(0x8BD3E6)
        .setTitle('🔃 Restarting Server...')
        .setDescription('I\'m restarting the server now!');
        
        await interaction.reply({ embeds: [embed] });
        interaction.client.minecraftServer.restart_server();
    },
};