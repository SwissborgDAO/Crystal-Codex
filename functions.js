const Discord = require('discord.js');
//const {prefix,allListTrigger,token,airtable_apiKey,airtable_baseKey,airtable_tableName,supported_languages,supported_article_languages,defaultlanguage,adminsID,FAQChannelID,ENChannelID,FRChannelID,DEChannelID,SPChannelID} = require('./config.json');

function hello(messageReceived){
    var msg=messageReceived.content.substring(1).split(" ")

    var values = langUsages(messageReceived, msg)
    var trigger = msg[0]
    var question=""
    return {trigger, values,question};
}

function langUsages(message, msg){
    var lang = process.env.defaultlanguage
    var articleLang = process.env.defaultlanguage
    var validLanguage = true

    if(process.env.ENChannelID.includes(message.channel.id)){lang = "EN"}
    if(process.env.FRChannelID.includes(message.channel.id)){lang = "FR"}
    if(process.env.DEChannelID.includes(message.channel.id)){lang = "DE"}
    if(process.env.SPChannelID.includes(message.channel.id)){lang = "SP"}

    if(msg.length >= 2){
        if(process.env.supported_languages.includes(msg[1].toUpperCase())){
            lang = msg[1].toUpperCase()
        }else{
            validLanguage = false
        }
        if(process.env.supported_article_languages.includes(lang)){
            articleLang = lang
        }
    }

    return {lang, articleLang, validLanguage};
}

function ifNotValidLanguage(){
    message = "Unvailable language value, supported languages : "
        for (let i = 0; i < process.env.supported_languages.length; i++){
            message += process.env.supported_languages[i] + "; "
        }
    return message
}

function createEmbedMessage(message, values, messageToSend){
    switch (message.content) {
        case `${process.env.prefix}tax`:
            message.channel.send(record.get(values.values.lang));
            break;
        default:
            var embedMsg = new Discord.MessageEmbed()
            .setColor('#01c38d')
            .setAuthor('SwissBorg', 'https://cdn.discordapp.com/attachments/766745098326507560/887956978821914634/App-Icon.png')
            .addFields(
                {name:values.question,value:messageToSend}
                )
            break;
    }
    return embedMsg;
}

module.exports = {hello, ifNotValidLanguage,createEmbedMessage}
