class YellowCardModel {
    static admin = require('firebase-admin');
    static db = this.admin.firestore();

    static async saveCard(user){
        return this.db.collection('yellowCard').add({
            userId: user.id,
            date: Date.now(),
        });
    }

}

module.exports = YellowCardModel;