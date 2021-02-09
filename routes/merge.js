const express = require('express')
const router = express.Router({mergeParams: true})
const mongoclient = require('./../mongoclient.js');
const User = require('./../models/users').User;
const util = require('util')

/**
 * merges two given user into one final user
 *
 * POST localhost:27000/users/register/merge/
 */
router.post('/',(req,res) => {
    let mergeBody = req.body
    console.debug("MERGE USER: " + mergeBody)
    // body contains the users to merge
    let users = mergeBody.users
    let mergeUser = users[0]
    let oldUser = users[1]
    // check if data is available
    if(mergeUser && oldUser){
        // check attributes of user objects
        if(mergeUser.id && mergeUser.details && mergeUser.messengerIDs && oldUser.id && oldUser.details && mergeUser.messengerIDs){
            mongoclient
                .mergeUsers(mergeUser,oldUser)
                .then(function(mergeResult){
                    res.status(200)
                    res.send(mergeResult)
                    res.end()
                })
        } else {
            res.status(404)
            res.statusText = "user data is corrupted"
            res.end()
        }
    } else {
        res.status(404)
        res.statusText = "user data missing in request"
        res.end()
    }
})

module.exports = router