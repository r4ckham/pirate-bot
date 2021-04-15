class YellowCardModel {
    static admin = require('firebase-admin');
    static db = this.admin.firestore();


}

module.exports = YellowCardModel;