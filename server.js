const { Client, RichEmbed } = require('discord.js')
const client = new Client()
const tokens = require('./config.json')
const commands = require('./commands.js')
const apiKey = require('./utilities/apikey.js')
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// let blizzardApiKey = apiKey.getKey()


client.on('ready', () => {
	console.log('ready!');
});

client.on('guildMemberAdd', member => {
  const embed = new RichEmbed()
    .setTitle("ellinia")
    .setColor(0x00AE88)
    .setDescription("Hello there, " + member.user.username + "! Welcome to " + member.guild.name +
                    "! We hope you enjoy your time here. Please remember to be respectful and follow the rules.")
    .setImage("https://i.ytimg.com/vi/XYtHWyrVm30/maxresdefault.jpg")
    .setThumbnail(member.guild.iconURL)
    .setTimestamp()
    .setURL("https://discord.gg/KTgGUeV")
    .setFooter("All boys leave home someday. It says so on TV.")
    member.send({embed});
});

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
		let text = ARGS.slice(1).join("");
    msg.channel.send(text);
	}
  if(COMMAND === "char") {
    commands.char["lookup"](ACTION, ARG, msg)
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
// client.login(process.env.SECRET_TOKEN);
client.login(process.env.SECRET_TOKEN);
