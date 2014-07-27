var PlugBotAPI = require('plugbotapi'); //Use 'npm install plugbotapi'

var Lastfm = require('simple-lastfm'); //Use 'npm install simple-lastfm'
var lastfm = new Lastfm({ //Get own last.fm account with api_key, api_secret, username, and password
    api_key: 'd657909b19fde5ac1491b756b6869d38',
    api_secret: '571e2972ae56bd9c1c6408f13696f1f3',
    username: 'BaderBombs',
    password: 'xxx'
});

var LastfmAPI = require('lastfmapi');
var lfm = new LastfmAPI({
    'api_key' : 'd657909b19fde5ac1491b756b6869d38',
    'secret' : '571e2972ae56bd9c1c6408f13696f1f3'
});

var request = require('request'); //Use 'npm install request'

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
            //Regular commands
            case ".commands":
                bot.chat("Command me as you must: .album, .artist, .djinfo, .events, .genre, .info, .similar .soundcloud, .track, .yesplay/.noplay");
                break;
            case ".modcommands":
                bot.chat("I am yours to command noble leader: .banuser, .front, .join/.leave, .move, .props, .skip, .warn");
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
            case ".props":
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

            //Last.fm + other music commands
            case ".artist": //Returns Last.fm info about the current artist, .artist [givenArtist] returns Last.fm info about a given artist
                var artistChoice="";
                if (qualifier==""){
                    artistChoice=media.author;
                }
                else{
                    artistChoice=qualifier;
                }
                lastfm.getArtistInfo({
                    artist: artistChoice,
                    callback: function(result) { 
                        if (result.success==true){
                            if (result.artistInfo.bio.summary!=""){
                                var summary=result.artistInfo.bio.summary;
                                summary=summary.replace(/(&quot;)/g, '"');
                                summary=summary.replace(/(&amp;)/g, '&');
                                summary=summary.replace(/(&eacute;)/g, 'é');
                                summary=summary.replace(/(&aacute;)/g, 'á');
                                summary=summary.replace(/(&auml;)/g, 'ä');
                                summary=summary.replace(/(&iacute;)/g, 'í');
                                summary=summary.replace(/(&oacute;)/g, 'ó');
                                summary=summary.replace(/(&Scaron;)/g, 'Š');
                                summary=summary.replace(/<[^>]+>/g, '');
                                if (summary.indexOf(" 1) ") != -1){
                                    summary=summary.substring(summary.lastIndexOf(" 1) ")+4);
                                    if (summary.indexOf(" 2) ") != -1){
                                        summary=summary.substring(0, summary.lastIndexOf(" 2)"));
                                    }
                                }   
                                else if (summary.indexOf(" 1. ") != -1){
                                    summary=summary.substring(summary.lastIndexOf(" 1. ")+4);
                                    if (summary.indexOf(" 2. ") != -1){
                                        summary=summary.substring(0, summary.lastIndexOf(" 2."));
                                    }
                                }     
                                else if (summary.indexOf(" (1) ") != -1){
                                    summary=summary.substring(summary.lastIndexOf(" (1) ")+4);
                                    if (summary.indexOf(" (2) ") != -1){
                                        summary=summary.substring(0, summary.lastIndexOf(" (2)"));
                                    }
                                }        
                                if (summary.length>250){
                                    summary=summary.substring(0, 247)+"...";
                                }                           
                                bot.chat(summary); 
                                var lastfmArtist=artistChoice;
                                lastfmArtist=lastfmArtist.replace(/ /g, '+');
                                bot.chat("For more info: http://www.last.fm/music/" + lastfmArtist);
                            }
                            else {
                                bot.chat("No artist info found.");
                            }
                        }
                        else {
                            bot.chat("No artist info found.");
                        }
                    }
                });
                break;
            case ".track": //Returns Last.fm info about the current song
                lastfm.getTrackInfo({
                    artist: media.author,
                    track: media.title,
                    callback: function(result) {
                        if (result.success==true){
                            if (result.trackInfo.wiki!=undefined){
                                var summary=result.trackInfo.wiki.summary;
                                summary=summary.replace(/(&quot;)/g, '"');
                                summary=summary.replace(/(&amp;)/g, '&');
                                summary=summary.replace(/(&eacute;)/g, 'é');
                                summary=summary.replace(/(&aacute;)/g, 'á');
                                summary=summary.replace(/(&auml;)/g, 'ä');
                                summary=summary.replace(/(&iacute;)/g, 'í');
                                summary=summary.replace(/(&oacute;)/g, 'ó');
                                summary=summary.replace(/(&Scaron;)/g, 'Š');
                                summary=summary.replace(/<[^>]+>/g, '');
                                if (summary.length>250){
                                    summary=summary.substring(0, 247)+"...";
                                }  
                                bot.chat(summary);
                            }
                            else {
                                bot.chat("No track info found.");
                            }
                        }
                        else {
                            bot.chat("No track info found.");
                        }
                    }
                });
                break;
            case ".genre": //Returns the genres of the current artist, .genre [givenArtist] returns the genres of a given artist
                var artistChoice="";
                if (qualifier==""){
                    artistChoice=media.author;
                    trackChoice=media.title;
                }
                else{
                    artistChoice=qualifier;
                    trackChoice=null;
                }
                lastfm.getTags({
                    artist: artistChoice,
                    track: trackChoice,
                    callback: function(result) {
                        var tags = "";
                        if (result.tags!=undefined){
                            for (var i=0; i<result.tags.length; i++){
                                tags+=result.tags[i].name;
                                tags+=", ";
                            }
                            tags=tags.substring(0, tags.length-2);
                        }
                        if (qualifier==""){
                            if (tags!=""){
                                bot.chat("Genre of "+trackChoice+" by "+artistChoice+": "+tags);
                            }
                            else{
                                bot.chat("No genre found.");
                            }
                        }
                        else{
                            if (tags!=""){
                                bot.chat("Genre of "+artistChoice+": "+tags);
                            }
                            else{
                                bot.chat("No genre found.");
                            }
                        }
                    }
                });
                break;
            case ".album": //Returns the album of the current song
                lfm.track.getInfo({
                    'artist' : media.author,
                    'track' : media.title
                }, function (err, track) {
                    if (track!=undefined){
                        lfm.album.getInfo({
                            'artist' : media.author,
                            'album' : track.album.title
                        }, function (err, album) {
                            var albumMessage = track.name + " is from the album " + track.album.title;
                            if (album.wiki!=undefined){
                                if (album.wiki.summary.indexOf('released on') != -1){
                                    var year = album.wiki.summary.substring(album.wiki.summary.indexOf('released on')).split(' ')[4].substring(0,4);
                                    albumMessage = albumMessage + " (" + year + ")";
                                }
                            }
                            bot.chat(albumMessage);
                            bot.chat("Check out the full album: " + track.album.url);
                        });
                    }
                    else{
                        bot.chat("No album found.");
                    }
                });
                break;
            case ".similar": //Returns similar artists of the current artist, .similar [givenArtist] returns similar artists of a given artist
                var artistChoice="";
                if (qualifier==""){
                    artistChoice=media.author;
                }
                else{
                    artistChoice=qualifier;
                }
                lfm.artist.getSimilar({
                    'limit' : 7,
                    'artist' : artistChoice,
                    'autocorrect' : 1
                }, function (err, similarArtists) {
                    if (similarArtists!=undefined){
                        var artists = '';
                        for (var i=0; i<similarArtists.artist.length; i++){
                            artists = artists + similarArtists.artist[i].name + ", ";
                        }
                        artists = artists.substring(0, artists.length-2);
                        bot.chat("Similar artists to " + artistChoice + ": " + artists);
                    }
                    else{
                        bot.chat("No similar artists found.");
                    }
                });
                break;
            case ".events": //Returns the artist's upcoming events, .events [givenArtist] returns a given artist's upcoming events
                var artistChoice="";
                if (qualifier==""){
                    artistChoice=media.author;
                }
                else{
                    artistChoice=qualifier;
                }
                lfm.artist.getEvents({
                    'limit' : 3,
                    'artist' : artistChoice
                }, function (err, events) {
                    if (events!=undefined){
                        var upcomingEvents = '';
                        if (!(events.event instanceof Array)){
                            events.event = [events.event];
                        }
                        for (var i=0; i<events.event.length; i++){
                            var day = '';
                            if (events.event[i].startDate.split(/\s+/).slice(1,2).join(" ").slice(0,1) == '0'){
                                day = events.event[i].startDate.split(/\s+/).slice(1,2).join(" ").slice(1,2);
                            }
                            else{
                                day = events.event[i].startDate.split(/\s+/).slice(1,2).join(" ");
                            }
                            upcomingEvents = upcomingEvents + events.event[i].startDate.split(/\s+/).slice(2,3).join(" ") + "/" + day + "/" + events.event[i].startDate.split(/\s+/).slice(3,4).join(" ").slice(-2) + " at " + events.event[i].venue.name + " in " + events.event[i].venue.location.city + ", " + events.event[i].venue.location.country + "; ";
                        }
                        upcomingEvents = upcomingEvents.substring(0, upcomingEvents.length-2);
                        upcomingEvents=upcomingEvents.replace(/Jan/g, '1');
                        upcomingEvents=upcomingEvents.replace(/Feb/g, '2');
                        upcomingEvents=upcomingEvents.replace(/Mar/g, '3');
                        upcomingEvents=upcomingEvents.replace(/Apr/g, '4');
                        upcomingEvents=upcomingEvents.replace(/May/g, '5');
                        upcomingEvents=upcomingEvents.replace(/Jun/g, '6');
                        upcomingEvents=upcomingEvents.replace(/Jul/g, '7');
                        upcomingEvents=upcomingEvents.replace(/Aug/g, '8');
                        upcomingEvents=upcomingEvents.replace(/Sep/g, '9');
                        upcomingEvents=upcomingEvents.replace(/Oct/g, '10');
                        upcomingEvents=upcomingEvents.replace(/Nov/g, '11');
                        upcomingEvents=upcomingEvents.replace(/Dec/g, '12');
                        bot.chat("Upcoming events for " + artistChoice + ": " + upcomingEvents);
                    }
                    else{
                        bot.chat("No upcoming events found.");
                    }
                });
                break;
            case ".sc":
            case ".soundcloud": //Returns the current artist's SC page, .soundcloud [givenArtist] returns a given artist's SC page
                var artistChoice="";
                if (qualifier==""){
                    artistChoice = media.author;
                }
                else{
                    artistChoice=qualifier;
                }
                var link = 'http://api.soundcloud.com/users.json?q=' + artistChoice + '&consumer_key=apigee';
                request(link, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var info = JSON.parse(body);
                        if (info[0] != undefined){
                            bot.chat(info[0].username + ": " + info[0].permalink_url);
                        }
                        else{
                            bot.chat("No soundcloud found.");
                        }
                    }
                });
                break;
            case ".fb"
            case ".facebook": //returns the url to the CYS facebook page
                bot.chat("True enlightenment lies within the like button on our face book page! https://www.facebook.com/pages/Calm-Your-Soul/1459317924326252?sk :thumbsup:")
        }
    });
});



