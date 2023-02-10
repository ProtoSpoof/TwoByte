const { execSync, spawn } = require('node:child_process');
const { ServerPath, Settings } = require('./config.js');
const { EmbedBuilder } = require('discord.js');
const { EventEmitter } = require('node:events');

class MinecraftServer extends EventEmitter {    

    constructor(executionCommand, serverPath = './server', readyText = '[Server thread/INFO]: Done') {
        super();
        this.executionCommand = executionCommand;
        this.serverPath = serverPath 
        this.readyText = readyText
        this.serverProcess = null;
        this.started = false;
        this.ready = false;
    }

    async start_server() {
        if (this.started) throw new Error('Server Already Started');

        this.serverProcess = spawn(this.executionCommand, { cwd: this.serverPath, shell: true });
        this.started = true;

        this.serverProcess.stdout.on('data', (data) => {
            this.emit('data', data);
            if (this.ready) return;
            if (!data.includes(this.readyText)) return;
            this.ready = true;
            this.emit('ready');
        });
        this.serverProcess.stdin.on('data', (data) => {
            this.serverProcess.stdin.write(data);
            if (!data.toString().startsWith('stop')) return;
            this.started = false;
            this.ready = false;
        });

        this.serverProcess.on('exit', (code, signal) => {
            this.emit('exit', code, signal);
        });
        this.serverProcess.on('error', (error) => {
            this.emit('error', error);
        });
    }

    async stop_server() {
        if (!this.started) throw new Error('Server Not Started');
        this.send_command('stop');
    }

    async restart_server() {
        if (!this.started) throw new Error('Server Not Started');
        this.stop_server();
        this.once('exit', () => {
            this.start_server();
        });
    }

    async send_command(command) {
        this.serverProcess?.stdin.emit('data', command + '\n');
    }

    async backup_server() {
        if (!this.started) throw new Error('Server Not Started');
        
        this.stop_server();
        this.once('exit', () => {
            let now = new Date();
            execSync(`powershell Compress-Archive ./world/ ./backups/${now.toISOString()}.zip`, { cwd: this.serverPath });
            this.start_server();
        });
    }

}

module.exports = {
    MinecraftServer
}
