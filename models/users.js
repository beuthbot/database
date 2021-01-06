"use strict";
const MessengerID = require("./messengerID").MessengerID;
const Details = require("./details").Details;

class User {

    constructor(id, nickname, firstName, lastName) {
        this.id = parseInt(id);
        this.nickname = nickname;
        this.firstName = firstName;
        this.lastName = lastName;
        this.messengerIDs = [];
        this.details = [];
    }

    addMessengerID(messengerID, messenger){
        if(messenger){
            this.messengerIDs.push(new MessengerID(messenger,messengerID));
        }
        else{
            this.messengerIDs.push(messengerID);
        }
    }

    addDetail(detail,value){
        if(value){
            this.details.push(new Details(detail,value));
        }else{
            this.details.push(detail);
        }
    }

    getDetail(detail){
        this.details.forEach(function(value){
            if(value.detail.equals(detail)){
                return value.value;
            }
        })

        return ""
    }

    getMessengerID(messenger){
        this.messengerIDs.forEach(function(value){
            if(value.messenger.equals(messenger)){
                return value.id;
            }
        })

        return ""
    }
}

module.exports.User = User;