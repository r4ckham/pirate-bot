/* eslint-disable no-console */
const express = require('express');
const { wakeDyno } = require('heroku-keep-awake');
require('dotenv').config();
const admin = require('firebase-admin');
const Discord = require('discord.js');
const Utils = require('./Utils/Utils');

const client = new Discord.Client();
const RedCard = require('./classes/RedCard');

const YellowCard = require('./classes/YellowCard');
const FabricCommand = require('./commands/FabricCommand');

const DYNO_URL = 'https://banner-rackham.herokuapp.com/';

const opts = {
  interval: 20,
  logging: true,
  stopTimes: { start: '5:59', end: '06:00' },
};

const app = express();

app.set('port', (process.env.PORT || 3456));

app.listen(app.get('port'), () => {
  wakeDyno(DYNO_URL, opts);
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.TYPE,
      project_id: process.env.PROJECT_ID,
      private_key_id: process.env.PRIVATE_KEY_ID,
      private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.CLIENT_EMAIL,
      client_id: process.env.CLIENT_ID,
      auth_uri: process.env.AUTH_URI,
      token_uri: process.env.TOKEN_URI,
      auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    }),
  });

  // eslint-disable-next-line global-require
  const Moderation = require('./classes/Moderation');
  // eslint-disable-next-line global-require
  const User = require('./classes/User');

  admin.firestore();

  client.once('ready', () => {
    // eslint-disable-next-line no-multi-str
    console.log('\
            ██████╗  ██████╗ ████████╗    ███████╗████████╗ █████╗ ██████╗ ████████╗\n\
            ██╔══██╗██╔═══██╗╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔══██╗╚══██╔══╝\n\
            ██████╔╝██║   ██║   ██║       ███████╗   ██║   ███████║██████╔╝   ██║   \n\
            ██╔══██╗██║   ██║   ██║       ╚════██║   ██║   ██╔══██║██╔══██╗   ██║   \n\
            ██████╔╝╚██████╔╝   ██║       ███████║   ██║   ██║  ██║██║  ██║   ██║   \n\
            ╚═════╝  ╚═════╝    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   \n\
        ');
  });

  client.on('message', (message) => {
    const { author } = message;
    const yellowCard = new YellowCard(message.guild.roles);
    const redCard = new RedCard(message.guild.roles);
    const user = new User(author.id, message.member.roles);

    if (author.bot) {
      return;
    }

    const args = message.content.slice((process.env.BOT_PREFIX).length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    const regex = new RegExp(`(^${process.env.BOT_PREFIX})`);

    if (message.content.match(regex)) {
      if (message.guild.owner && author.id === message.guild.owner.user.id) {
        const exec = FabricCommand.getCommand(command, message);
        if (exec) {
          if (exec.name === 'unban') {
            client.users.fetch(args[0].replace(/\D/g, '')).then((r) => {
              exec.execute(message, r);
            });
          }
        } else {
          message.delete({ timeout: 0, reason: null }).then(() => {
            message.channel.send(`<@${author.id}> seul le propriétaire du serveur est autorisé à utliser les commandes !`);
          });
        }
      }

      const verdict = Moderation.fetchPunishment(message.content);

      verdict.then((punishment) => {
        Moderation.processToPunishment(
          user, yellowCard.getRole(),
          redCard.getRole(),
          message,
          punishment,
        );
      });

      if (message.member.roles.cache.find((r) => r.name === 'Carton Rouge')) {
        message.delete({
          timeout: 0,
          reason: null,
        });

        message.channel.send(Utils.createEmbededMessage('#ffff00', 'Rappel', 'https://media2.giphy.com/media/l3q2KrjUq4DRHCQzm/giphy.gif', message));
      }
    }
  });

  client.login(process.env.BOT_TOKEN);
});
