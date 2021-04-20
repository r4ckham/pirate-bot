const admin = require('firebase-admin');

const db = admin.firestore();
class YellowCardModel {
  static async saveCard(user) {
    return db.collection('yellowCard').add({
      userId: user.id,
      date: Date.now(),
    });
  }
}

module.exports = YellowCardModel;
