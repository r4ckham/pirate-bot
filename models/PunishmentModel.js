class YellowCardModel {
    static admin = require('firebase-admin');
    static db = this.admin.firestore();
    static Punishment = require('../classes/Punishment');

    static async getPunishment(id){
        const punishmentRef = this.db.collection('punishment');
        const punishment = await punishmentRef.get();
        const data = punishment.docs.find(p => p.data().id === id);
        return data ? new this.Punishment(data.data().id, data.data().response, data.data().duration) : null;
    }

}

module.exports = YellowCardModel;