const { Client } = require('discord.js');

const tokens = require('./config.json');
const client = new Client();

const commands = require('./commands.js')

client.on('ready', () => {
	console.log('ready!');
});

//event listener for messages
client.on('message', msg => {
	if (!msg.content.startsWith(tokens.prefix) || msg.author.bot) return;
	const ARGS = msg.content.slice(tokens.prefix.length).trim().split(/ +/g);
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
	
//end
});
client.login(tokens.d_token);
