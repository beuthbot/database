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

/**************************************************
 *****************  handling user  ****************
 **************************************************/

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
 * TODO add checks to filter creations without userData
 * Creates a new user with the data from the incoming message
 * @param message - incoming message
 * @returns user object that was created and stored in the database
 */
async function createUser(message){
    console.debug(`CREATE NEW USER WITH: ${message}`)
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
        newUser.addMessengerID(new MessengerID(message.serviceName,message.serviceUserId))
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

/**************************************************
 **************** handling details ****************
 **************************************************/

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
            // remove old detail before adding the new one, if detail already exists
            let details = removeDetail(userToUpdate.details,detail.detail)
            // add detail
            details.push(newDetail)
            console.log(details)

            const updatedUser = await collection.updateOne({id: parseInt(id)}, {
                $set: {
                    details: details
                }
            })

            return updatedUser
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
 * @param {the detail given by the url query} query
 */
async function deleteDetail(id, query) {
    const client = new MongoClient(uri, { useUnifiedTopology: true })
    // get the detail from the query
    const detail = query[Object.keys(query)]

    if(detail){
        try {
            await client.connect()
            const db = client.db("beuthbot")
            const collection = db.collection('users')

            const userToUpdate = await collection.findOne({ id: parseInt(id) })

            if (userToUpdate) {
                // try to remove detail and give error, when no detail was deleted
                let detailCount = userToUpdate.details.length
                let details = removeDetail(userToUpdate.details,detail)
                if (details.length === detailCount){
                    return {
                        error: `No detail ${detail} found to delete`,
                        success: false
                    }
                }

                const updatedUser = await collection.findOneAndUpdate(
                    { id: parseInt(id) },
                    { $set: { details: details } },
                    { returnOriginal: false }
                )

                return updatedUser
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
    } else {
        return {
            error: `No detail given to delete`,
            success: false
        }
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
            let updatedUser = await collection.updateOne({ id: parseInt(id) }, {
                $set: {
                    details: []
                }
            })

            return updatedUser
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

/**************************************************
 ************* handling user accounts *************
 **************************************************/

/**
 * function to register a new messenger to a given user
 * @param user - the user object
 * @param accountData - should contain the messenger and the used id
 * @returns success: updated user
 *          failure: error object with description and registration status
 */
async function registerAccount(user,accountData){
    const client = new MongoClient(uri, { useUnifiedTopology: true })

    try{
        await client.connect()
        const db = client.db("beuthbot")
        const collection = db.collection('users')
        // check required values
        if(user.id && user.messengerIDs){
            // check registered messengers
            if (!isRegistered(user.messengerIDs,accountData.messenger)){
                // create new messenger object
                let messengerID = new MessengerID(accountData.messenger, accountData.id)
                let updatedMessengerIDs = user.messengerIDs.push(messengerID)
                // add messenger to user
                const updatedUser = await collection.updateOne({id: parseInt(user.id)}, {
                    $set: {
                        messengerIDs: user.messengerIDs
                    }
                })
                // return registered user
                return updatedUser
            } else {
                return {
                    error: `The user with the id ${user.id} has already an registered account from the messenger ${accountData.messenger}`,
                    success: false,
                    registered: true
                }
            }
        } else {
            return {
                error: `Couldn't use the user to register a new account`,
                success: false,
                registered: false
            }
        }
    } catch (exception){
        return {
            error: `Something bad happened while trying to register a new account to the user with the id ${user.id}: ${exception}`,
            success: false,
            registered: false
        }
    } finally {
        client.close()
    }
}

/**
 * function to merge user with the same messenger accounts into one user
 * @param user - user that will used as merge-target
 * @param accountData - account data to identify the other user
 * @returns single user that includes the complete data of merged users
 */
async function mergeUsers(user, accountData){
    const client = new MongoClient(uri, { useUnifiedTopology: true })

    try{
        await client.connect()
        const db = client.db("beuthbot")
        const collection = db.collection('users')

        if(user.id && accountData.messenger && accountData.messengerIDs){
            // search all accounts related to the given data
            let foundUsers = await searchAccounts(accountData)
            // check if user array was returned successfully
            if(Array.isArray(foundUsers)){
                // set data from given user as starting point
                let mergedNickname = user.nickname
                let mergedFirstName = user.firstName
                let mergedLastName = user.lastName
                let mergedMessengerIDs = user.messengerIDs
                let mergedDetails = user.details
                // fill usable data from found users to the given data
                foundUsers.forEach(function(foundUser){
                    // set identifiers only if not set before
                    if(!mergedNickname && foundUser.nickname){
                        mergedNickname = foundUser.nickname
                    }
                    if(!mergedFirstName && foundUser.firstName){
                        mergedFirstName = foundUser.firstName
                    }
                    if(!mergedLastName && foundUser.lastName){
                        mergedLastName = foundUser.lastName
                    }
                    // search and append only new details
                    mergedDetails = mergeDetails(mergedDetails,foundUser.details)
                    // search and append new messenger connections???
                    mergedMessengerIDs = mergeMessengerIDs(mergedMessengerIDs, foundUser.messengerIDs)
                })
                // update merged user in the database
                let mergedUser = await collection.updateOne({id: parseInt(user.id)}, {
                    $set: {
                        nickname: mergedNickname,
                        firstName: mergedFirstName,
                        lastName: mergedLastName,
                        messengerIDs: mergedMessengerIDs,
                        details: mergedDetails
                    }
                })
                // return updated user
                return mergedUser
            } else {
                return {
                    error: `Couldn't find any users to merge with`,
                    success: false
                }
            }
        } else {
            return {
                error: `Couldn't use the user or accountData to merge accounts`,
                success: false
            }
        }
    } catch (exception){
        return {
            error: `Something bad happened while trying to merge accounts for the user with the id ${user.id}: ${exception}`,
            success: false
        }
    } finally {
        client.close()
    }
}


/**
 * Collects all users that contain the given accountData
 * @param accountData - data used to filter the user database
 * @returns array of user
 */
async function searchAccounts(accountData){
    const client = new MongoClient(uri, { useUnifiedTopology: true })

    try{
        await client.connect()
        const db = client.db("beuthbot")
        const collection = db.collection('users')

        if(accountData){
            // using the id as solo identifier //TODO maybe change to messenger and id is safer
            let userList = await collection.find({
                "messengerIDs.id": accountData.id
            }).toArray()

            return userList
        } else {
            return {
                error: `Couldn't use the accountData to search for accounts`,
                success: false
            }
        }
    } catch (exception){
        return {
            error: `Something bad happened while trying to search accounts for the user merge: ${exception}`,
            success: false
        }
    } finally {
        client.close()
    }
}

/**
 * function to delete a given messenger account from a given user
 * @param user - user to delete the given messenger account from
 * @param messenger - the messenger, that needs to be removed
 * @returns updated user
 */
async function deleteAccount(user,messenger){
    const client = new MongoClient(uri, { useUnifiedTopology: true })

    try{
        await client.connect()
        const db = client.db("beuthbot")
        const collection = db.collection('users')
        // check required values
        if(user && user.id && user.messengerIDs){
            // check registered messengers
            if (isRegistered(user.messengerIDs,messenger)){
                console.log(user.messengerIDs)
                // remove account
                let updatedMessengerIDs = removeMessenger(user.messengerIDs,messenger)
                // update user
                console.log(user.updatedMessengerIDs)
                const updatedUser = await collection.updateOne({id: parseInt(user.id)}, {
                    $set: {
                        messengerIDs: updatedMessengerIDs
                    }
                })
                // return updated user
                return updatedUser
            } else {
                return {
                    error: `The user with the id ${user.id} hasn't registered an account from the messenger ${messenger}`,
                    success: false,
                    unregistered: true
                }
            }
        } else {
            return {
                error: `Couldn't use the user to register a new account`,
                success: false
            }
        }
    } catch (exception){
        return {
            error: `Something bad happened while trying to delete a existing account from the user with the id ${user.id}: ${exception}`,
            success: false
        }
    } finally {
        client.close()
    }
}

/**
 * saves a new register-code for a given user with a given timestamp to the register collection
 * @param id
 * @param code
 * @returns
 */
async function addRegisterCode(id,code,time){
    const client = new MongoClient(uri, { useUnifiedTopology: true })

    try{
        await client.connect()
        const db = client.db("beuthbot")
        const collection = db.collection('register')

        if(id){
            if(code){
                // check if code is already used
                let registerObject = await collection.findOne({code: parseInt(code)})
                // delete existing register object with the same code, if it expired (>15min)
                if(registerObject){
                    let timeDifference = time - registerObject.time
                    // check if code is still active, if not just delete the old entry
                    if (timeDifference > 900000 || registerObject.userid.normalize() === id.normalize()) {
                        // use deleteMany to make sure, that no duplicate codes exist in the collection
                        await collection.deleteMany({code: parseInt(code)})
                    } // if id ist different and the code is still active, we have to reject the registration-process
                    else {
                        return {
                            error: `code given is already used as registration code and still active`,
                            success: false,
                            retry: true
                        }
                    }
                }
                let newRegisterCodeObject = await collection.insertOne({
                    userid: id,
                    code: parseInt(code),
                    time: time
                })

                return newRegisterCodeObject
            } else {
                return {
                    error: `no code given to add as registration code`,
                    success: false
                }
            }
        } else {
            return {
                error: `no user-id given to add a registration code`,
                success: false
            }
        }
    } catch (exception){
        return {
            error: `Something bad happened while trying to add as registration code for the user with the id ${id}: ${exception}`,
            success: false
        }
    } finally {
        client.close()
    }
}

/**
 *
 * @param code
 * @returns
 */
async function getRegisterUser(code){
    const client = new MongoClient(uri, { useUnifiedTopology: true })

    try{
        await client.connect()
        const db = client.db("beuthbot")
        const collection = db.collection('register')

        if(code){
            let registerObject = await collection.findOne({code: parseInt(code)})

            if(!registerObject){
                return {
                    error: `no code found`,
                    success: false
                }
            }

            return registerObject
        } else {
            return {
                error: `no code given to get a user for registration`,
                success: false
            }
        }
    } catch (exception){
        return {
            error: `Something bad happened while trying to add as registration code for the user with the id ${id}: ${exception}`,
            success: false
        }
    } finally {
        client.close()
    }
}

/**************************************************
 **************** helper functions ****************
 **************************************************/

/**
 *
 * @param currentDetails
 * @param newDetails
 */
function mergeDetails(currentDetails,newDetails){
    let mergedDetails = currentDetails
    newDetails.forEach(function(detail){
        // search detail in array
        let isDetailFound = false
        mergedDetails.forEach(function(mergedDetail){
            if (mergedDetail.detail.normalize() === detail.detail.normalize()){
                isDetailFound = true
            }
        })
        // append to merged array, if detail is new
        if(!isDetailFound){
            mergedDetails.push(detail)
        }
    })

    return mergedDetails
}

/**
 *
 * @param currentMessengerIDs
 * @param newMessengerIDs
 */
function mergeMessengerIDs(currentMessengerIDs,newMessengerIDs){
    let mergedMessengerIDs = currentMessengerIDs
    newMessengerIDs.forEach(function(messengerID){
        let isMessengerIDFound = false
        mergedMessengerIDs.forEach(function(mergedMessengerID){
            if (mergedMessengerID.messenger.normalize() === messengerID.messenger.normalize()){
                isMessengerIDFound = true
            }
        })
        if(!isMessengerIDFound){
            mergedMessengerIDs.push(messengerID)
        }
    })
}

/**
 * helper function to remover a messenger account from a given account array
 * @param messengerIDs - array of messenger accounts
 * @param messenger - messenger, that needs to be deleted
 * @returns messenger array without the removed messenger account
 */
function removeMessenger(messengerIDs, messenger){
    let updatedMessengerIDs = messengerIDs

    return updatedMessengerIDs.filter(function(messengerID){
        // filter out the messenger
        if (messengerID.messenger.normalize() === messenger.normalize()){
            return null
        }
        return messengerID
    })
}

function removeDetail(details,detail){
    let updatedDetails = details

    console.log(updatedDetails)

    return updatedDetails.filter(function(currentDetail){
        // filter out the messenger
        if (currentDetail.detail.normalize() === detail.normalize()){
            return null
        }
        return currentDetail
    })
}


/**
 * checks if a messenger is already registered
 * @param messengerIDs - array of registered messengers
 * @param messenger - the messenger to check
 * @returns {boolean}
 */
function isRegistered(messengerIDs,messenger){
    let registered = false
    // filter, if messenger is registered
    messengerIDs.forEach(function (messengerID){
        if(messengerID.messenger.normalize() === messenger.normalize()){
            registered = true
        }
    })
    return registered
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
    deleteAllDetails: deleteAllDetails,
    registerAccount: registerAccount,
    deleteAccount: deleteAccount,
    mergeUsers: mergeUsers,
    addRegisterCode: addRegisterCode,
    getRegisterUser: getRegisterUser
} 