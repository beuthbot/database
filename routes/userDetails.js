const express = require('express')
const router = express.Router({mergeParams: true})
const mongoclient = require('./../mongoclient.js');

router.get('/', (req, res, next) => {
    res.send(`This is userDetails route of ${req.params.id}`)
})

router.post('/', (req, res, next) => {
    sendResponse(req, res, mongoclient.addDetail(req.params.id, req.body))
})

/**
 * Delete all details if no query is given, deletes one or more details if a query is given
 */
router.delete('/', (req, res, next) => {
    if (Object.keys(req.query).length === 0) {
        sendResponse(req, res, mongoclient.deleteAllDetails(req.params.id))
    } else {
        sendResponse(req, res, mongoclient.deleteDetail(req.params.id, req.query))
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