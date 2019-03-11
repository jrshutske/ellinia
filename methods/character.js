const { Client, RichEmbed } = require('discord.js')
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let msg;
let client;
let realm;
let character;

const main = (msgContent) => {
  msg = msgContent.msg;
  client = msgContent.client;
  realm = msgContent.ARGS[1];
  character = msgContent.ARGS[2];
  getToken();
}

const getCharacter = (token) => {
  let xhr2 = new XMLHttpRequest();
  let url = `https://us.api.blizzard.com/wow/character/${realm}/${character}?access_token=${token}`;
  xhr2.open("get", url);
  xhr2.onreadystatechange = () => {
    if(xhr2.readyState == 4) {
      let jsonr = JSON.parse(xhr2.responseText);
      if (jsonr.reason == "Character not found.") {
        msg.channel.send("Character not found.");
      }
      if (jsonr.reason == "Realm not found.") {
        msg.channel.send("Realm not found.");
      }
      if (jsonr.reason == null) {
        className = getClassName(jsonr.class);
        playerEmbed = buildCharEmbed(jsonr,className);
        msg.channel.send(playerEmbed);
      }
    }
  }
  xhr2.send(null);
}

const getToken = () => {
  let xhr = new XMLHttpRequest();
  let tokenurl = `https://us.battle.net/oauth/token?client_id=f0315fe57d76491695b77140f61ffda3&client_secret=MFVeGxsAhQyTIxWt0SJMhxaE7c87ioSv&grant_type=client_credentials`;
  xhr.open("get", tokenurl);
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
  switch(classNum) {
    case 1:return "Warrior";
    case 2:return "Paladin";
    case 3:return "Hunter";
    case 4:return "Rogue";
    case 5:return "Priest";
    case 6:return "Death Knight";
    case 7:return "Shaman";
    case 8:return "Mage";
    case 9:return "Warlock";
    case 10:return "Monk";
    case 11:return "Druid";
    case 12:return "Demon Hunter";
    default:return null;
  }
}

const buildCharEmbed = (jsonr, className) => {
  let classIcon = className.trim().toLowerCase().replace(/\s/g, '');
  let tnstr = jsonr.thumbnail.replace("avatar", "main");
  const embed = new RichEmbed()
    .setTitle(jsonr.name)
    .setColor(000000)
    .setDescription(jsonr.realm, true)
    .addField("Level:", jsonr.level, true)
    .addField("Class:", className, true)
    .addField("Achievement Points:", jsonr.achievementPoints, true)
    .addField("Honorable Kills:", jsonr.totalHonorableKills, true)
    .setThumbnail(`https://wow.zamimg.com/images/wow/icons/large/classicon_${classIcon}.jpg`)
    .setImage(`http://render-us.worldofwarcraft.com/character/${tnstr}`)
    .setTimestamp()
    .setURL(`https://worldofwarcraft.com/en-us/character/us/${realm}/${character}`)
    .setFooter("Character Data - Powered By Peasant", client.user.avatarURL)
  return {embed};
}

module.exports.main = main;
