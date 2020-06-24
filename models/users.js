"use strict";
class User {
    constructor(id, nickname) {
        this.id = parseInt(id)
        this.nickname = nickname
    }
}

module.exports.User = User;