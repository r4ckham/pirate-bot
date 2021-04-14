// CONFIG FILE
var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });
// FIREBASE
const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert('pirate-bot-e12c3-firebase-adminsdk-g1cyf-1c48e3f223.json')
});
const db = admin.firestore();
// DISCORD
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

client.login(nconf.get('BOT_TOKEN'));