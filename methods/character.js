const { Client, RichEmbed } = require('discord.js')
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

  const lookup = (realm, character, msg, me) => {
    let xhr = new XMLHttpRequest();
    let url = `https://us.api.blizzard.com/wow/character/${realm}/${character}?access_token=USWfF5nmNA8D4zmalj671f8zBNUvSo1CNx`;
    xhr.open("get", url);
    xhr.onreadystatechange = () => {
      if(xhr.readyState == 4) {
        jsonr = JSON.parse(xhr.responseText);
        if (jsonr.reason == "Character not found.") {
          msg.channel.send("Character not found.");
        }
        if (jsonr.reason == "Realm not found.") {
          msg.channel.send("Realm not found.");
        }
        if (jsonr.reason == null) {
          className = getClassName(jsonr.class);
          playerEmbed = buildCharEmbed(jsonr,className, me);
          msg.channel.send(playerEmbed);
          return playerEmbed
        }
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

  const buildCharEmbed = (jsonr, className, me) => {
    let classIcon = className.trim().toLowerCase();
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
      .setURL(`https://worldofwarcraft.com/en-us/character/us/${jsonr.realm}/${jsonr.name}`)
      .setFooter("Character Data - Powered By Peasant", me.avatarURL)
    return {embed};
  }

  module.exports.lookup = lookup;
