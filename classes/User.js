class User {

    static admin = require('firebase-admin');
    static db = this.admin.firestore();

    /**
     * Constructor
     * @param id{string}
     * @param roles {GuildMemberRoleManager}
     */
    constructor(id,roles) {
        this.id = id;
        this.roles = roles;
    }

    /**
     *
     * @returns {boolean}
     */
    hasYellowCard(){
        return !!this.roles.cache.find(r => r.name === "Carton Jaune");
    }

    /**
     *
     * @returns {boolean}
     */
    hasRedCard(){
        return !!this.roles.cache.find(r => r.name === "Carton Rouge");
    }

    /**
     *
     * @param yellowCard
     * @returns {Promise<GuildMember>}
     */
    addYellowCard(yellowCard){
        return this.roles.add(yellowCard);
    }

    /**
     *
     * @param redCard
     * @returns {Promise<GuildMember>}
     */
    addRedCard(redCard){
        return this.roles.add(redCard);
    }

    /**
     *
     * @param redCard
     * @returns {Promise<GuildMember>}
     */
    removeRedCard(redCard){
        return this.roles.remove(redCard);
    }

    /**
     *
     * @param yellowCard
     * @returns {Promise<GuildMember>}
     */
    removeYellowCard(yellowCard){
        return this.roles.remove(yellowCard);
    }

}

module.exports = User;