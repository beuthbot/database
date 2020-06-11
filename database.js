/**
 * BeuthBot Databases
 *
 * Contributed by:
 *  - Lukas Danckwerth
 *
 */

// load node.js modules
const util = require('util')

// use express app for hadling incoming requests
const express = require('express')

// use body parser to for application/json contents foor express
const bodyParser = require('body-parser')

// create express application
const app = express()

// for parsing application/json
app.use(bodyParser.json())

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function(req, res) {
	res.send('Hello from BeuthBot Database')
	res.end()
})

app.post('/', function(req, res) {

})

// start running the express application listening on port 3000
app.listen(3000, function() {
	console.log('Database listening on port 3000!')
})
