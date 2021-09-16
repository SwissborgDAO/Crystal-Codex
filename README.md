# crystal-Codex

A Discord bot that connects to an airtable grid.
all the commands and their answer is on the airtable.
Useful for example to use the bot as a dictionnary.

for the bot to work,
One need an [airtable](https://airtable.com/) account, or connect to one, and have a config.json, which must be added to the project with the following information:

```
{
	"prefix": "DESIRED PREFIX",
	"allListTrigger": "DESIRED TRIGGER TO SHOW ALL COMMAND LIST",
	"token": "YOUR-DISCORD-TOKEN",
    	"airtable_baseKey":"BASE-KEY",
    	"airtable_tableName":"NAME-OF-THE-TABLE",
    	"airtable_apiKey":"APIKEY"	
	"supported_languages": ["LANGUAGE 1","LANGUAGE 2"],
	"supported_article_languages": ["LANGUAGE 1", "LANGUAGE 2"],
	"defaultlanguage": "DEFAULT LANGUAGE",
	"adminsID": ["ADMIN ID 1", "ADMIN ID 2"],
	"FAQChannelID": ["FAQ DISCORD CHANNEL ID 1", "FAQ DISCORD CHANNEL ID 2"],
	"ENChannelID": ["EN DISCORD DISCORD CHANNEL ID 1", "EN DISCORD CHANNEL ID 2"],
	"FRChannelID": ["FR DISCORD CHANNEL ID 1", "FR DISCORD CHANNEL ID 2"],
	"DEChannelID": ["DE DISCORD CHANNEL ID 1", "DE DISCORD CHANNEL ID 2"],
	"SPChannelID": ["SP DISCORD CHANNEL ID 1", "SP DISCORD CHANNEL ID 2"]
}
```
The table used is a simple table with columns: Trigger, Article Link and language columns (EN, FR, DE, SP).


![table overview](https://cdn.discordapp.com/attachments/813825488840949770/843452249153994752/unknown.png)

## Command
to use the bot, clone the project, fill the config.json with the necessary field, do a 
```
npm install 
```
for the dependencies

and launch with
```
nodemon
```
