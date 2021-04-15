class RedCardModel {
    static admin = require('firebase-admin');
    static db = this.admin.firestore();

    static async saveCard(user){
        return this.db.collection('redCard').add({
            userId: user.id,
            date: Date.now(),
        });
    }
}

module.exports = RedCardModel;