/**
 * BeuthBot Databases
 *
 * Contributed by:
 *  - Lukas Danckwerth
 *
 */

// load node.js modules
const util = require('util')

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

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

app.get('/user/:id', function(req, res) {
	res.send('request user' + req.params.id)
	res.end()
})

app.post('/user/:id', function(req, res) {
	res.send('post request user' + req.params.id)
	res.send('post request body' + req.body)
	res.end()
})

app.del('/user/:id', function(req, res) {
	res.send('del request user' + req.params.id)
	res.send('del request body' + req.body)
	res.end()
})

// start running the express application listening on port 3000
app.listen(3000, function() {
	console.log('Database listening on port 3000!')
})
