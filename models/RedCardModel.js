const admin = require('firebase-admin');

const db = admin.firestore();
class RedCardModel {
  static async saveCard(user) {
    return db.collection('redCard').add({
      userId: user.id,
      date: Date.now(),
    });
  }
}

module.exports = RedCardModel;
