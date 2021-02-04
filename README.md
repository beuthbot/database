# database

![Icon](.documentation/Icon100.png "Icon")

> BeuthBot database using MongoDB written in JavaScript

## Feature

The database stores data related to users. 
Currently the database can store a list of different messenger identifications and given details about the user, that will enhance the result of the messages.

...

## Model

### User

| Property    | Type         | About                                 | Note        |
| ----------  | ------------ | ------------------------------------- | ------------------ |
| _id         | String       | The id given by MongoDB.              |  |
| id          | Integer      | The database id of the BeuthBot user. |  |
| nickname    | String       | A possible nickname of the user.      | Optional |
| firstName   | String       | A possible first name of the user.    | Optional |
| lastName    | String       | A possible last name of the user.     | Optional |
| details     | [Object: Any] | A dictionary of details.              | Optional |
| messengerIDs| [Object: Any] | A dictionary of messengers.           | Optional |

####details

| Property    | Type        | About                                 | Note        |
| ----------  | ----------- | ------------------------------------- | ------------------ |
| detail      | String      | The name of the detail                |  |
| value       | String      | The value of the detail               |  |

####messengerIDs

| Property    | Type        | About                                 | Note        |
| ----------  | ----------- | ------------------------------------- | ------------------ |
| id          | String      | The id of the user in the messenger   |  |
| messenger   | String      | The name of the messenger             |  |


## API

The API currently has four endpoints which are listed below.

| Enpoint               | About                                                        |
| --------------------- | ------------------------------------------------------------ |
| `/find`               | Core functionality for the beuthbot - Let the database find a user base on a given message.        |
| `/users`              | Request or delete all users in the database.                 |
| `/users/<id>`         | Request, create or delete a single user in the database.     |
| `/users/<id>/details` | Request, create or delete a detail of a user in the database. |


- Request all Users

### Request all Users

Requests all Users in the collection
```http
GET http://localhost:27000/users
```

#### Response
```json
{...},
{
  "id": 12345678,
  "nickname": "Alan",
  "details" : {
    "meal-preference" : "vegetarisch",
    "city" : "Berlin"
  }
},
{...}
```

#### Error
```json
{
  "error": ...
}
```


### Request **User**

```http
GET http://localhost:27000/users/<id>
```

#### Reponse
Request a single user with the given beuthbot-id.
```json
{
  "id": 12345678,
  "nickname": "Alan",
  "details" : {
    "eating_habit" : "vegetarisch",
    "city" : "Berlin"
  }
}
```

#### Error

```json
{
  "error": ...
}
```


### Get Details

Get the Details of a User

```http
GET http://localhost:27000/users/<id>/detail
```

#### Response

```json
{
  "city": "Berlin"
}
```

### Add / Change **Detail**
Add/Change a Detaile to/from the User with the given id.
```http
POST http://localhost:27000/users/<id>/detail
```

#### Request Body

```json
{
  "detail": "eating_habit",
  "value": "vegetarisch"
}
```

#### Reponse
If the operation was successful the error will be set to null and the success will be set to true. If the operation failed an error message will be set and the success will be set to false.
```json
{
  "error": null,
  "success": true | false
}
```
###  Delete all **Details**
Deletes all Details from the User with the given id
```http
DELETE http://localhost:27000/user/<id>/detail?q=<value>
```
#### Reponse
If the operation was successful the error will be set to null and the success will be set to true. If the operation failed an error message will be set and the success will be set to false.
```json
{
  "error": null,
  "success": true | false
}
```
###  Delete **Detail**
Deletes one Detail from the User with the given id.
```http
DELETE http://localhost:27000/user/<id>/detail?q=<value>
```

#### Reponse
If the operation was successful the error will be set to null and the success will be set to true. If the operation failed an error message will be set and the success will be set to false.
```json
{
  "error": null,
  "success": true | false
}
```

## Build With


- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [axios](https://github.com/axios/axios)

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/beuthbot/deconcentrator-js/releases)

## Authors

* Lukas Danckwerth - Initial work - [GitHub](https://github.com/lukasdanckwerth)
* Tobias Belkner - [GitHub](https://github.com/lukasdanckwerth)
* Lukas Danke - 

See also [here](https://github.com/beuthbot/mensa_microservice/graphs/contributors) for a list of contributors.
