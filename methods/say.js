const main = (msgContent) => {
  let msg = msgContent.msg;
  msg.channel.send(msgContent.ACTION);
}
module.exports.main = main;
