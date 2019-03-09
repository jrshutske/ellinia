const play = (msgContent) => {
  let msg = msgContent.msg;
  let bet = msg.content.split(' ')[1];
  var fruits = [":tangerine:",":grapes:",":cherries:",":seven:"];
  var spunFruits = [];
  var randomItem;
  var slotString = "**[:slot_machine: l SLOTS ]\n-----------------\n**";
  var slotsResult;
  var winnings;

  if (!bet || bet < 1 || isNaN(bet)) {
      msg.reply("Make sure to place a bet!");
      return;
  }

  for (let slotsCounter = 0; slotsCounter < 9; slotsCounter++) {
      randomItem = fruits[Math.floor(Math.random()*fruits.length)];
      spunFruits.push(randomItem);
      slotString += spunFruits[slotsCounter] + " ";

      if (slotsCounter == 2 || slotsCounter == 5 || slotsCounter == 8) {
          if (slotsCounter == 5) {
              slotString += "<<<";
          }
          slotString += "\n";
      }

      if (slotsCounter != 2 && slotsCounter != 5 && slotsCounter != 8) {
          slotString += ": ";
      }
  };
  slotString += "**-----------------**\n";

  if (spunFruits[3] == spunFruits[4] || spunFruits[4] == spunFruits[5]
    || spunFruits[3] == spunFruits[5]) {
        if (spunFruits[3] == spunFruits[4] && spunFruits[3] == spunFruits[5]) {
            slotString += "**| : : : WIN : : : |**";
            winnings = bet * 3;
            slotsResult = "tripled it to " + winnings;
            return;
        }
        slotString += "**| : : :  WIN  : : : |**";
        winnings = bet * 2;
        slotsResult = "doubled it to " + winnings;
    }
  else {
    slotString += "**| : : : LOSS : : : |**";
    winnings = bet * 0;
    slotsResult = "lost all of it.";
  }

  msg.channel.send(slotString + "\n\nYou used " + bet + " credit(s) and " + slotsResult);
}
module.exports.play = play
