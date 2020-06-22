"use strict";
class User {
    constructor(id, nickname, details) {
        this.id = parseInt(id)
        this.nickname = nickname
        this.details = details
    }
}

module.exports.User = User;