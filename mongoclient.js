require('dotenv').config()
const { MongoClient } = require('mongodb');
const User = require('./models/users').User;
const MessengerID = require('./models/messengerID').MessengerID;
const { Details } = require('./models/details');
const uri = process.env.MONGO_URI;
const util = require('util')

/**
 * Connect to the database with the name beuthbot
 */
async function connect() {
    const client = new MongoClient(uri)
    try {
        await client.connect()
        const db = await client.db("beuthbot")
        console.log(`Connected to database ${db.databaseName}`)
    } catch (exception) {
        console.error(`Something bad happend right here: ${exception}`)
    } finally {
        client.close()
    }
}

async function getUsersCount() {
    const client = new MongoClient(uri, { useUnifiedTopology: true })

    try {
        await client.connect()
        const db = await client.db("beuthbot")
        const collection = db.collection("users")
        const userCount = await collection.countDocuments()

        return userCount
    } catch (exception) {
        return {
            error: `Something bad happened while trying to receive the amout of users: ${exception}`
        }
    } finally {
        client.close()
    }
}

async function getAllUsers() {
    const client = new MongoClient(uri, { useUnifiedTopology: true })

    try {
        await client.connect()
        const db = client.db("beuthbot")
        const collection = db.collection("users")
        const users = await collection.find().toArray()

        return users
    } catch (exception) {
        return {
            error: `Something bad happened while trying to get all Users: ${exception}`
        }
    } finally {
        client.close()
    }
}

/**
 * gets the user with the given id from the database
 * @param {the which will be given via rest request on this backend} id
 */
async function getUser(id) {
    const client = new MongoClient(uri, { useUnifiedTopology: true })

    try {
        await client.connect()
        const db = client.db("beuthbot")
        const user = await db.collection('users').findOne({ id: parseInt(id) })

        return user
    } catch (exception) {
        return {
            error: `Something bad happened while trying to get the User with the id ${id}: ${exception}`
        }
    } finally {
        client.close()
    }
}

/**
 * finds the user with the given messenger and (messenger-)id from the database
 * @param messenger
 * @param id
 * @returns found User from database or null if no user was found
 */
async function findUser(messenger, id) {
    const client = new MongoClient(uri, { useUnifiedTopology: true })

    try {
        // connect to database
        await client.connect()
        const db = client.db("beuthbot")
        const collection = db.collection('users')
        // create messengerID object for search
        const findObj = new MessengerID(messenger, id)
        // try to find user with given data
        const userCandidate = await collection.findOne({ messengerIDs: findObj })
        //console.debug('SEARCH RESULT: ' + userCandidate)
        return userCandidate
    } catch (exception) {
        return {
            error: `Something bad happened while trying to find the User with the messenger: ${messenger} and messenger-id ${id}: ${exception}`
        }
    } finally {
        client.close()
    }
}

/**
 * Creates a new user with the data from the incoming message
 * @param message - incoming message
 * @returns user object that was created and stored in the database
 */
async function createUser(message){
    //console.debug(`CREATE NEW USER WITH: ${message}`)
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try{
        // connect to database
        await client.connect()
        const db = client.db("beuthbot")
        const collection = db.collection('users')
        // get data for the new user
        const userCount = await this.getUsersCount()
        // define new user, add messenger
        let newUser = new User(userCount + 1, message.nickname, message.firstName, message.lastName)
        newUser.addMessengerID(new MessengerID(message.messenger,message.id))
        // create new user in db
        let createdUser = await collection.insertOne(newUser)
        //console.debug("createdUser:\n" + util.inspect(createdUser, false, null, true) + "\n\n")
        return createdUser

    } catch (exception) {
        return {
            error: `Something bad happened while trying to create User from the message ${message}: ${exception}`
        }
    } finally {
        client.close();
    }
}

/**
 * Deletes the user which has the given id
 * @param {id of the user} id 
 */
async function deleteUser(id) {
    const client = new MongoClient(uri, { useUnifiedTopology: true })

    try {
        await client.connect()
        const db = client.db("beuthbot")
        const collection = db.collection('users')

        let deleted = await collection.deleteOne({ id: parseInt(id) })

        return deleted
    } catch (exception) {
        return {
            error: `Something bad happened while trying to delete the User with the id ${id}: ${exception}`,
            success: false
        }
    } finally {
        client.close()
    }
}

//TODO change this or delete it - not working / faking its working
async function deleteAllUsers() {
    const client = new MongoClient(uri, { useUnifiedTopology: true })

    try {
        await client.connect()
        const db = client.db("beuthbot")
        const collection = db.collection('users')

        collection.deleteMany({})

        return {
            error: null,
            success: true
        }
    } catch (exception) {
        return {
            error: `Something bad happened while trying to delete all Users: ${exception}`,
            success: false
        }
    } finally {
        client.close()
    }
}

/**
 * Creates a Collection if the given name does not exist
 * @param {The name of the collection to create} collectionName 
 * @returns A String if the operation was successful or not
 */
async function createCollection(collectionName) {
    const client = new MongoClient(uri, { useUnifiedTopology: true })
    try {
        await client.connect()
        const db = client.db("beuthbot")
        const collectionNames = await getCollectionNames()

        if (collectionNames.includes(collectionName)) return `collection ${collectionName} does already exist!`
        db.createCollection(collectionName)
        return `collection ${collectionName} was created!`
    } catch (exception) {
        console.error(`Something bad happend right here: ${exception}`)
    } finally {
        client.close()
    }
}

/**
 * Gets the name of every collection and returns it as an array
 */
async function getCollectionNames() {
    const client = new MongoClient(uri, { useUnifiedTopology: true })
    const collectionNames = []
    try {
        await client.connect()
        const db = client.db("beuthbot")

        const collections = await db.collections()
        collections.forEach(c => {
            collectionNames.push(c.collectionName)
        })
        return collectionNames

    } catch (exception) {
        console.error(`Something bad happend right here: ${exception}`)
    } finally {
        client.close()
    }
}

async function getDetailsFromUser(id) {
    const user = await getUser(id)

    if (user.details) {
        return user['details']
    } else {
        return {
            error: `User with id ${id} has no saved details`
        }
    }
}

/**
 * Adds/Changes a detail to/from the user document
 * @param {the id of the user of which the detail should be added/changed} id 
 * @param {the detail object from the req.body containing a key value pair for the details} detail 
 */
async function addDetail(id, detail) {
    const client = new MongoClient(uri, { useUnifiedTopology: true })
    const newDetail = new Details(detail.detail, detail.value)

    try {
        await client.connect()
        const db = client.db("beuthbot")
        const collection = db.collection('users')

        const userToUpdate = await collection.findOne({ id: parseInt(id) })

        if (userToUpdate) {
            if (typeof userToUpdate['details'] === 'undefined') {
                userToUpdate['details'] = {}
            }
            userToUpdate['details'][newDetail['detail']] = newDetail['value']
            collection.updateOne({id: parseInt(id)}, {
                $set: {
                    details: userToUpdate['details']
                }
            })
            return newDetail
        } else {
            return {
                error: `Something bad happened while trying to add/change the detail of the user with the id ${id}`
            }
        }
    } catch (exception) {
        return {
            error: `Something bad happened while trying to add/change the detail of the user with the id ${id}: ${exception}`
        }
    } finally {
        client.close()
    }
}

/**
 * Finds the user and checks if that specific user exists. If it does exist, the details will be deleted via update function from mongodb.
 * If the details subdocument is empty afterwards, the subdocument will be deleted to clean up the users document
 * @param {the id of the user of which the detals should be deleted} id 
 * @param {the detail given by the url query} detail 
 */
async function deleteDetail(id, detail) {
    const client = new MongoClient(uri, { useUnifiedTopology: true })
    const detailKeys = Object.keys(detail)
    const fieldKey = detailKeys.map((item) => `details.${detail[item]}`)

    try {
        await client.connect()
        const db = client.db("beuthbot")
        const collection = db.collection('users')

        const userToUpdate = await collection.findOne({ id: parseInt(id) })

        if (userToUpdate) {


            const updatedUser = collection.findOneAndUpdate(
                { id: parseInt(id) },
                { $unset: { [fieldKey[0]]: 1 } },
                { returnOriginal: false }
            )

            const userDetailsKeys = Object.keys((await updatedUser).value.details)
            console.log(userDetailsKeys);
            
            if (userDetailsKeys.length === 0) deleteAllDetails(id)

            return {
                error: null,
                success: true
            }
        } else {
            return {
                error: `User with id: ${id} does not exist!`,
                success: false
            }
        }
    } catch (exception) {
        return {
            error: `Something bad happened while trying to delete one Detail from the user with the id ${id}: ${exception}`,
            success: false
        }
    } finally {
        client.close()
    }
}

/**
 * Deletes the details submodule from a specific user
 * @param {the id of the user of which the details should be deleted} id 
 */
async function deleteAllDetails(id) {
    const client = new MongoClient(uri, { useUnifiedTopology: true })

    try {
        await client.connect()
        const db = client.db("beuthbot")
        const collection = db.collection('users')

        const userToUpdate = await collection.findOne({ id: parseInt(id) })

        if (userToUpdate) {
            collection.updateOne({ id: parseInt(id) }, {
                $unset: {
                    details: 1
                }
            })
            return {
                error: null,
                success: true
            }
        } else {
            return {
                error: `Something bad happened while trying to delete all Details from user with id ${id}`,
                success: false
            }
        }
    } catch (exception) {
        return {
            error: `Something bad happened while trying to delete all Details from the user with the id ${id}: ${exception}`,
            success: false
        }
    } finally {
        client.close()
    }
}

module.exports = {
    getUser: getUser,
    findUser: findUser,
    getAllUsers: getAllUsers,
    getUsersCount: getUsersCount,
    createUser: createUser,
    createCollection: createCollection,
    connect: connect,
    getCollectionNames: getCollectionNames,
    deleteUser: deleteUser,
    deleteAllUsers: deleteAllUsers,
    getDetailsFromUser: getDetailsFromUser,
    addDetail: addDetail,
    deleteDetail: deleteDetail,
    deleteAllDetails: deleteAllDetails
} 