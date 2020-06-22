const express = require('express');
const router = express.Router();
const mongoclient = require('./../mongoclient.js');
const userDetails = require('./userDetails')

// for the details of a specific user
router.use('/:id/detail', userDetails)

/**
 * GET localhost:27000/users/
 */
router.get('/', (req, res) => {
    sendResponse(req, res, mongoclient.getAllUsers())
})

/**
 * GET localhost:27000/users/:id
 */
router.get('/:id', (req, res) => {
    sendResponse(req, res, mongoclient.getUser(req.params.id))
})

/**
 * POST localhost:27000/users/:id
 */
router.post('/:id', (req, res) => {
    sendResponse(req, res, mongoclient.createUser(req.params.id, req.body))
})

/**
 * DELETE localhost:27000/users/
 */
router.delete('/', (req, res) => {
    sendResponse(req, res, mongoclient.deleteAllUsers())
})

/**
 * DELETE localhost:27000/users/:id
 */
router.delete('/:id', (req, res) => {
    sendResponse(req, res, mongoclient.deleteUser(req.params.id))
})

function sendResponse(req, res, promise) {
    promise
        .then(response => {
            if (response) {
                res.send(response)
            } else {
                res.send(response.error)
            }
        })
        .finally(() => res.end())
        .catch(err => {
            console.error(err)
            res.status(500)
            res.end()
        })
}

module.exports = router;
