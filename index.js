var config = require('config.json')
const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    console.log(message);

    let author = message.author;

    if(message.member.roles.cache.find(r => r.name === "Carton Rouge")) {
        message.channel.send(`Ferme ta gueule ${message.author.username}, et oui t'as pris un rouge !`);
    }


});

client.login(config.BOT_TOKEN);