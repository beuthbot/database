const express = require('express');
const router = express.Router();
const mongoclient = require('./../mongoclient.js');

router.get('/', (req, res) => {
    sendResponse(req, res, mongoclient.getAllUsers())
})

router.get('/:id', (req, res) => {
    sendResponse(req, res, mongoclient.getUser(req.params.id))
})

router.post('/:id', (req, res) => {
    sendResponse(req, res, mongoclient.createUser(req.params.id, req.body))
})

router.delete('/', (req, res) => {
    sendResponse(req, res, mongoclient.deleteAllUsers())
})

router.delete('/:id', (req, res) => {
    sendResponse(req, res, mongoclient.deleteUser(req.params.id))
})

function sendResponse(req, res, promise) {
    promise
        .then(response => {
            if (response) {
                res.send(response)
            } else {
                res.send(`Something Bad happened!`)
            }
        })
        .then(() => res.end())
        .catch(err => {
            console.error(err)
            res.status(500)
            res.end()
        })
}

module.exports = router;
