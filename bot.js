var PlugBotAPI = require('plugbotapi'); //Use 'npm install plugbotapi'

// Instead of providing the AUTH, you can use this static method to get the AUTH cookie via twitter login credentials:
PlugBotAPI.getAuth({
    username: 'SoulSamuraiBot',
    password: 'badasK456'
}, function(err, auth) { 
    if(err) {
        console.log("An error occurred: " + err);
        return;
    }
    var bot = new PlugBotAPI(auth);
    var ROOM = 'calm-your-soul'; //Enter your room name
    bot.connect(ROOM);

    //Event which triggers when anyone chats
    bot.on('chat', function(data) {
        var command=data.message.split(' ')[0];
        var firstIndex=data.message.indexOf(' ');
        var qualifier="";
        if (firstIndex!=-1){
            qualifier = data.message.substring(firstIndex+1, data.message.length);
        }
        qualifier=qualifier.replace(/&#39;/g, '\'');
        qualifier=qualifier.replace(/&#34;/g, '\"');
        qualifier=qualifier.replace(/&amp;/g, '\&');
        qualifier=qualifier.replace(/&lt;/gi, '\<');
        qualifier=qualifier.replace(/&gt;/gi, '\>');
        switch (command)
        {
            case ".hey": //Makes the bot greet the user 
                bot.chat("Well hey there! @"+data.from);
                break;
        }
    });
});



