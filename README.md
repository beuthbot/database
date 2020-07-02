# database

![Icon](.documentation/Icon100.png "Icon")

> BeuthBot database using MongoDB written in JavaScript

## Feature

The database stores data related to users.

...

## API
### Request all **Users**
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
    "eating_habit" : "vegetarisch",
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
Request a single user with the given id.
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

See also [here](https://github.com/beuthbot/mensa_microservice/graphs/contributors) for a list of contributors

