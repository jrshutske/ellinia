const greet = (msgContent) => {
  let msg = msgContent.msg
  msg.channel.send({embed: {
  color: 3447003,
  description: "Hello!"
  }});
}
module.exports.greet = greet;
