const express = require('express')
const router = express.Router({mergeParams: true})
const mongoclient = require('./../mongoclient.js');
const User = require('./../models/users').User;
const util = require('util')

/**
 * Find a User by a specific id.
 *
 * POST localhost:27000/users/find/
 */
router.post('/', (req, res) => {

    let message = req.body

    console.debug("message:\n" + util.inspect(message, false, null, true))
    if (message) {
        console.log("message.messenger " + message.serviceName + " - message.id: " + message.serviceUserId)
        if (message.serviceName && message.serviceUserId) {

            mongoclient
                .findUser(message.serviceName, message.serviceUserId)
                .then(function (existingUserCandidate) {
                    if (existingUserCandidate) {
                        console.debug("user found:\n" + util.inspect(existingUserCandidate, false, null, true))
                        res.send(existingUserCandidate)
                        res.end()
                    } else {
                        console.debug("no existing user with messenger " + message.serviceName + " and messenger-id: " + message.serviceUserId)
                        mongoclient.createUser(message)
                            .then(function (user){
                                res.send(user.ops[0])
                                res.end()
                            })
                    }
                })
        } else {
            res.status(404)
            res.end()
        }
    } else {
        res.status(404)
        res.end()
    }
})

// function sendResponse(req, res, promise) {
//     promise
//         .then(response => {
//             if (response) {
//                 res.send(response)
//             } else {
//                 res.send(`Something bad happened`)
//             }
//         })
//         .finally(() => res.end())
//         .catch(err => {
//             console.error(err)
//             res.status(500)
//             res.end()
//         })
// }

module.exports = router