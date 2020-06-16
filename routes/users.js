const express = require('express');
const router = express.Router();
const mongoclient = require('./../mongoclient.js');

router.get('/:id', function (req, res) {
    const mongoresponse = mongoclient.getUser(req.params.id)

    mongoresponse.then(response => {
        if (response) {
            res.send(response)
        } else {
            res.send(`User with id ${req.params.id} does not exist`)
        }
        res.end()
    })
})

router.post('/:id', function (req, res) {
    const mongoresponse = mongoclient.createUser(req.params.id, req.body)
    
    mongoresponse.then(response => {
        if (response) {
            res.send(response)
        } else {
            res.send(`User with id ${id} could not be created`)
        }
    })
})

router.delete('/:id', function (req, res) {
    res.send('del request user' + req.params.id)
    res.send('del request body' + req.body)
    res.end()
})

module.exports = router;
