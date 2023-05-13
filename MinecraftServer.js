const { spawn } = require('node:child_process');
const { EventEmitter } = require('node:events');
const zl = require('zip-lib');
const cron = require('node-cron');

class MinecraftServer extends EventEmitter {
    constructor(executionCommand, serverPath = './server', readyText = '[Server thread/INFO]: Done') {
        super();
        this.executionCommand = executionCommand;
        this.serverPath = serverPath 
        this.readyText = readyText
        this.serverProcess = null;
        this.started = false;
        this.ready = false;
        cron.schedule('0 12 15 * * *', () => {
            try {
                this.backup_server(48);
            } catch (error) {
                console.log(error);
            }
        })
    }

    async start_server() {
        if (this.started) return console.log(new Error('Server Not Started'));

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
        if (!this.started) return console.log(new Error('Server Not Started'));
        this.send_command('stop');
    }

    async restart_server() {
        if (!this.started) return console.log(new Error('Server Not Started'));
        this.stop_server();
        this.once('exit', () => {
            this.start_server();
        });
    }

    async send_command(command) {
        this.serverProcess?.stdin.emit('data', command + '\n');
    }

    async backup_server(delayMinutes = 0) {
        if (!this.started) return console.log(new Error('Server Not Started'));

        if (delayMinutes >= 1) {
            this.send_command(`/say The server will backup in ${delayMinutes} minutes.`);
            while (delayMinutes > 1) {
                delayMinutes /= 2;
                await new Promise(resolve => setTimeout(resolve, delayMinutes * 60000));
                this.send_command(`/say The server will backup in ${delayMinutes} minutes.`);
            }
            await new Promise(resolve => setTimeout(resolve, delayMinutes * 60000));
        }

        this.send_command('/say The server is backing up');
        this.stop_server();
        this.once('exit', () => {
            let now = new Date();
            zl.archiveFolder(this.serverPath + '/world', this.serverPath + `/backups/${now.toISOString().replaceAll(':', '-')}.zip`);
            this.start_server();
        });
    }

    async whitelist_user() {

    }

}

module.exports = {
    MinecraftServer
}
