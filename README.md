# crystal-bot

A Discord bot that connects to an airtable grid.
all the commands and their answer is on the airtable.
Useful for example to use the bot as a dictionnary.

for the bot to work,
One need an [airtable](https://airtable.com/) account, or connect to one, and have a config.json, which must be added to the project with the follow information:

```
{
	"prefix": "DESIRED PREFIX",
	"token": "YOUR-DISCORD-TOKEN",
    	"airtable_baseKey":"BASE-KEY",
    	"airtable_tableName":"NAME-OF-THE-TABLE",
    	"airtable_apiKey":"APIKEY"

}
```
The table used is a simple table with to column: Name and Notes.
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
