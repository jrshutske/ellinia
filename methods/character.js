var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
module.exports = {
  'lookup': (realm, character, msg) => {
    let xhr = new XMLHttpRequest();
    let url = "https://us.api.blizzard.com/wow/character/"+realm+"/"+character+"?access_token=USWfF5nmNA8D4zmalj671f8zBNUvSo1CNx";
    xhr.open("get", url);
    xhr.onreadystatechange = () => {
      if(xhr.readyState == 4) {
        responsetext = xhr.responseText;
        msg.channel.send(responsetext);
      }
    }
    xhr.send(null);
  }

}
