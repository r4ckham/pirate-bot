class Punishment {

    /**
     *
     * @param id {number}
     * @param response {string}
     * @param time {number}
     */
    constructor(id, response, time) {
        this._id = id;
        this._response = response;
        this._duration = time;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get response() {
        return this._response;
    }

    set response(value) {
        this._response = value;
    }

    get duration() {
        return this._duration;
    }

    set duration(value) {
        this._duration = value;
    }
}

module.exports = Punishment;