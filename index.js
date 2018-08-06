    const botConfig = require('./config.json');
    const Discord = require("discord.js");

    //turn on bot and log confirmations
    var bot = new Discord.Client();
    bot.on("ready", function()
    {
        console.log("I'm up and running!");
    });

    //event listener for when someone joins
    bot.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find('name', 'member-log');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Welcome to the server, ${member}`);
    });
    //event listener for messages
    bot.on('message', message => {
        if (!message.content.startsWith(botConfig.prefix) || message.author.bot) return;

        const ARGS = message.content.slice(botConfig.prefix.length).trim().split(/ +/g);
        const COMMAND = ARGS.shift().toLowerCase();

        //command to have the bot say something and delete it's message
        if(COMMAND === "say"){
            let text = ARGS.slice(0).join(" ");
            message.delete();
            message.channel.send(text);
        }
        //Simple message response
        if (COMMAND === 'hi')
        {
            message.channel.send({embed: {
            color: 3447003,
            description: "Hello!"
            }});
        }

        //dice roll that takes arguments(sides)
        var roll;
        var rollmax;

        if (COMMAND === "roll") {
            let rollmax = ARGS[0];
                if (!rollmax || rollmax < 1) {
                    message.reply("Please specify a number of sides!");
                    return;
                }
                else if (isNaN(rollmax)) {
                    message.reply("That's not a number.");
                    return;
                }
        roll = Math.floor(Math.random()*(rollmax-1+1)+1);
        message.reply({embed: {
        color: 3447003,  description: "You rolled a " + roll +  "."
        }});
        }
    /*
    *
    * 777 styled Slot machine of discord emojis.
    *
    */
    var preSlotsNumbers = [":tangerine:",":watermelon:",":pear:",":grapes:",":cherries:",":banana:",":seven:"];
    var postSlotsNumbers = [];
    var randomItem;
    var slotString = "**[:slot_machine: l SLOTS ]\n-----------------\n**";
    var bet;
    var slotsResult;
    var winnings;

    //~slots will trigger this. The argument is how much they bet. (Credits/Money)
    if (COMMAND === 'slots')
    {
        let bet = ARGS[0];
        var slotsCounter;

        if (!bet || bet < 1 || isNaN(bet)) {
            message.reply("Make sure to place a bet!");
            return;
        }

        for (slotsCounter = 0; slotsCounter < 9; slotsCounter++) {
            randomItem = preSlotsNumbers[Math.floor(Math.random()*preSlotsNumbers.length)];

            postSlotsNumbers.push(randomItem);

            slotString += postSlotsNumbers[slotsCounter] + " ";

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

    if (postSlotsNumbers[3] == postSlotsNumbers[4] || postSlotsNumbers[4] == postSlotsNumbers[5]
        || postSlotsNumbers[3] == postSlotsNumbers[5]) {
            if (postSlotsNumbers[3] == postSlotsNumbers[4] && postSlotsNumbers[3] == postSlotsNumbers[5]) {
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

    message.channel.send(slotString + "\n\nYou used " + bet + " credit(s) and " + slotsResult);
    }
    //end
    });


    bot.login(botConfig.token);
