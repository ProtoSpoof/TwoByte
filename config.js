module.exports = {
    SETTINGS_PATH: __dirname + '/settings.json',
    SETTINGS: require(__dirname + '/settings.json'),
    SERVER_PATH: __dirname + '/server',
    SERVER_COMMAND: 'java @user_jvm_args.txt @libraries/net/minecraftforge/forge/1.19.2-43.2.0/win_args.txt --nogui "$@"',
    SERVER_READY_MESSAGE: '[Server thread/INFO] [minecraft/DedicatedServer]: Done',
}