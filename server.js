const { Client, RichEmbed } = require('discord.js')
const client = new Client();
const tokens = require('./config.json')
const commands = require('./commands.js')
const apiKey = require('./utilities/apikey.js')
const testjs = require('./test.js')


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
	const ARGS = msg.content.slice(tokens.prefix.length).trim().toLowerCase().split(/ +/g)
	const COMMAND = ARGS[0]
	const ACTION = ARGS[1]
	const ARG = ARGS[2]
  const msgContent = {COMMAND, ACTION, ARG, msg, client}

  commands.command(msgContent)


	if (COMMAND === 'connect') {
		commands.connect['connectdb'](msg)
	}
});
// client.login(process.env.SECRET_TOKEN);
client.login(process.env.SECRET_TOKEN);
