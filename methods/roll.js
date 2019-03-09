const main = (msgContent) => {
  msgContent.ACTION == undefined ?
  basic(msgContent) :
  custom(msgContent);
}

const custom = (msgContent) => {
  let msg = msgContent.msg;
  let roll;
	let rollmax = msgContent.ACTION;
			if (!rollmax || rollmax < 1) {
					msg.reply("Please specify a number of sides!");
					return;
			}
			else if (isNaN(rollmax)) {
					msg.reply("That's not a number.");
					return;
			}
  roll = Math.floor(Math.random()*(rollmax-1+1)+1);
  msg.reply({
    embed: {
      color: 3447003,  description: "You rolled a " + roll +  "."
    }
  });
}

const basic = (msgContent) => {
  let msg = msgContent.msg;
  let roll;
    roll = Math.floor(Math.random()*(6-1+1)+1);
    msg.reply({
      embed: {color: 3447003,  description: "You rolled a " + roll +  "."}
    });
  }

module.exports.main = main
