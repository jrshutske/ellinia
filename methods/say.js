const main = (msgContent) => {
  let msg = msgContent.msg;
  msg.channel.send(msgContent.ARGS[1]);
}
module.exports.main = main;
