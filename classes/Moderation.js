const PunishmentModel = require("../models/PunishmentModel");
const Discord = require("discord.js");

class Moderation {

    static admin = require('firebase-admin');
    static db = this.admin.firestore();
    static yellowCardModel = require('../models/YellowCardModel');
    static redCardModel = require('../models/RedCardModel');


    /**
     * @returns {null|number}
     * @param sentence {string}
     */
    static async fetchPunishment(sentence) {
        const dictionary = await this.db.collection('dictonary').get();
        let punishment = null;

        dictionary.forEach((doc) => {
            doc.data().words.forEach(value => {
                let regex = new RegExp(`(${value.toLowerCase()})`);
                if (sentence.toLowerCase().match(regex)) {
                    punishment = doc.data().punishment_id;
                }
            })
        });

        return punishment ? PunishmentModel.getPunishment(punishment) : null;
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

            user.addRedCard(redCard).then(rouge => {
                user.removeYellowCard(yellowCard).then(jaune => {

                    this.redCardModel.saveCard(user).then(r => console.log(r));

                    let prettyRedCard = new Discord.MessageEmbed({
                        color: "#bf0000",
                        title: 'Carton Rouge',
                        description : `Carton au nom de : <@!${message.author.id}>`,
                        thumbnail: {
                            url: "https://24.media.tumblr.com/2246c2da7c85dde46837f70ed72785ea/tumblr_mgkv07TndM1rdg4zpo1_400.gif",
                        },
                        fields: [
                            {
                                name: `Phrase originale  :`,
                                value: message.content,
                            },
                            {
                                name: "Note de l'arbitre",
                                value: punishment.response,
                            },
                        ],
                        timestamp: new Date(),
                        footer: {
                            text: `On se revoit dans ${punishment.getMinutes().toString()} minutes !`,
                        },
                    });

                    message.channel.send(prettyRedCard);

                    message.guild.channels.cache.forEach(channel => {
                        channel.updateOverwrite(message.author, {
                            SEND_MESSAGES: false
                        })
                    });

                    setTimeout(() => {
                        user.removeRedCard(redCard).then(red => {
                            message.channel.send(`Bon retour parmis nous <@${message.author.id}> et oublie pas : ${punishment.response.toLowerCase()}`);
                            message.guild.channels.cache.forEach(channel => {
                                channel.updateOverwrite(message.author, {
                                    SEND_MESSAGES: true
                                })
                            })
                        });
                    }, 1000 * punishment.duration);
                });
            });
        }

        if (!user.hasRedCard() && !user.hasYellowCard()) {

            this.yellowCardModel.saveCard(user).then(r => console.log(r));

            message.member.roles.add(yellowCard).then(data => {

                const attachment = new Discord.MessageAttachment('./assets/yellow-card-gif/' + ( Math.floor(Math.random() * 3) )+ '.gif', 'carton.gif');
                let prettyYellowCard = new Discord.MessageEmbed({
                    color: "#ffff00",
                    title: 'Carton Jaune',
                    description : `Carton au nom de : <@!${message.author.id}>`,
                    thumbnail: {
                        url: "attachment://carton.gif"
                    },
                    fields: [
                        {
                            name: `Phrase originale  :`,
                            value: message.content,
                        },
                        {
                            name: "Note de l'arbitre",
                            value: punishment.response,
                        },
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: `Un conseil : reste tranquille pendant ${punishment.getMinutes().toString()} minutes sinon c'est frigo !`,
                    },
                }).attachFiles(attachment);

                message.channel.send(prettyYellowCard);

                setTimeout(() => {
                    user.removeYellowCard(yellowCard).then(red => {
                        let hasRed = user.hasRedCard();
                        if(!hasRed){
                            message.channel.send(`Bravo <@${message.author.id}> ton jaune à prit fin !`);
                        }else{
                            message.channel.send(`Bravo <@${message.author.id}> ton jaune à prit fin mais t'as encore un rouge alors fermes encore un peu ta bouche ;)`);
                        }

                    });
                }, 1000 * punishment.duration);
            });
        }
    }
}

module.exports = Moderation;