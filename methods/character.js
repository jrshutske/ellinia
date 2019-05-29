  const { Client, RichEmbed } = require('discord.js')
  const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  const fetch = require("node-fetch");

  const main = (msgContent) => {
    let msg = msgContent.msg;
    let client = msgContent.client;
    let realm = msgContent.ARGS[1];
    let character = msgContent.ARGS[2];
    getCharacterData(msg, client, realm, character);
  }

  const getCharacter = (realm, character, token) => {
    return new Promise((resolve, reject) => {
    fetch(`https://us.api.blizzard.com/wow/character/${realm}/${character}?access_token=${token}`)
      .then((response) =>  response.json())
      .then((jsonr) => {
        let characterObj = {};
        if (jsonr.reason == null) {
          characterObj.realm = jsonr.realm
          characterObj.name = jsonr.name
          characterObj.level = jsonr.level
          characterObj.achievementPoints = jsonr.achievementPoints
          characterObj.totalHonorableKills = jsonr.totalHonorableKills
          characterObj.thumbnail = jsonr.thumbnail;
          characterObj.class = jsonr.class;
          resolve(characterObj);
        }
        if (jsonr.reason) {
          reject(Error(jsonr.reason));
          msg.channel.send("Character not found!");
        }
      })
    })
  }

  const getToken = () => {
    return new Promise((resolve, reject) => {
    fetch(`https://us.battle.net/oauth/token?client_id=f0315fe57d76491695b77140f61ffda3&client_secret=MFVeGxsAhQyTIxWt0SJMhxaE7c87ioSv&grant_type=client_credentials`)
      .then((response) =>  response.json())
      .then((myJson) => {
        let token = myJson.access_token
        if ( token ) {
          resolve(token);
        } else {
          reject(Error("Could not get an access token."));
        }
      })
    })
  }

  const  getClassName  = (token, classNum) => {
    return new Promise((resolve, reject) => {
      fetch(`https://us.api.blizzard.com/wow/data/character/classes?locale=en_US&access_token=${token}`)
        .then((response) =>  response.json())
        .then((myJson) => {
          let className;
          myJson.classes.forEach((element) =>{
            if (classNum == element.id) {
              className = element.name;
            }
          })
          className ? resolve(className) : reject(Error("Could not get an access token."))
        })
      })
  }

  const  buildEmbed  = (characterObj, client) => {
    return new Promise((resolve)  => {
      let classIcon = characterObj.class.trim().toLowerCase().replace(/\s/g, '');
      let tnstr = characterObj.thumbnail.replace("avatar", "main");
      const embed = new RichEmbed()
        .setTitle(characterObj.name)
        .setColor(000000)
        .setDescription(characterObj.realm, true)
        .addField("Level:", characterObj.level, true)
        .addField("Class:", characterObj.class, true)
        .addField("Achievement Points:", characterObj.achievementPoints, true)
        .addField("Honorable Kills:", characterObj.totalHonorableKills, true)
        .setThumbnail(`https://wow.zamimg.com/images/wow/icons/large/classicon_${classIcon}.jpg`)
        .setImage(`http://render-us.worldofwarcraft.com/character/${tnstr}`)
        .setTimestamp()
        .setURL(`https://worldofwarcraft.com/en-us/character/us/${characterObj.realm}/${characterObj.name}`)
        .setFooter("Character Data - Powered By Peasant", client.user.avatarURL)
      resolve({embed});
    })
  }

  const getCharacterData = (msg, client, realm, character) => {
    getToken().then((token) => {
      getCharacter(realm, character, token).then((characterObj) => {
        getClassName(token, characterObj.class).then((className) => {
          characterObj.class = className;
          buildEmbed(characterObj, client).then((embed)=>{
            msg.channel.send(embed)
          })
        }).catch((error)=>console.log(error))
      }).catch((error)=>console.log(error))
    }).catch((error)=>console.log(error))
  }

  module.exports.main = main;
