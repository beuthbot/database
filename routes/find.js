const express = require('express')
const router = express.Router({mergeParams: true})
const mongoclient = require('./../mongoclient.js');
const User = require('./../models/users').User;
const util = require('util')

/**
 * Find a User by a specific id.
 *
 * GET localhost:27000/users/find/
 */
router.post('/', (req, res) => {

    console.log("req.body: " + req.body)

    let message = req.body
    if (message) {
        console.log("message.telegramId: " + message.telegramId)
        if (message.telegramId) {

            mongoclient
                .findUser("telegramId", message.telegramId)
                .then(function (existingUserCandidate) {
                    console.debug("existingUserCandidate:\n" + util.inspect(existingUserCandidate, false, null, true) + "\n\n")
                    if (existingUserCandidate && existingUserCandidate.telegramId) {
                        res.send(existingUserCandidate)
                        res.end()
                    } else {

                        mongoclient
                            .getUsersCount()
                            .then(function (usersCount) {

                                console.log("usersCount: " + usersCount)
                                console.log("usersCount: " + typeof usersCount)

                                if (Number.isInteger(usersCount)) {
                                    let nextId = usersCount + 1
                                    console.log("nextId: " + nextId)

                                    let newUser = new User(nextId, message.nickname, {})
                                    newUser.telegramId = message.telegramId
                                    newUser.firstName = message.firstName
                                    newUser.lastName = message.lastName

                                    let createdUser = mongoclient.createUser(newUser)
                                    createdUser._id = null

                                    console.debug("createdUser:\n" + util.inspect(createdUser, false, null, true) + "\n\n")

                                    res.send(createdUser)
                                    res.end()
                                } else {
                                    res.status(404)
                                    res.end()
                                }
                            })
                    }
                })
        } else {
            res.status(404)
            res.end()
        }

        // a good place to add more ids...
    } else {
        res.status(404)
        res.end()
    }
})

function sendResponse(req, res, promise) {
    promise
        .then(response => {
            if (response) {
                res.send(response)
            } else {
                res.send(`Something bad happened`)
            }
        })
        .finally(() => res.end())
        .catch(err => {
            console.error(err)
            res.status(500)
            res.end()
        })
}

module.exports = router