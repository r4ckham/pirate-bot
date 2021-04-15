class RedCardModel {
    static admin = require('firebase-admin');
    static db = this.admin.firestore();


}

module.exports = RedCardModel;