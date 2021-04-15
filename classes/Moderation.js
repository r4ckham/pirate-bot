const PunishmentModel = require("../models/PunishmentModel");

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

        console.log("punishment", punishment);

        if (user.hasYellowCard()) {

            user.addRedCard(redCard).then(rouge => {
                user.removeYellowCard(yellowCard).then(jaune => {

                    this.redCardModel.saveCard(user).then(r => console.log(r));

                    message.channel.send(`! CARTON ROUGE ! \nAllez @ + <@${message.author.id}> ${punishment.response.toLowerCase()} \nOn se revoit dans ${punishment.getMinutes().toString()} minutes ;)`, {
                        files: ["https://24.media.tumblr.com/2246c2da7c85dde46837f70ed72785ea/tumblr_mgkv07TndM1rdg4zpo1_400.gif"]
                    });

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
                message.channel.send(
                    `! CARTON JAUNE ! \nAttention <@${message.author.id}> ${punishment.response.toLowerCase()} \nReste tranquile pendant ${punishment.getMinutes().toString()} minutes`, {
                        files : ['https://media0.giphy.com/media/3o72Fiu6B2vBEwZnIA/giphy.gif'],
                    }
                );
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