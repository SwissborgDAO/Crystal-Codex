const Discord = require('discord.js');
const {prefix,token,airtable_apiKey,airtable_baseKey,airtable_tableName,supported_languages,supported_article_languages,defaultlanguage} = require('./config.json');
// create a new Discord client
const client = new Discord.Client();


var Airtable = require('airtable');
var base = new Airtable({apiKey: airtable_apiKey}).base(airtable_baseKey);
// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
    //check the regex to prevent the bot from crashing if sending emoji
    var test= `^\\${prefix}\\w+`
    var regex= new RegExp(test,'g')
    if (message.content.match(regex)) {
        //substracting the prefix so that it won't matter if it changes
            
        var msg=message.content.substring(1)

        var validLanguage = true
        
        var splittedMessage = msg.split(" ")

        var lang = defaultlanguage
        var articleLang = defaultlanguage

        if(splittedMessage.length >= 2){
            if(supported_languages.includes(splittedMessage[1].toUpperCase())){
                lang = splittedMessage[1].toUpperCase()
            }else{
                validLanguage = false
            }
            if(supported_article_languages.includes(lang)){
                articleLang = lang
            }
        }

        var informations = ""

        switch (lang){
            case "FR": informations = "Si vous voulez plus d'informations : "; break;
            case "DE": informations = "Wenn sie mehr informationen wünschen : "; break;
            case "SP": informations = "Si desea más información : "; break;

            default: informations = "If you want more informations : "; break;
        }

        base(airtable_tableName).select({
            filterByFormula: `LOWER({Trigger}) = "${splittedMessage[0].toLowerCase()}"`,
            view: "Grid view"
        }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.
        
            records.forEach(function(record) {
                // /!\ will trigger only if a message match the database
                // if there is no match, the bot won't respond

                var messageSend = ""
                var articleInformations = ""

                if(validLanguage){
                    if(record.get(lang) == undefined){
                        messageSend = record.get(defaultlanguage)
                        if (messageSend == undefined){
                            switch (lang){
                                case "FR": messageSend = "Désolé, il n'y a pas de données disponibles pour ce trigger, veuillez contacter un modérateur pour cette erreur"; break;
                                case "DE": messageSend = "Leider sind für diesen trigger keine daten verfügbar, bitte kontaktieren sie einen moderator für diesen fehler."; break;
                                case "SP": messageSend = "Lo sentimos, no hay datos disponibles para este disparador, por favor, póngase en contacto con un moderador para este error."; break;
                                
                                default: messageSend = "Sorry, no data available for this trigger, please contact a moderator for this mistake."; break;
                            }
                        }
                    }else{
                        messageSend = record.get(lang)
                    }
    
                    var articleLink = record.get("Article Link")
                    
    
                    if(articleLink == undefined){
                        articleInformations = ""
                    }else{
                        if(articleLink.substring(0,22) == "https://swissborg.com/" && lang==articleLang && lang !="EN") {
                            articleLink = articleLink.substring(0,22) + lang.toLowerCase() + "/" + articleLink.substring(22,articleLink.length)
                        }
                        articleInformations = "\n" + informations + articleLink
                    }
                }else{
                    messageSend = "Unvailable language value, supported languages : "
                    for (let i = 0; i < supported_languages.length; i++){
                        messageSend += supported_languages[i] + "; "
                    }
                }
                
                

                switch (message.content) {
                    case `${prefix}tax`:
                        message.channel.send(record.get(lang));
                        break;
                    default:
                        var embedMsg = new Discord.MessageEmbed()
                        .setColor('#18227c')
                        .setAuthor('Crystal Codex', 'https://media.discordapp.net/attachments/838525490641371176/841784583505838080/CN.png')
                        .addFields(
                            {name:record.get('Trigger'),value:messageSend + articleInformations}
                            )
                        message.channel.send(embedMsg)
                        
                        break;
                    }
                });
    
        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
            fetchNextPage();
        }, function done(err) {
        if (err) { console.error(err); return; }
        });
    }
});

// client.on('message', message => {
// // Get the Guild and store it under the variable "list"
// const list = client.guilds.cache.get("788402678853402624"); 

// // Iterate through the collection of GuildMembers from the Guild getting the username property of each member 
// list.members.cache.each(members => console.log(members))
// });
// login to Discord with your app's token
client.login(token);