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
// HANDLER
const Moderation = require("./classes/Moderation");


client.once('ready', () => {
    console.log('\
                    ██████╗  ██████╗ ████████╗    ███████╗████████╗ █████╗ ██████╗ ████████╗\n\
                    ██╔══██╗██╔═══██╗╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔══██╗╚══██╔══╝\n\
                    ██████╔╝██║   ██║   ██║       ███████╗   ██║   ███████║██████╔╝   ██║   \n\
                    ██╔══██╗██║   ██║   ██║       ╚════██║   ██║   ██╔══██║██╔══██╗   ██║   \n\
                    ██████╔╝╚██████╔╝   ██║       ███████║   ██║   ██║  ██║██║  ██║   ██║   \n\
                    ╚═════╝  ╚═════╝    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   \n\
    ');
});

client.on('message', message => {
    let author = message.author;

    if (author.bot){
        return;
    }

    let verdict = Moderation.fetchPunishment(message.content);

    verdict.then(punishment =>{
        Moderation.processToPunishment(message, punishment);
    });

    if(message.member.roles.cache.find(r => r.name === "Carton Rouge")) {
        message.delete({
            timeout: 0,
            reason: null,
        });
        message.channel.send(`Et oui t'as un rouge <@${message.author.id}> alors merci de fermer ta gueule !`);
    }

});

client.login(nconf.get('BOT_TOKEN'));