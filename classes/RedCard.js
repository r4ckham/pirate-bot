class RedCard {

    /**
     * Constructor
     * @param roleManager {RoleManager}
     */
    constructor(roleManager) {
        this.roleManager = roleManager;
        this.role = roleManager.cache.find(r => r.name === "Carton Rouge");
    }

    getRole(){
        return this.role;
    }


}

module.exports = RedCard;