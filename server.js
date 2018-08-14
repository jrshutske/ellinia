const { Client } = require('discord.js');
const yt = require('ytdl-core');
const tokens = require('./config.json');
const client = new Client();
const package = require('./package.json');
const opus = require('node-opus');

let queue = {};

const commands = {

	'username': (msg) => {
		let user = msg.content.split(' ')[1];
		msg.channel.send(user);
	},
	'avatarurl': (msg) => {
		let user = msg.content.split(' ')[1];
		msg.reply(msg.author.avatarURL);
	},
	'snow': (msg) => {
		let user = msg.content.split(' ')[1];
		msg.reply(msg.author.id);
	},
	'play': (msg) => {
		if (queue[msg.guild.id] === undefined) return msg.channel.send(`Add some songs to the queue first with ${tokens.prefix}add`);
		if (!msg.guild.voiceConnection) return commands.join(msg).then(() => commands.play(msg));
		if (queue[msg.guild.id].playing) return msg.channel.send('Already Playing');
		let dispatcher;
		queue[msg.guild.id].playing = true;

		console.log(queue);
		(function play(song) {
			console.log(song);
			if (song === undefined) return msg.channel.send('Queue is empty').then(() => {
				queue[msg.guild.id].playing = false;
				msg.member.voiceChannel.leave();
			});
			msg.channel.send(`Playing: **${song.title}** as requested by: **${song.requester}**`);
			dispatcher = msg.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), { passes : tokens.passes });
			let collector = msg.channel.createCollector(m => m);
			collector.on('message', m => {
				if (m.content.startsWith(tokens.prefix + 'pause')) {
					msg.channel.send('paused').then(() => {dispatcher.pause();});
				} else if (m.content.startsWith(tokens.prefix + 'resume')){
					msg.channel.send('resumed').then(() => {dispatcher.resume();});
				} else if (m.content.startsWith(tokens.prefix + 'skip')){
					msg.channel.send('skipped').then(() => {dispatcher.end();});
				} else if (m.content.startsWith('volume+')){
					if (Math.round(dispatcher.volume*50) >= 100) return msg.channel.send(`Volume: ${Math.round(dispatcher.volume*50)}%`);
					dispatcher.setVolume(Math.min((dispatcher.volume*50 + (2*(m.content.split('+').length-1)))/50,2));
					msg.channel.send(`Volume: ${Math.round(dispatcher.volume*50)}%`);
				} else if (m.content.startsWith('volume-')){
					if (Math.round(dispatcher.volume*50) <= 0) return msg.channel.send(`Volume: ${Math.round(dispatcher.volume*50)}%`);
					dispatcher.setVolume(Math.max((dispatcher.volume*50 - (2*(m.content.split('-').length-1)))/50,0));
					msg.channel.send(`Volume: ${Math.round(dispatcher.volume*50)}%`);
				} else if (m.content.startsWith(tokens.prefix + 'time')){
					msg.channel.send(`time: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)}`);
				}
			});
			dispatcher.on('end', () => {
				collector.stop();
				play(queue[msg.guild.id].songs.shift());
			});
			dispatcher.on('error', (err) => {
				return msg.channel.send('error: ' + err).then(() => {
					collector.stop();
					play(queue[msg.guild.id].songs.shift());
				});
			});
		})(queue[msg.guild.id].songs.shift());
	},
	'join': (msg) => {
		return new Promise((resolve, reject) => {
			const voiceChannel = msg.member.voiceChannel;
			if (!voiceChannel || voiceChannel.type !== 'voice') return msg.reply('I couldn\'t connect to your voice channel...');
			voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
		});
	},
	'add': (msg) => {
		let url = msg.content.split(' ')[1];
		if (url == '' || url === undefined) return msg.channel.send(`You must add a YouTube video url, or id after ${tokens.prefix}add`);
		yt.getInfo(url, (err, info) => {
			if(err) return msg.channel.send('Invalid YouTube Link: ' + err);
			if (!queue.hasOwnProperty(msg.guild.id)) queue[msg.guild.id] = {}, queue[msg.guild.id].playing = false, queue[msg.guild.id].songs = [];
			queue[msg.guild.id].songs.push({url: url, title: info.title, requester: msg.author.username});
			msg.channel.send(`added **${info.title}** to the queue`);
		});
	},
	'queue': (msg) => {
		if (queue[msg.guild.id] === undefined) return msg.channel.send(`Add some songs to the queue first with ${tokens.prefix}add`);
		let tosend = [];
		queue[msg.guild.id].songs.forEach((song, i) => { tosend.push(`${i+1}. ${song.title} - Requested by: ${song.requester}`);});
		msg.channel.send(`__**${msg.guild.name}'s Music Queue:**__ Currently **${tosend.length}** songs queued ${(tosend.length > 15 ? '*[Only next 15 shown]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
	},
	'help': (msg) => {
		let tosend = ['```xl', tokens.prefix + 'join : "Join Voice channel of msg sender"',	tokens.prefix + 'add : "Add a valid youtube link to the queue"', tokens.prefix + 'queue : "Shows the current queue, up to 15 songs shown."', tokens.prefix + 'play : "Play the music queue if already joined to a voice channel"', '', 'the following commands only function while the play command is running:'.toUpperCase(), tokens.prefix + 'pause : "pauses the music"',	tokens.prefix + 'resume : "resumes the music"', tokens.prefix + 'skip : "skips the playing song"', tokens.prefix + 'time : "Shows the playtime of the song."',	'volume+(+++) : "increases volume by 2%/+"',	'volume-(---) : "decreases volume by 2%/-"',	'```'];
		msg.channel.send(tosend.join('\n'));
	},
	'reboot': (msg) => {
		if (msg.author.id == tokens.adminID) process.exit(); //Requires a node module like Forever to work.
	},
	'join': (msg) => {
		return new Promise((resolve, reject) => {
			const voiceChannel = msg.member.voiceChannel;
			if (!voiceChannel || voiceChannel.type !== 'voice') return msg.reply('I couldn\'t connect to your voice channel...');
			voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
		});
	},
	'search': (msg) => {
		var search = require('youtube-search');
 		let url1 = msg.content.split(' ')[1];
var opts = {
  maxResults: 10,
  key: 'AIzaSyDlI9NQ15aJ_xIafFNyGV0qelglDVBAQrY'
};

search(url1, opts, function(err, results) {
  if(err) return msg.channel.send(err);
msg.channel.send(results);
});
	}
};

client.on('ready', () => {
	console.log('ready!');
});

client.on('message', msg => {
	if (!msg.content.startsWith(tokens.prefix)) return;
	if (commands.hasOwnProperty(msg.content.toLowerCase().slice(tokens.prefix.length).split(' ')[0])) commands[msg.content.toLowerCase().slice(tokens.prefix.length).split(' ')[0]](msg);
});

//event listener for messages
client.on('message', msg => {
		if (!msg.content.startsWith(tokens.prefix) || msg.author.bot) return;

		const ARGS = msg.content.slice(tokens.prefix.length).trim().split(/ +/g);
		const COMMAND = ARGS.shift().toLowerCase();

		//command to have the bot say something and delete it's message
		if(COMMAND === "say"){
				let text = ARGS.slice(0).join(" ");
				msg.delete();
				msg.channel.send(text);
		}
		//Simple message response
		if (COMMAND === 'hi')
		{
				msg.channel.send({embed: {
				color: 3447003,
				description: "Hello!"
				}});
		}

		//dice roll that takes arguments(sides)
		var roll;
		var rollmax;

		if (COMMAND === "roll") {
				let rollmax = ARGS[0];
						if (!rollmax || rollmax < 1) {
								msg.reply("Please specify a number of sides!");
								return;
						}
						else if (isNaN(rollmax)) {
								msg.reply("That's not a number.");
								return;
						}
		roll = Math.floor(Math.random()*(rollmax-1+1)+1);
		msg.reply({embed: {
		color: 3447003,  description: "You rolled a " + roll +  "."
		}});
		}
/*
*
* 777 styled Slot machine of discord emojis.
*
*/
var preSlotsNumbers = [":tangerine:",":watermelon:",":pear:",":grapes:",":cherries:",":banana:",":seven:"];
var postSlotsNumbers = [];
var randomItem;
var slotString = "**[:slot_machine: l SLOTS ]\n-----------------\n**";
var slotsResult;
var winnings;

//~slots will trigger this. The argument is how much they bet. (Credits/Money)
if (COMMAND === 'slots')
{
		let bet = ARGS[0];

		if (!bet || bet < 1 || isNaN(bet)) {
				msg.reply("Make sure to place a bet!");
				return;
		}

		for (let slotsCounter = 0; slotsCounter < 9; slotsCounter++) {
				randomItem = preSlotsNumbers[Math.floor(Math.random()*preSlotsNumbers.length)];

				postSlotsNumbers.push(randomItem);

				slotString += postSlotsNumbers[slotsCounter] + " ";

				if (slotsCounter == 2 || slotsCounter == 5 || slotsCounter == 8) {
						if (slotsCounter == 5) {
								slotString += "<<<";
						}
						slotString += "\n";
				}

				if (slotsCounter != 2 && slotsCounter != 5 && slotsCounter != 8) {
						slotString += ": ";
				}
		};
		slotString += "**-----------------**\n";

if (postSlotsNumbers[3] == postSlotsNumbers[4] || postSlotsNumbers[4] == postSlotsNumbers[5]
		|| postSlotsNumbers[3] == postSlotsNumbers[5]) {
				if (postSlotsNumbers[3] == postSlotsNumbers[4] && postSlotsNumbers[3] == postSlotsNumbers[5]) {
						slotString += "**| : : : WIN : : : |**";
						winnings = bet * 3;
						slotsResult = "tripled it to " + winnings;
						return;
				}
				slotString += "**| : : :  WIN  : : : |**";
				winnings = bet * 2;
				slotsResult = "doubled it to " + winnings;
		}
else {
		slotString += "**| : : : LOSS : : : |**";
		winnings = bet * 0;
		slotsResult = "lost all of it.";
}

msg.channel.send(slotString + "\n\nYou used " + bet + " credit(s) and " + slotsResult);
}
//end
});
client.login(tokens.d_token);
