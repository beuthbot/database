require('dotenv').config()
const { MongoClient } = require('mongodb');
const User = require('./models/users').User;
const { Details } = require('./models/details');
const uri = process.env.MONGO_URI;

/**
 * Connect to the database with the name beuthbot
 */
async function connect() {
    const client = new MongoClient(uri)
    try {
        await client.connect()
        const db = client.db("beuthbot")
        console.log(`Connected to database ${db.databaseName}`)
    } catch (exception) {
        console.error(`Something bad happend right here: ${exception}`)
    } finally {
        client.close()
    }
}

async function getAllUsers() {
    const client = new MongoClient(uri)

    try {
        await client.connect()
        const db = client.db("beuthbot")
        const collection = db.collection("users")
        const users = collection.find().toArray()

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
 * gets the user with the given telegram id from the database
 * @param {the telegram_id which will be given via rest request on this backend} id 
 */
async function getUser(id) {
    const client = new MongoClient(uri)

    try {
        await client.connect()
        const db = client.db("beuthbot")
        const user = db.collection('users').findOne({ id: parseInt(id) })

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
 * creates a user with the given id
 * @param {the telegram_id which will be given via rest request on this backend, provided by the telegram api} id 
 * @param {the user object} user 
 */
async function createUser(id, user) {
    const client = new MongoClient(uri)

    const newUser = new User(id, user.name, {})

    try {
        await client.connect()
        const db = client.db("beuthbot")
        const collection = db.collection('users')

        const userToCreate = await collection.findOne({ id: parseInt(id) })

        if (!userToCreate) {
            collection.insertOne(newUser)
            return newUser
        } else {
            return {
                error: `User with id ${id} does already exist!`
            }
        }

    } catch (exception) {
        return {
            error: `Something bad happened while trying to create User with the id ${id}: ${exception}`
        }
    } finally {
        client.close()
    }
}

/**
 * Deletes the user which has the given id
 * @param {id of the user} id 
 */
async function deleteUser(id) {
    const client = new MongoClient(uri)

    try {
        await client.connect()
        const db = client.db("beuthbot")
        const collection = db.collection('users')

        collection.deleteOne({ id: parseInt(id) })

        return {
            error: null,
            success: true
        }
    } catch (exception) {
        return {
            error: `Something bad happened while trying to delete the User with the id ${id}: ${exception}`,
            success: false
        }
    } finally {
        client.close()
    }
}

async function deleteAllUsers() {
    const client = new MongoClient(uri)

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
    const client = new MongoClient(uri)
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
    const client = new MongoClient(uri)
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

/**
 * 
 * @param {the id of the user of which the detail should be added/changed} id 
 * @param {the detail object from the req.body containing a key value pair for the details} detail 
 */
async function addDetail(id, detail) {
    const client = new MongoClient(uri)
    const newDetail = new Details(detail.detail, detail.value)

    try {
        await client.connect()
        const db = client.db("beuthbot")
        const collection = db.collection('users')

        const userToUpdate = await collection.findOne({ id: parseInt(id) })

        if (userToUpdate) {
            userToUpdate['details'][newDetail['detail']] = newDetail['value']
            collection.updateOne({}, {
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

async function deleteDetail(id, detail) {
    // TODO: implement the delete operation with mongodb
}

async function deleteAllDetails(id, detail) {
    // TODO: implement the delete operation with mongodb
}

module.exports = {
    getUser: getUser,
    getAllUsers: getAllUsers,
    createUser: createUser,
    createCollection: createCollection,
    connect: connect,
    getCollectionNames: getCollectionNames,
    deleteUser: deleteUser,
    deleteAllUsers: deleteAllUsers,
    addDetail: addDetail,
    deleteDetail: deleteDetail,
    deleteAllDetails: deleteAllDetails
} 