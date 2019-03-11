const { Client, RichEmbed } = require('discord.js')
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const main = (msgContent) => {
  msg = msgContent.msg;
  client = msgContent.client;
  realm = msgContent.ARGS[1];
  character = msgContent.ARGS[2];
  getToken();
}

const getCharacter = () => {
  let xhr2 = new XMLHttpRequest();
  let url = `https://us.api.blizzard.com/wow/character/${realm}/${character}?access_token=${token}`;
  xhr2.open("get", url);
  xhr2.onreadystatechange = () => {
    if(xhr2.readyState == 4) {
      let jsonr = JSON.parse(xhr2.responseText);
      if (jsonr.reason == "Character not found.") {
        msg.channel.send("Character not found!");
      }
      if (jsonr.reason == "Realm not found.") {
        msg.channel.send("Realm not found!");
      }
      if (jsonr.reason == null) {
        realmName = jsonr.realm
        name = jsonr.name
        level = jsonr.level
        achievementPoints = jsonr.achievementPoints
        totalHonorableKills = jsonr.totalHonorableKills
        thumbnail = jsonr.thumbnail;
        className = getClassName(jsonr.class);

      }
    }
  }
  xhr2.send(null);
}

const getToken = () => {
  let xhr = new XMLHttpRequest();
  let url = `https://us.battle.net/oauth/token?client_id=f0315fe57d76491695b77140f61ffda3&client_secret=MFVeGxsAhQyTIxWt0SJMhxaE7c87ioSv&grant_type=client_credentials`;
  xhr.open("get", url);
  xhr.onreadystatechange = () => {
    if(xhr.readyState == 4) {
      let jsonr = JSON.parse(xhr.responseText);
      token = jsonr.access_token
      getCharacter(token)
    }
  }
  xhr.send(null);
}

const getClassName = (classNum) => {
  let xhr = new XMLHttpRequest();
  let url = `https://us.api.blizzard.com/wow/data/character/classes?locale=en_US&access_token=${token}`;
  xhr.open("get", url);
  xhr.onreadystatechange = () => {
    if(xhr.readyState == 4) {
      let jsonr = JSON.parse(xhr.responseText);
      jsonr.classes.forEach(function(element) {
        if (classNum == element.id) {
          msg.channel.send(buildCharEmbed(element.name));
        }
      });
    }
  }
  xhr.send(null);
}

const buildCharEmbed = (className) => {
  let classIcon = className.trim().toLowerCase().replace(/\s/g, '');
  let tnstr = thumbnail.replace("avatar", "main");
  const embed = new RichEmbed()
    .setTitle(name)
    .setColor(000000)
    .setDescription(realmName, true)
    .addField("Level:", level, true)
    .addField("Class:", className, true)
    .addField("Achievement Points:", achievementPoints, true)
    .addField("Honorable Kills:", totalHonorableKills, true)
    .setThumbnail(`https://wow.zamimg.com/images/wow/icons/large/classicon_${classIcon}.jpg`)
    .setImage(`http://render-us.worldofwarcraft.com/character/${tnstr}`)
    .setTimestamp()
    .setURL(`https://worldofwarcraft.com/en-us/character/us/${realm}/${character}`)
    .setFooter("Character Data - Powered By Peasant", client.user.avatarURL)
  return {embed};
}

module.exports.main = main;
