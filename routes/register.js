const express = require('express')
const router = express.Router({mergeParams: true})
const mongoclient = require('./../mongoclient.js');
const User = require('./../models/users').User;
const util = require('util')

/**
 * Register a new account to a given user
 *
 * POST localhost:27000/users/register/
 */
router.post('/',(req, res) => {
    let registerBody = req.body
    // required data to register a new account to the user
    console.debug("REGISTER USER: " + registerBody)
    let user = registerBody.user
    let account = registerBody.accountData
    // check if data is available
    if (user){
        if (account){
            if(user.id && account.id && account.messenger){
                    // register account and send back given response
                    mongoclient
                        .registerAccount(user,account)
                        .then(function (registerResult){
                            res.status(200)
                            res.send(registerResult)
                            res.end()
                        })
            } else {
                res.status(404)
                res.statusText = 'given account information not complete: user: ' + user.id + ', account: ' + account.id + '/' + account.messenger
                res.end()
            }
        } else {
            res.status(404)
            res.statusText = "account information missing in request"
            res.end()
        }
    } else {
        res.status(404)
        res.statusText = "user missing in request"
        res.end()
    }
})

/**
 * delete a account from a given user
 *
 * DELETE localhost:27000/users/register/
 */
router.delete('/', (req, res) =>{
    let registerBody = req.body
    // required data to delete a existing account from the user
    let user = registerBody.user
    let messenger = registerBody.messenger
    if(user){
        if(messenger){
            if(user.id){
                mongoclient
                    .deleteAccount(user,messenger)
                    .then(function (deleteResult) {
                        res.status(200)
                        res.send(deleteResult)
                        res.end()
                    })
            } else {
                res.status(404)
                res.statusText = 'incomplete user data no user-id found'
                res.end()
            }
        } else {
            res.status(404)
            res.statusText = "messenger information missing in request"
            res.end()
        }

    } else {
        res.status(404)
        res.statusText = "user missing in request"
        res.end()
    }
})
module.exports = router
