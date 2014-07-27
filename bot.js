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

    bot.on('roomJoin', function(data) {
        bot.getMedia(function(currentMedia) { 
            media = currentMedia; 
        });
        bot.getWaitList(function(currentWaitlist) { 
            waitlist = currentWaitlist; 
        });
        bot.getDJ(function(currentDJ) { 
            dj = currentDJ; 
        });
        bot.getStaff(function(currentStaff) { 
            staff = currentStaff; 
        });
        bot.getUsers(function(currentUserbase) { 
            users = currentUserbase; 
        });
        console.log("I'm live!");
    });

    //Event which triggers when new DJ starts playing a song
    bot.on('djAdvance', function(data) {
        bot.getMedia(function(currentMedia) { 
            media = currentMedia; 
        });
        bot.getDJ(function(currentDJ) { 
            dj = currentDJ; 
        });
    });

    //Event which triggers when the DJ history updates
    bot.on('historyUpdate', function(data) { //The code below is just to check for artists, if they play their own stuff it outputs their SoundCloud
        var noSpaceName = media.author.toLowerCase().replace(/ +/g, "");
        var wordCheck = false;
        var authorWords = media.author.toLowerCase().split(' ');
        for (var i=0; i < authorWords.length; i++){
            if (dj.username.toLowerCase().indexOf(authorWords[i]) > -1 && authorWords[i].match(/[a-zA-Z]/g)){
                wordCheck = true;
            }
        }
        if (dj.username.toLowerCase() == media.author.toLowerCase() || dj.username.toLowerCase() == noSpaceName || wordCheck){
            var link = 'http://api.soundcloud.com/users.json?q=' + media.author + '&consumer_key=apigee';
            request(link, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var info = JSON.parse(body);
                    if (info[0] != undefined){
                        bot.chat(info[0].username + ": " + info[0].permalink_url);
                    }
                }
            });
        }
    });

    //Event which triggers when waitlist changes
    bot.on('waitListUpdate', function(data) {
        bot.getWaitList(function(currentWaitlist) { 
            waitlist = currentWaitlist; 
        });
    });

    //Event which triggers with a user joins the room
    bot.on('userJoin', function(data) {
        //console.log(data);
        bot.getStaff(function(currentStaff) { 
            staff = currentStaff; 
        });
        bot.getUsers(function(currentUserbase) { 
            users = currentUserbase; 
        });
    });

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
        var isMod = false;
        for (var i=0; i<staff.length; i++){
            if (staff[i].username == data.from && staff[i].permission > 1){
                isMod = true;
            }
        }
        switch (command)
        {
            //Room commands
            case ".commands":
                bot.chat("List of Commands: .djinfo, .info, .yesplay/.noplay");
                break;
            case ".modcommands":
                bot.chat("List of Commands: .banuser, .front, .join/.leave, .move, .props, .skip, .warn");
                break;  
            case ".yesplay":
                bot.chat("Types of music we encourage in Calm Your Soul: Ambient, Chillstep, Chillwave, Deep House, Downtempo, Drone, Dub, Electronica, Instrumental Hip Hop, Jazz, Liquid D&B, Psychill, Trill, Triphop. Vocals are better soft or absent.");
                break;
            case ".noplay":
                bot.chat("Dubstep, Electro, Hip Hop, House, Indie, J-Pop, K-Pop, Metal, Pop, Rap, Reggae, Rock, Screamo, Trance, Trap");
                break; 
            case ".hey": 
                bot.chat("Well hey there! @" + data.from);
                break;
            case ".props": //Makes the bot give props to the user
            case ".propsicle":
                bot.chat("You have learned the way of the samurai @"+dj.username);
                bot.woot();
                break;
            case ".soulsamurai":
                bot.chat("Well hello, noble warrior @" + data.from + ", my job as a SoulSamurai is to protect and serve those in need of calming their soul!");
                break;
            case ".info":
                bot.chat("This is a room to enjoy wonderful relaxing chillout tunes. Make sure to be aware of our room's regulations and genre specifications. We focus particularly on electronic chillout. If you're new you can view what genres to play by typing '.djinfo'");
                break; 
            case ".djinfo":
                bot.chat("We love good music and when our users stick to the CYS genres it makes the user experience on CYS much better! So if you're going to join the waitlist and you are new to CYS here are a few guidelines:");
                bot.chat("CYS is usually fairly open as to what you can play, we take pride in are open genre selection. Try to focus on electronic chillout songs. Acoustics are sometimes an exception as long as they're mellow and calm your soul. ");
                bot.chat("We also appreciate hearing new songs and underground tracks! If you're an artist yourself we would love to hear what you have to play. If you stick around for a bit and people really like your tracks, we can talk further about making you a residenti dj on CYS! For more info type '.resdjs'");
                bot.chat("Final tips for djing on CYS, try to keep the genre in flow. For example, if someone plays a dub song before your turn and it's your turn to play, try your best to follow up with a similar sounding song. Stick to that genre that was played before your song.");
                break;
            case ".resdjs":
                bot.chat("In order to become a resident dj on CYS you must produce your own music (includes originals and remixes). Music produced must fit our genre specifications. Must be somewhat active in chat (not completely silent all the time). And you must be a frequent user of CYS");
                break;

            //Mod commands
            case ".warn": //Skips a user playing an off-genre song
                if (isMod){
                    bot.chat("@" + dj.username + " Your tune does not fall within the established genre of Calm Your Soul. Please type .noplay or .yesplay for more info.");
                    bot.moderateForceSkip(dj.id);
                }
                break;
            case ".banuser": //Bans a user from the room permanently with .banuser [givenUser]
                if (isMod){
                    for (var j=0; j<users.length; j++){
                        if (users[j].username == qualifier){
                            bot.moderateBanUser(users[j].id, "spamming");
                        }
                    }
                }
                break;
            case ".move": //Moves a user in the waitlist with .move [givenUser], [givenSpot]
                if (isMod){
                    for (var j=0; j<users.length; j++){
                        if (users[j].username == qualifier.split(' ')[0]){
                            if (Number(qualifier.split(' ')[1]) > waitlist.length){
                                bot.chat("Sorry, there are only " + waitlist.length + " people in the waitlist, please try again.");
                            }
                            else{
                                bot.moderateMoveDJ(users[j].id, Number(qualifier.split(' ')[1]));
                            }
                        }
                    }
                }
                break;
            case ".front": //Moves a user to the front of the waitlist with .front [givenUser]
                if (isMod){
                    for (var j=0; j<users.length; j++){
                        if (users[j].username == qualifier.split(' ')[0]){
                            bot.moderateMoveDJ(users[j].id, 1);
                        }
                    }
                }
                break;
            case ".join": //Makes the bot join the waitlist
                if (isMod){
                    bot.djJoin();
                    bot.chat("Joining waitlist!");
                }
                break;
            case ".leave": //Makes the bot leave the waitlist
                if (isMod){
                    bot.djLeave();
                    bot.chat("Leaving waitlist.");
                }
                break;
            case ".skip": //Makes the bot skip the current song
                if (isMod){
                    bot.chat("Skipping!");
                    bot.moderateForceSkip(dj.id);
                }
                break;
        }
    });
});



