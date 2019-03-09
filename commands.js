const char = require('./methods/character.js')
const say = require('./methods/say.js')
const music = require('./methods/music.js')
const slots = require('./methods/slots.js')
const greeting = require('./methods/greeting.js')
const roll = require('./methods/roll.js')

const command = (msgContent) => {
  switch(msgContent.COMMAND) {
    case "char"   : return char.main(msgContent)
    case "say"    : return say.main(msgContent)
    case "slots"  : return slots.main(msgContent)
    case "roll"   : return roll.main(msgContent)
    case "play"   : return music.play(msgContent)
    case "join"   : return music.join(msgContent)
    case "add"    : return music.add(msgContent)
    case "q"      : return music.q(msgContent)
    case "search" : return music.search(msgContent)
    case "yo"     :
    case "hi"     :
    case "sup"    :
    case "hey"    :
    case "hello"  : return greeting.greet(msgContent)
    default:return null
  }
}
module.exports.command = command
