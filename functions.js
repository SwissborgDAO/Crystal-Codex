const Discord = require('discord.js');
const {prefix,allListTrigger,token,airtable_apiKey,airtable_baseKey,airtable_tableName,supported_languages,supported_article_languages,defaultlanguage,adminsID,FAQChannelID,ENChannelID,FRChannelID,DEChannelID,SPChannelID} = require('./config.json');

function hello(messageReceived){
    var msg=messageReceived.content.substring(1).split(" ")

    var values = langUsages(messageReceived, msg)
    var trigger = msg[0]

    return {trigger, values};
}

function langUsages(message, msg){
    var lang = defaultlanguage
    var articleLang = defaultlanguage
    var validLanguage = true

    if(ENChannelID.includes(message.channel.id)){lang = "EN"}
    if(FRChannelID.includes(message.channel.id)){lang = "FR"}
    if(DEChannelID.includes(message.channel.id)){lang = "DE"}
    if(SPChannelID.includes(message.channel.id)){lang = "SP"}

    if(msg.length >= 2){
        if(supported_languages.includes(msg[1].toUpperCase())){
            lang = msg[1].toUpperCase()
        }else{
            validLanguage = false
        }
        if(supported_article_languages.includes(lang)){
            articleLang = lang
        }
    }

    return {lang, articleLang, validLanguage};
}

function ifNotValidLanguage(){
    message = "Unvailable language value, supported languages : "
        for (let i = 0; i < supported_languages.length; i++){
            message += supported_languages[i] + "; "
        }
    return message
}

function createEmbedMessage(message, values, messageToSend){
    switch (message.content) {
        case `${prefix}tax`:
            message.channel.send(record.get(values.values.lang));
            break;
        default:
            var embedMsg = new Discord.MessageEmbed()
            .setColor('#18227c')
            .setAuthor('Crystal Codex', 'https://media.discordapp.net/attachments/838525490641371176/841784583505838080/CN.png')
            .addFields(
                {name:values.trigger,value:messageToSend}
                )
            break;
    }
    return embedMsg;
}

module.exports = {hello, ifNotValidLanguage,createEmbedMessage}