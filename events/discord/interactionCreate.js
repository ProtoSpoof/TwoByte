const { EmbedBuilder, Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return console.error(`No command matching ${interaction.commandName} was found.`);

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            let embed = new EmbedBuilder()
                .setColor(0xFF6D6A)
                .setTitle('❌ Error ❌')
                .setDescription('There was an error while executing the command... 😰');

            await interaction.reply({ embeds: [embed] });
        }
    },
};