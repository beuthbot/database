# database

![Icon](.documentation/Icon100.png "Icon")

> BeuthBot database using MongoDB written in JavaScript

## Feature

The database stores data related to users.

...

## API

### Request **User**

```http
GET http://localhost:27000/user/<id>
```

#### Reponse

```json
{
  "error": null,          # Optional error message.
  "id": 12345678,
  "nickname": "Alan",
  "details" : {
    "eating_habit" : "vegetarisch",
    "city" : "Berlin"
  }
}
```

### Add / Change **Detail**

```http
POST http://localhost:27000/user/<id>/detail
```

#### Request Body

```json
{
  "detail": "eating_habit",
  "value": "vegetarisch"
}
```

#### Reponse

```json
{
  "error": null,          # Optional error message.
  "success": true
}
```

###  Delete **Detail**

```http
DELETE http://localhost:27000/user/<id>/detail
```

#### Reponse

```json
{
  "error": null,          # Optional error message.
  "success": true
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

