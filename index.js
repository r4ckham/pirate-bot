// CONFIG FILE
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 3456));

app.listen(app.get('port'), function () {
    const env = require('dotenv').config();
    const admin = require('firebase-admin');
    admin.initializeApp({
        credential: admin.credential.cert({
            "type": process.env.TYPE,
            "project_id": process.env.PROJECT_ID,
            "private_key_id": process.env.PRIVATE_KEY_ID,
            "private_key": process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
            "client_email": process.env.CLIENT_EMAIL,
            "client_id": process.env.CLIENT_ID,
            "auth_uri": process.env.AUTH_URI,
            "token_uri": process.env.TOKEN_URI,
            "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
            "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL
         })    
    });
    const db = admin.firestore();
    // DISCORD
    const Discord = require('discord.js');
    const client = new Discord.Client();
    // HANDLER
    const Moderation = require("./classes/Moderation");
    const YellowCard = require("./classes/YellowCard");
    const RedCard = require("./classes/RedCard");
    const User = require("./classes/User");
    const UnbanCommand = require("./commands/UnbanCommand");


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
        let yellowCard = new YellowCard(message.guild.roles);
        let redCard = new RedCard(message.guild.roles);
        let user = new User(author.id, message.member.roles);

        if (author.bot) {
            return;
        }

        const args = message.content.slice((process.env.BOT_PREFIX).length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (author.id === message.guild.owner.user.id) {
            if (command === "unban") {
                let targetUser = client.users.fetch(args[0].replace(/\D/g, '')).then(r => {
                    UnbanCommand.execute(message, r);
                });
            }
        }

        let verdict = Moderation.fetchPunishment(message.content);

        verdict.then(punishment => {
            Moderation.processToPunishment(user, yellowCard.getRole(), redCard.getRole(), message, punishment);
        });

        if (message.member.roles.cache.find(r => r.name === "Carton Rouge")) {
            message.delete({
                timeout: 0,
                reason: null,
            });
            message.channel.send(`Et oui t'as un rouge <@${message.author.id}> alors merci de fermer ta gueule !`, {
                files: ["https://media2.giphy.com/media/l3q2KrjUq4DRHCQzm/giphy.gif"]
            });
        }

    });

    client.login(process.env.BOT_TOKEN);
});