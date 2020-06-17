const express = require('express');
const router = express.Router();
const mongoclient = require('./../mongoclient.js');

router.get('/:id', (req, res) => {
    mongoclient.getUser(req.params.id)
        .then(response => {
            if (response) {
                res.send(response)
            } else {
                res.send(`User with id ${req.params.id} does not exist`)
            }
        })
        .then(() => res.end())
        .catch(err => console.error(err))
})

router.post('/:id', (req, res) => {
    mongoclient.createUser(req.params.id, req.body)
        .then(response => {
            if (response) {
                res.send(response)
            } else {
                res.send(`User with id ${id} could not be created`)
            }
        })
        .then(() => res.end())
        .catch(err => console.error(err))
})

router.delete('/:id', (req, res) => {
    mongoclient.deleteUser(req.params.id)
        .then(response => {
            if (response) {
                res.send(response)
            } else {
                res.send(`User with ${id} could not be deleted`)
            }
        })
        .then(() => res.end())
        .catch(err => console.error(err))
})

module.exports = router;
