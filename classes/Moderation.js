class Moderation {

    static admin = require('firebase-admin');
    static db = this.admin.firestore();

    /**
     * @returns {*}
     * @param sentence {string}
     */
    static async fetchPunishment(sentence) {
        let words = sentence.split(' ');
        const snapshot = await this.db.collection('words').get();
        let punishment = null;

        snapshot.forEach((doc) => {
            words.forEach(word => {
                if (word.toLowerCase() === doc.data().word.toLowerCase()) {
                    punishment = doc.data().punishment;
                }
            })
        });
        return punishment;
    }

    /**
     *
     * @param message
     * @param punishment {null|string}
     */
    static processToPunishment(message, punishment){
        if(punishment === null){
            return;
        }

        if(message.member.roles.cache.find(r => r.name === "Carton Jaune")){

            let cr = message.member.guild.roles.cache.find(r => r.name === "Carton Rouge")
            let cj =  message.member.guild.roles.cache.find(r => r.name === "Carton Jaune")
            message.member.roles.add(cr).then(rouge => {
                message.member.roles.remove(cj).then(jaune => {
                message.channel.send(`Et voila bravo <@${message.author.id}> tu viens de te manger un rouge, allez @+ !`);
                message.guild.channels.forEach(channel => {
                    channel.updateOverwrite(message.author, {
                        SEND_MESSAGES: false
                    })
                })
                setTimeout(() => {
                        message.member.roles.remove(cr).then(red=>{
                            message.channel.send(`Bon retour parmis nous <@${message.author.id}> mais restes calmes !`);
                            message.guild.channels.forEach(channel => {
                                channel.updateOverwrite(message.author, {
                                    SEND_MESSAGES: false
                                })
                            })
                        });
                    }, 1000*60*10);
                });
            });
        }

        if(
            !message.member.roles.cache.find(r => r.name === "Carton Jaune") &&
            !message.member.roles.cache.find(r => r.name === "Carton Rouge")
        ){
            let cj = message.member.guild.roles.cache.find(r => r.name === "Carton Jaune")
            message.member.roles.add(cj).then(data => {
                message.channel.send(`Attention <@${message.author.id}> tu viens de te manger un jaune, la prochaine c'est au frigo !`);
            });
        }
    }
}

module.exports = Moderation;