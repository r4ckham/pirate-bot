class YellowCard {

    /**
     * Constructor
     * @param roleManager {RoleManager}
     */
    constructor(roleManager) {
        this.roleManager = roleManager;
        this.role = roleManager.cache.find(r => r.name === "Carton Jaune");
    }

    getRole(){
        return this.role;
    }


}

module.exports = YellowCard;