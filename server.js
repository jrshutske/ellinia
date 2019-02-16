const { Client } = require('discord.js');
const client = new Client();
const commands = require('./commands.js')
const config = require('./config.js')

client.on('ready', () => {
	console.log('ready!');
});

client.on('message', msg => {
	if (!msg.content.startsWith(config.s3.prefix) || msg.author.bot) return;
	const ARGS = msg.content.slice(config.s3.prefix.length).trim().split(/ +/g);
	const COMMAND = ARGS[0]
	const ACTION = ARGS[1]
	const ARG = ARGS[2]
	if(COMMAND === "music"){
		if (commands.music.hasOwnProperty(ACTION)) {
			commands.music[ACTION](msg)
		};
	}
	if (COMMAND === 'slots') {
		commands.slots['basicSlots'](msg)
	}
	if (COMMAND === "roll") {
		ACTION == undefined ? commands.roll['basicRoll'](msg) : commands.roll['customRoll'](msg);
	}
	if(COMMAND === "say") {
		let text = ARGS.slice(0).join(" ");
		msg.delete();
		msg.channel.send(text);
	}
	if (COMMAND === 'hi') {
		msg.channel.send({embed: {
		color: 3447003,
		description: "Hello!"
		}});
	}
	if (COMMAND === 'connect') {
		commands.connect['connectdb'](msg)
	}
});
client.login(config.s3.d_token);
