/**
 * BeuthBot Databases
 *
 * Contributed by:
 *  - Lukas Danckwerth
 *	- Tobias Belkner
 */

// load node.js modules
const util = require('util')
const createError = require('http-errors');

// required for process.env to work
require('dotenv').config()

// use express app for hadling incoming requests
const express = require('express')

// use body parser to for application/json contents foor express
const bodyParser = require('body-parser')

// create express application
const app = express()

//routes
const usersRouter = require('./routes/users')

// initialize db
const mongoclient = require('./mongoclient')
mongoclient.connect()

// creates a users collection
mongoclient.createCollection('users').then(res => {
	console.log(res)
})

// for parsing application/json
app.use(bodyParser.json())

app.use('/users', usersRouter)

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404))
})

app.get('/', function(req, res) {
	res.send('Hello from BeuthBot Database')
	res.end()
})



// start running the express application listening on port 3000
app.listen(3000, function() {
	console.log('Database listening on port 3000!')
})
