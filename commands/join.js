const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');
const { SlashCommandBuilder, ChannelType } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Join a voice channel to play audio')
        .addChannelOption(option => 
            option.setName('channel')
            .setDescription('The voice channel to join')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildVoice)
        ),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        connection.on(VoiceConnectionStatus.Ready, async () => {
            // console.log('Playing');
            // const { stream, type } = await demuxProbe(gtts.stream("Rotating"));
            // const audioResource = createAudioResource(stream, {inputType: type});
            // interaction.Client.player = createAudioPlayer();
            // player.play(audioResource);
            
            connection.subscribe(interaction.client.player);
        });
        await interaction.reply({content: 'I joined the channel!', ephemeral: true});
    },
};
