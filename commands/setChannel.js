const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setchannel')
        .setDescription('Sets the current channel to developer or chat channel.'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};


// if (interaction.commandName === 'setdevchannel') {
    //     config.DeveloperChannel = interaction.channelId;
    //     fs.writeFile(configPath, JSON.stringify(config), err => {
    //         if (err) return console.log(err);
    //     });

    //     let embed = new EmbedBuilder()
    //         .setColor(0xfbf9b9)
    //         .setTitle('Developer Channel Set!')
    //         .setDescription('You will now recieve logs in this channel!');
    //     await interaction.reply({ embeds: [embed] });
    // }
    // else if (interaction.commandName === 'setchatchannel') {
    //     config.ChatChannel = interaction.channelId;
    //     fs.writeFile(configPath, JSON.stringify(config), err => {
    //         if (err) return console.log(err);
    //     });

    //     let embed = new EmbedBuilder()
    //         .setColor(0xfbf9b9)
    //         .setTitle('Chat Channel Set!')
    //         .setDescription('You will now recieve chat messages in this channel!');
    //     await interaction.reply({ embeds: [embed] });
    // }