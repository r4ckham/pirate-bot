class User {

    static admin = require('firebase-admin');
    static db = this.admin.firestore();

    /**
     * Constructor
     * @param id{string}
     * @param roles {GuildMemberManager}
     */
    constructor(id,roles) {
        this.id = id;
        this.roles = roles;
    }

    hasYellowCard(){
        return !!this.roles.cache.find(r => r.name === "Carton Jaune");
    }

    hasRedCard(){
        return !!this.roles.cache.find(r => r.name === "Carton Rouge");
    }

}

module.exports = User;