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
        {
            case ".SoulSamurai":
                bot.chat("Well hello, noble warrior @"+data.from + ", my job as a SoulSamurai is to protect and server those in need of calming there soul!");
                break;
        }
        {
            case ".info":
                bot.chat("This is a room to enjoy wonderful relaxing chillout tunes. Make sure to be aware of our room's regulations and genre specifications. We focus particularly on electronic chillout. If your new you can view what genres to play by typing '.djinfo'");
                break;
        }
        {
            case ".djinfo":
                bot.chat("We love good music and when are users stick to the CYS genres it makes users expience on CYS much better! So if your going to join the waitlist and you are new to CYS here are a few guide lines:");
                bot.chat("CYS is usually farelly open as to what you can play, we take pride in are open genre selection. Try to focus on electronic chillout songs acoustics are sometimes exceptional as long as they're mellow and calm your soul. ");
                bot.chat("some good examples of :thumbsup: genres are as listed: Ambient, Chillstep, Chillwave, Deep House, Downtempo, Drone, Dub, Electronica, Instrumental Hip Hop, Jazz, Liquid D&B, Psychill, Trill, Triphop" + "Vocals are better soft or absent.");
                bot.chat("Some examples of :thumbsdown: genres: Dubstep, Electro, Hip Hop, House, Indie, J-Pop, K-Pop, Metal, Pop, Rap, Reggae, Rock, Screamo, Trance, Trap");
                bot.chat("We also appreciate hearing new songs and underground tracks! If your an artist your self we would love to hear what you have to play and if you stick around for a bit and people really like your tracks, we can talk further and will make you a residential dj on CYS! for more info type '.resdjs'");
                bot.chat("Final tips for djing on CYS, try to keep the genre in flow for example if someone plays a dub song before your turn is time to play try your best to follow up with a simaller sounding song or another stick to that genre that was played before your song.");
                //TODO make '.resdj' command but first discuss resdj as a staff group
            
        }
    });
});



