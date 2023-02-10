const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Start the MineCraft Server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false),
    async execute(interaction) {
        let embed = new EmbedBuilder();
            
        embed.setColor(0x8BD3E6)
        .setTitle('⚡ Starting Server...')
        .setDescription('Give me a second to get the server ready!');
        
        await interaction.reply({ embeds: [embed] });
        interaction.client.minecraftServer.start_server();
    },
};

 // if (Server.started) {
//     embed.setColor(0xFF6D6A)
//         .setTitle('❌ Server Already Active...')
//         .setDescription('The server is already running.');

//     return await interaction.reply({embeds: [embed]});
// }