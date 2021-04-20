const Discord = require('discord.js');
const admin = require('firebase-admin');

const db = admin.firestore();
const PunishmentModel = require('../models/PunishmentModel');
const Utils = require('../Utils/Utils');
const yellowCardModel = require('../models/YellowCardModel');
const redCardModel = require('../models/RedCardModel');

class Moderation {
  /**
     * @returns {null|number}
     * @param sentence {string}
     */
  static async fetchPunishment(sentence) {
    const dictionary = await db.collection('dictonary').get();
    let punishment = null;

    dictionary.forEach((doc) => {
      doc.data().words.forEach((value) => {
        const regex = new RegExp(`(${value.toLowerCase()})`);
        if (sentence.toLowerCase().match(regex)) {
          punishment = doc.data().punishment_id;
        }
      });
    });

    return punishment && PunishmentModel.getPunishment(punishment);
  }

  /**
     *
     * @param redCard {Role}
     * @param yellowCard {Role}
     * @param message
     * @param punishment {null|Punishment}
     */
  static processToPunishment(user, yellowCard, redCard, message, punishment) {
    if (punishment === null) {
      return;
    }

    if (user.hasYellowCard()) {
      user.addRedCard(redCard).then(() => {
        user.removeYellowCard(yellowCard).then(() => {
          redCardModel.saveCard(user).then((r) => console.log(r));

          message.channel.send(Utils.createEmbededMessage(
            '#bf0000',
            'Carton Rouge',
            'https://24.media.tumblr.com/2246c2da7c85dde46837f70ed72785ea/tumblr_mgkv07TndM1rdg4zpo1_400.gif',
            message,
            punishment,
            `On se revoit dans ${punishment.getMinutes().toString()} minutes !`,
          ));

          message.guild.channels.cache.forEach((channel) => {
            channel.updateOverwrite(message.author, {
              SEND_MESSAGES: false,
            });
          });

          setTimeout(() => {
            user.removeRedCard(redCard).then(() => {
              message.channel.send(`Bon retour parmis nous <@${message.author.id}> et oublie pas : ${punishment.response.toLowerCase()}`);
              message.guild.channels.cache.forEach((channel) => {
                channel.updateOverwrite(message.author, {
                  SEND_MESSAGES: true,
                });
              });
            });
          }, 1000 * punishment.duration);
        });
      });
    }

    if (!user.hasRedCard() && !user.hasYellowCard()) {
      // eslint-disable-next-line no-console
      yellowCardModel.saveCard(user).then((r) => console.log(r));

      message.member.roles.add(yellowCard).then(() => {
        const attachment = new Discord.MessageAttachment(`./assets/yellow-card-gif/${Math.floor(Math.random() * 3)}.gif`, 'carton.gif');

        message.channel.send(Utils.createEmbededMessage(
          '#ffff00',
          'Carton Jaune',
          'attachment://carton.gif',
          message,
          punishment,
          `Un conseil : reste tranquille pendant ${punishment.getMinutes().toString()} minutes sinon c'est frigo !`,
        ).attachFiles(attachment));

        setTimeout(() => {
          user.removeYellowCard(yellowCard).then(() => {
            const hasRed = user.hasRedCard();
            if (!hasRed) {
              message.channel.send(`Bravo <@${message.author.id}> ton jaune à prit fin !`);
            } else {
              message.channel.send(`Bravo <@${message.author.id}> ton jaune à prit fin mais t'as encore un rouge alors fermes encore un peu ta bouche ;)`);
            }
          });
        }, 1000 * punishment.duration);
      });
    }
  }
}

module.exports = Moderation;
