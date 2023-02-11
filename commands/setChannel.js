const fs = require('node:fs');
const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { Settings, SettingsPath } = require('../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setchannel')
        .setDescription('Sets the current channel to developer or chat channel.')
        .addStringOption(option => 
            option.setName('type')
                .setDescription('Can either be "developer" or "chat".')
                .setRequired(true)
                .addChoices(
                    { name: 'Developer', value: 'channel_developer' },
                    { name: 'Chat', value: 'channel_chat' },
                ))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false),
    async execute(interaction) {
        let type = interaction.options.getString('type');

        let embed = new EmbedBuilder().setColor(0xfbf9b9);
        
        if (type === 'channel_developer') {
            Settings.DEVELOPER_CHANNEL = interaction.channelId;
            interaction.client.developerChannel = interaction.client.channels.cache.get(Settings.DEVELOPER_CHANNEL);
            embed.setTitle('👨‍💻 Developer Channel Set!')
                .setDescription('You will now recieve developer messages in this channel!');
        } else {
            Settings.CHAT_CHANNEL = interaction.channelId;
            interaction.client.chatChannel = interaction.client.channels.cache.get(Settings.CHAT_CHANNEL);
            embed.setTitle('🗣 Chat Channel Set!')
                .setDescription('You will now recieve chat messages in this channel!');
        }

        fs.writeFile(SettingsPath, JSON.stringify(Settings), err => {
            if (err) return console.log(err);
        });

        await interaction.reply({ embeds: [embed] });
    },
};


// if (interaction.commandName === 'setdevchannel') {
        // config.DeveloperChannel = interaction.channelId;
        // fs.writeFile(configPath, JSON.stringify(config), err => {
        //     if (err) return console.log(err);
        // });

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