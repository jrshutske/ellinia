const tokens = require('../config.json');
const yt = require('ytdl-core');
let queue = {};
let msg;


const play = (msgContent) => {
  let msg=msgContent.msg
  if (queue[msg.guild.id] === undefined) return msg.channel.send(`Add some songs to the queue first with ${tokens.prefix}add`);
  if (!msg.guild.voiceConnection) return module.exports.join(msg).then(() => module.exports.play(msg));
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
}

const join = (msgContent) => {
  msg=msgContent.msg
  return new Promise((resolve, reject) => {
    const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel || voiceChannel.type !== 'voice') return msg.reply('I couldn\'t connect to your voice channel...');
    voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
  });
}

const add = (msgContent) => {
  msg = msgContent.ARGS[1]
  if (url == '' || url === undefined) return msg.channel.send(`You must add a YouTube video url, or id after ${tokens.prefix}add`);
  yt.getInfo(url, (err, info) => {
    if(err) return msg.channel.send('Invalid YouTube Link: ' + err);
    if (!queue.hasOwnProperty(msg.guild.id)) queue[msg.guild.id] = {}, queue[msg.guild.id].playing = false, queue[msg.guild.id].songs = [];
    queue[msg.guild.id].songs.push({url: url, title: info.title, requester: msg.author.username});
    msg.channel.send(`added **${info.title}** to the queue`);
  });
}
const q = (msgContent) => {
  msg=msgContent.msg
  if (queue[msg.guild.id] === undefined) return msg.channel.send(`Add some songs to the queue first with ${tokens.prefix}add`);
  let tosend = [];
  queue[msg.guild.id].songs.forEach((song, i) => { tosend.push(`${i+1}. ${song.title} - Requested by: ${song.requester}`);});
  msg.channel.send(`__**${msg.guild.name}'s Music Queue:**__ Currently **${tosend.length}** songs queued ${(tosend.length > 15 ? '*[Only next 15 shown]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
}

const search = (msgContent) => {
  msg=msgContent.msg
  var search = require('youtube-search');
  let url1 = msgContent.ARGS[1]
  var opts = {
    maxResults: 10,
    key: 'AIzaSyDlI9NQ15aJ_xIafFNyGV0qelglDVBAQrY'
  };

  search(url1, opts, function(err, results) {
    if(err) return msg.channel.send(err);
    msg.channel.send(results);
  });
}




module.exports.play = play;
module.exports.join = join;
module.exports.add = add;
module.exports.q = q;
module.exports.search = search;
