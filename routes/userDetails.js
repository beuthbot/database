const express = require('express')
const router = express.Router({mergeParams: true})
const mongoclient = require('./../mongoclient.js');

router.get('/', (req, res, next) => {
    res.send(`This is userDetails route of ${req.params.id}`)
})

router.post('/', (req, res, next) => {
    sendResponse(req, res, mongoclient.addDetail(req.params.id, req.body))
})

router.delete('/', (req, res, next) => {
    sendResponse(req, res, mongoclient.deleteDetail(req.params.id))
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
        .finally(() => res.end())
        .catch(err => {
            console.error(err)
            res.status(500)
            res.end()
        })
}

module.exports = router