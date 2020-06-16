require('dotenv').config()

const { MongoClient } = require('mongodb');
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

/**
 * gets the user with the given telegram id from the database
 * @param {the telegram_id which will be given via rest request on this backend} id 
 */
async function getUser(id) {
    const client = new MongoClient(uri)

    try {
        await client.connect()
        const db = client.db("beuthbot")
        const user = db.collection('users').findOne({id: id})

        return user
    } catch (exception) {
        console.error(`Something bad happend right here: ${exception}`)
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
    const newUser = {
        id: id,
        name: user.name
    }

    try {
        await client.connect()
        const db = client.db("beuthbot")
        const collection = db.collection('users')

        const userToCreate = await collection.findOne({id: id})
        
        if (!userToCreate) {
            return collection.insertOne(newUser)
        } else {
            return `User with id ${id} does already exist!`
        }
        
    } catch (exception) {
        console.error(`Something bad happend right here: ${exception}`)
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

module.exports = {
    getUser: getUser,
    createUser: createUser,
    createCollection: createCollection,
    connect: connect,
    getCollectionNames: getCollectionNames
} 