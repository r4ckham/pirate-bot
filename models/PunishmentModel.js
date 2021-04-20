const admin = require('firebase-admin');

const db = admin.firestore();
const Punishment = require('../classes/Punishment');

class PunishmentModel {
  static async getPunishment(id) {
    const punishmentRef = db.collection('punishment');
    const punishment = await punishmentRef.get();
    const data = punishment.docs.find((p) => p.data().id === id);
    return data && new Punishment(data.data().id, data.data().response, data.data().duration);
  }
}

module.exports = PunishmentModel;
