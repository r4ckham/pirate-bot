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
        return punishment;
    }

    /**
     *
     * @param redCard {Role}
     * @param yellowCard {Role}
     * @param message
     * @param punishment {null|string}
     */
    static processToPunishment(user, yellowCard, redCard, message, punishment) {
        if (punishment === null) {
            return;
        }

        if (user.hasYellowCard()) {

            user.addRedCard(redCard).then(rouge => {
                user.removeYellowCard(yellowCard).then(jaune => {

                    this.redCardModel.saveCard(user).then(r => console.log(r));

                    message.channel.send(`Et voila bravo <@${message.author.id}> tu viens de te manger un rouge, allez @+ ! `);
                    message.guild.channels.forEach(channel => {
                        channel.updateOverwrite(message.author, {
                            SEND_MESSAGES: false
                        })
                    });

                    setTimeout(() => {
                        user.removeRedCard(redCard).then(red => {
                            message.channel.send(`Bon retour parmis nous <@${message.author.id}> mais restes calmes ! !`);
                            message.guild.channels.forEach(channel => {
                                channel.updateOverwrite(message.author, {
                                    SEND_MESSAGES: true
                                })
                            })
                        });
                    }, 1000 * 60 * 10);
                });
            });
        }

        if (!user.hasRedCard() && !user.hasYellowCard()) {

            this.yellowCardModel.saveCard(user).then(r => console.log(r));

            message.member.roles.add(yellowCard).then(data => {
                message.channel.send(`Attention <@${message.author.id}> tu viens de te manger un jaune, la prochaine c'est au frigo !`);
                setTimeout(() => {
                    user.removeYellowCard(yellowCard).then(red => {
                        message.channel.send(`Bravo <@${message.author.id}> ton jaune à prit fin !`);
                    });
                }, 1000 * 60);
            });
        }
    }
}

module.exports = Moderation;