const Discord = require('discord.js');
//const {prefix,allListTrigger,token,airtable_apiKey,airtable_baseKey,airtable_tableName,supported_languages,supported_article_languages,defaultlanguage,adminsID,FAQChannelID,ENChannelID,FRChannelID,DEChannelID,SPChannelID} = require('./.json');
// create a new Discord client
const client = new Discord.Client();
const functions = require('./functions.js');

var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.airtable_apiKey}).base(process.env.airtable_baseKey);
// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
    //check the regex to prevent the bot from crashing if sending emoji
    var test= `^\\${process.env.prefix}\\w+`
    var regex= new RegExp(test,'g')
    if (message.content.match(regex)) {
        //substracting the prefix so that it won't matter if it changes
        var values = functions.hello(message) //Get trigger, lang, article lang and if it's valid language
        var messageToSend = "*"

        if(!values.values.validLanguage){ //Not valid language
            messageToSend = functions.ifNotValidLanguage()
            var embedMsg = functions.createEmbedMessage(message, values, messageToSend);
            message.channel.send(embedMsg)
        }
        else if(values.trigger.toLowerCase() == process.env.allListTrigger){ //All Triggers

            var hasNonAdminRole = true
            for(let i = 0; i<process.env.adminsID.length; i++){
                if(message.member.roles.cache.has(process.env.adminsID[i])){
                    hasNonAdminRole = false
                    break
                }
            }

            if(hasNonAdminRole){
                switch (values.values.lang){
                    case "FR": messageToSend = "Votre rôle ne permet pas d'utiliser cette commande !"; break;
                    case "DE": messageToSend = "Ihre Rolle erlaubt Ihnen nicht, diesen Befehl zu verwenden !"; break;
                    case "SP": messageToSend = "¡Tu rol no te permite usar este comando !"; break;
                                    
                    default: messageToSend = "Your role does not allow you to use this command !"; break;
                }

                var embedMsg = functions.createEmbedMessage(message, values, messageToSend)
                    message.channel.send(embedMsg)
            }else if(!(process.env.FAQChannelID.includes(message.channel.id))){
                switch (values.values.lang){
                    case "FR": messageToSend = "Ce channel ne permet pas l'utilisation de cette commande !"; break;
                    case "DE": messageToSend = "Dieser Kanal erlaubt die Verwendung dieses Befehls nicht !"; break;
                    case "SP": messageToSend = "¡Este canal no permite el uso de este comando !"; break;
                                    
                    default: messageToSend = "This channel does not allow the use of this command !"; break;
                }

                var embedMsg = functions.createEmbedMessage(message, values, messageToSend)
                    message.channel.send(embedMsg)
            }else{
                base(process.env.airtable_tableName).select({
                    view: "Grid view"
                }).eachPage(function page(records, fetchNextPage) {
                    // This function (`page`) will get called for each page of records.
                    records.forEach(function(record) {
                        // /!\ will trigger only if a message match the database
                        // if there is no match, the bot won't respond
    
                        if(record.get("Trigger") != undefined){
                            values.trigger = record.get("Trigger")
                            messageToSend = record.get(values.values.lang)
                            messageToSend += "\n" + record.get("Article Link")
        
                            var embedMsg = functions.createEmbedMessage(message, values, messageToSend)
                            message.channel.send(embedMsg)
                        }
                    }
                    
                );
                // To fetch the next page of records, call `fetchNextPage`.
                // If there are more records, `page` will get called again.
                // If there are no more records, `done` will get called.
                    fetchNextPage();
                }, function done(err) {
                if (err) {console.log(console.error(err)); return; }
                });
            }
        }
        else{

            base(process.env.airtable_tableName).select({
                filterByFormula: `LOWER({Trigger}) = "${values.trigger.toLowerCase()}"`,
                view: "Grid view"
            }).eachPage(function page(records, fetchNextPage) {
                // This function (`page`) will get called for each page of records.
                records.forEach(function(record) {
                    // /!\ will trigger only if a message match the database
                    // if there is no match, the bot won't respond

                    var articleInformations = ""
                    
                    if(record.get(values.values.lang) == undefined){
                        messageToSend = record.get(process.env.defaultlanguage)
                        if (messageToSend == undefined){
                            switch (values.values.lang){
                                case "FR": messageToSend = "Désolé, il n'y a pas de données disponibles pour ce trigger, veuillez contacter un modérateur pour cette erreur"; break;
                                case "DE": messageToSend = "Leider sind für diesen trigger keine daten verfügbar, bitte kontaktieren sie einen moderator für diesen fehler."; break;
                                case "SP": messageToSend = "Lo sentimos, no hay datos disponibles para este disparador, por favor, póngase en contacto con un moderador para este error."; break;
                                    
                                default: messageToSend = "Sorry, no data available for this trigger, please contact a moderator for this mistake."; break;
                            }
                        }
                    }else{
                        messageToSend = record.get(values.values.lang)
                    }
        
                    var articleLink = record.get("Article Link")
                        
                    if(articleLink == undefined){
                        articleInformations = ""
                    }else{
                        var informations = ""
                        
                        switch (values.values.lang){
                            case "FR": informations = "Si vous voulez plus d'informations : "; break;
                            case "DE": informations = "Wenn sie mehr informationen wünschen : "; break;
                            case "SP": informations = "Si desea más información : "; break;
                
                            default: informations = "If you want more informations : "; break;
                        }

                        if(articleLink.substring(0,22) == "https://swissborg.com/" && values.values.lang==values.values.articleLang && values.values.lang !="EN") {
                            articleLink = articleLink.substring(0,22) + values.values.lang.toLowerCase() + "/" + articleLink.substring(22,articleLink.length)
                        }
                        articleInformations = "\n" + informations + articleLink
                    }
                    messageToSend += articleInformations
                    var embedMsg = functions.createEmbedMessage(message, values, messageToSend)
                    message.channel.send(embedMsg)
                }
                
            );
            // To fetch the next page of records, call `fetchNextPage`.
            // If there are more records, `page` will get called again.
            // If there are no more records, `done` will get called.
                fetchNextPage();
            }, function done(err) {
            if (err) {console.log(console.error(err)); return; }
            });

        }
        

    }
});

// client.on('message', message => {
// // Get the Guild and store it under the variable "list"
// const list = client.guilds.cache.get("788402678853402624"); 

// // Iterate through the collection of GuildMembers from the Guild getting the username property of each member 
// list.members.cache.each(members => console.log(members))
// });
// login to Discord with your app's token
client.login(process.env.token);
