const Discord = require('discord.js');
const {prefix,token,airtable_apiKey,airtable_baseKey,airtable_tableName} = require('./config.json');
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
        base(airtable_tableName).select({
            filterByFormula: `{Name} = "${msg}"`,
            view: "Grid view"
        }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.
        
            records.forEach(function(record) {
                // /!\ will trigger only if a message match the database
                // if there is no match, the bot won't respond
                switch (message.content) {
                    case `${prefix}tax`:
                        message.channel.send(record.get('Notes'));
                        break;
                    default:
                        var embedMsg = new Discord.MessageEmbed()
                        .setColor('#18227c')
                        .setAuthor('Crystal Codex', 'https://media.discordapp.net/attachments/838525490641371176/841784583505838080/CN.png')
                        .addFields(
                            {name:record.get('Name'),value:record.get('Notes')}
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
// login to Discord with your app's token
client.login(token);