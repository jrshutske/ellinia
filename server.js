const { Client, RichEmbed } = require('discord.js')
const client = new Client();
const tokens = require('./config.json')
const commands = require('./commands.js')

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
  const msgContent = {ARGS, msg, client}
  commands.command(msgContent)
});
client.login(process.env.SECRET_TOKEN);
