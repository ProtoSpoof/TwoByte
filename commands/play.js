const { demuxProbe, createAudioResource, getVoiceConnection, StreamType } = require('@discordjs/voice');
const { SlashCommandBuilder, ChannelType } = require('discord.js');
const util = require('util');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a line in a connected voice channel')
        .addStringOption(option => 
            option.setName('line')
            .setDescription('The line to say')
            .setRequired(true)
        ),
    async execute(interaction) {
        const line = interaction.options.getString('line');
        const connection = getVoiceConnection(interaction.guild.id);
        const request = {
            input: {text: line},
            voice: {languageCode: 'en-US', ssmlGender: 'FEMALE', name: 'en-US-Neural2-F'},
            audioConfig: {audioEncoding: 'OGG_OPUS', pitch: 0.80, speakingRate: 1.19},
        }
    
        const [response] = await interaction.client.textToSpeech.synthesizeSpeech(request);
        const writeFile = util.promisify(fs.writeFile);
    
        await fs.promises.mkdir('./tmp/tts', { recursive: true });
        await writeFile('./tmp/tts/tmp.ogg', response.audioContent, 'binary');
    
        const audioResource = createAudioResource(
            fs.createReadStream('./tmp/tts/tmp.ogg'), 
            {inputType: StreamType.OggOpus}
        );

        interaction.client.player.play(audioResource);
        connection.subscribe(interaction.client.player);

        await interaction.reply({content: 'I said the line', ephemeral: true});
    },
};
