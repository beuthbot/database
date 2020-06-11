# database

> BeuthBot database using MongoDB written in JavaScript

## Feature

...

## API

### Request **User**

```http
GET http://localhost:27000/user/<id>
```

#### Reponse

```json
{
  "error": null,          // Optional error message.
  "id": 12345678,
  "nickname": "Alan",
  "details" : {
    "eating_habit" : "vegetarisch",
    "city" : "Berlin",
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
  "detail": "eating_habit"
  "value": "vegetarisch"
}
```

#### Reponse

```json
{
  "error": null,          // Optional error message.
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
  "error": null,          // Optional error message.
  "success": true
}
```

