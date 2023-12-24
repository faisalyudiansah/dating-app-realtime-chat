# dating-app-realtime-chat
Datinger (Dating app) - Realtime Chat with Express, React, Socket.IO, Sequelize, and Tailwind CSS

# API Documentation : Dating-App (Datinger)

## Endpoints :

List of available endpoints :
- `POST /register`
- `POST /login`
- `GET /users`
- `GET /users/profile`
- `PUT /users`
- `DELETE /users`
- `POST /users/like/:idUser`
- `POST /users/dislike/:idUser`
- `GET /users/matches`

## POST /register
Description:
- Register a user.
- Default value :
    - subcription : false
    - remainingLikes : 10
    - show : false

Request:
- body:
```json
{
  "username": "string (required)",
  "email": "string (required)",
  "password": "string (required)",
  "gender": "string male/female (required)",
  "interest": "string male/female (required)"
}
```

_Response (201 - Created)_
```json
{
    "id": "integer",
    "username": "string",
    "email": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Username already exists"
}
OR
{
  "message": "Username is required"
}
OR
{
  "message": "Email already exists"
}
OR
{
  "message": "Email Is required"
}
OR
{
  "message": "Email format is wrong"
}
OR
{
  "message": "Password is required"
}
OR
{
  "message": "The minimum password length is 5 characters"
}
OR
{
  "message": "Gender is required"
}
OR
{
  "message": "Invalid gender. Choose either male or female"
}
OR
{
  "message": "Interest is required"
}
OR
{
  "message": "Invalid interest. Choose either male or female"
}
```

&nbsp;

## POST /login
Description:
- login account user with email and password

Request:
- body:
```json
{
    "email": "string (required)",
    "password": "string (required)",
}
```

_Response (200 - OK)_
```json
{
    "access_token": "string",
    "username": "string",
}
```

_Response (400 - Bad Request)_
```json
{
  "message": "Email is required"
}
OR
{
  "message": "Password is required"
}
```

_Response (401 - Unauthorized)_
```json
{
  "message": "Invalid email or password!"
}
```

&nbsp;

## GET /users
Description:
- get all users who are looking for a matching with the condition: "show" true and depends on the "interest" of the account being logged in

Request:
- headers: 
```json
{
    "access_token": "string"
}
```

_Response (200 - OK)_
```json
{
  "message": "Successfully Received Data",
  "totalData": 5,
  "data": [
    {
      "id": 2,
      "username": "selena",
      "email": "selena@gmail.com",
      "gender": "female",
      "interest": "male",
      "createdAt": "2023-12-12T19:02:18.100Z",
      "updatedAt": "2023-12-12T19:02:18.100Z",
      "UserProfile": {
        "id": 2,
        "fullname": "Selena Gomez",
        "birthdate": "1985-05-15T00:00:00.000Z",
        "profilePicture": "https://i.pinimg.com/736x/3f/c3/c1/3fc3c113473a2f3354046c45a484bdf9.jpg",
        "address": "456 Oak Avenue, Town",
        "occupation": "Singer",
        "bio": "I'm one of the best singer in the world",
        "UserId": 2,
        "createdAt": "2023-12-12T19:02:18.132Z",
        "updatedAt": "2023-12-12T19:02:18.132Z"
      }
    },
    {
      "id": 4,
      "username": "lisa",
      "email": "lisa@gmail.com",
      "gender": "female",
      "interest": "male",
      "createdAt": "2023-12-12T19:02:20.100Z",
      "updatedAt": "2023-12-12T19:02:20.100Z",
      "UserProfile": {
        "id": 4,
        "fullname": "Lisa Blackpink",
        "birthdate": "1997-10-10T00:00:00.000Z",
        "profilePicture": "https://i.pinimg.com/originals/05/22/e6/0522e66d5a03f7c4a1235054ceab9145.jpg",
        "address": "South Korea",
        "occupation": "Girlband",
        "bio": "I'm a member of Girlband from South Korea",
        "UserId": 4,
        "createdAt": "2023-12-12T19:02:20.132Z",
        "updatedAt": "2023-12-12T19:02:20.132Z"
      }
    },
    ...,
  ]
}
```

_Response (404 - Not Found)_
```json
{
    "message": "Sorry, no users found at this time"
}
```

&nbsp;

## GET /users/profile
Description:
- get user data and user profile data who is currently logged in

Request:
- headers: 
```json
{
    "access_token": "string"
}
```

_Response (200 - OK)_
```json
{
  "id": 20,
  "username": "marcelo",
  "email": "marcelo@gmail.com",
  "subscription": false,
  "remainingLikes": 4,
  "gender": "male",
  "interest": "female",
  "show": false,
  "createdAt": "2023-12-13T04:57:42.152Z",
  "updatedAt": "2023-12-13T05:52:17.599Z",
  "UserProfile": {
    "id": 17,
    "fullname": "",
    "birthdate": "2023-12-13T04:57:42.466Z",
    "profilePicture": "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg",
    "address": "",
    "occupation": "",
    "bio": "",
    "UserId": 20,
    "createdAt": "2023-12-13T04:57:42.467Z",
    "updatedAt": "2023-12-13T04:57:42.467Z"
  }
}
```

_Response (403 - Forbidden)_
```json
{
    "message": "Forbidden Access"
}
```

_Response (404 - Not Found)_
```json
{
    "message": "Error! not found"
}
```

&nbsp;

## PUT /users
Description:
- edit user data and user profile data who is currently logged in

Request:
- headers: 
```json
{
  "access_token": "string"
}
```

- body:
```json
{
  "username": "string",
  "email": "string",
  "gender": "string male/female",
  "interest": "string male/female",
  "show": "boolean",
  "fullname": "string",
  "birthdate": "date",
  "profilePicture": "string",
  "address": "string",
  "occupation": "string",
  "bio": "string"
}
```

_Response (200 - OK)_
```json
{
  "message": "Data user success to update"
}
```

_Response (400 - Bad Request)_
```json
{
  "message": "Username already exists"
}
OR
{
  "message": "Username is required"
}
OR
{
  "message": "Email already exists"
}
OR
{
  "message": "Email Is required"
}
OR
{
  "message": "Email format is wrong"
}
OR
{
  "message": "Gender is required"
}
OR
{
  "message": "Invalid gender. Choose either male or female"
}
OR
{
  "message": "Interest is required"
}
OR
{
  "message": "Invalid interest. Choose either male or female"
}
```

_Response (403 - Forbidden)_
```json
{
    "message": "Forbidden Access"
}
```

_Response (404 - Not Found)_
```json
{
    "message": "Error! not found"
}
```

&nbsp;

## DELETE /users
Description:
- Delete account

Request:
- headers: 
```json
{
    "access_token": "string"
}
```

_Response (200 - OK)_
```json
{
  "message": "Account success to delete"
}
```

_Response (403 - Forbidden)_
```json
{
    "message": "Forbidden Access"
}
```

_Response (404 - Not Found)_
```json
{
    "message": "Error! not found"
}
```

&nbsp;

## POST /users/like/:idUser
Description:
- endpoint for like someone account, for matching partner

Request:
- headers: 
```json
{
    "access_token": "string"
}
```

- params:
```json
{
    "idUser": "integer"
}
```

_Response (200 - OK)_
```json
{
  "message": "Liked user successfully"
}
```

_Response (400 - Bad Request)_
```json
{
  "message": "You already take an action for this user"
}
```

_Response (403 - Forbidden)_
```json
{
    "message": "Free access exhausted. Upgrade to premium for unlimited access"
}
```

_Response (404 - Not Found)_
```json
{
    "message": "Error! not found"
}
```

&nbsp;

## POST /users/dislike/:idUser
Description:
- endpoint for dislike someone account

Request:
- headers: 
```json
{
    "access_token": "string"
}
```

- params:
```json
{
    "idUser": "integer"
}
```

_Response (200 - OK)_
```json
{
  "message": "Disliked user successfully"
}
```

_Response (400 - Bad Request)_
```json
{
  "message": "You already take an action for this user"
}
```

_Response (403 - Forbidden)_
```json
{
    "message": "Free access exhausted. Upgrade to premium for unlimited access"
}
```

_Response (404 - Not Found)_
```json
{
    "message": "Error! not found"
}
```

&nbsp;

## GET /users/matches
Description:
- get a list of users who like back the person who is logged in (match with someone)

Request:
- headers: 
```json
{
    "access_token": "string"
}
```

_Response (200 - OK)_
```json
{
  "message": "Successfully Received Data",
  "data": [
    {
      "id": 2,
      "username": "selena",
      "email": "selena@gmail.com",
      "gender": "female",
      "interest": "male",
      "createdAt": "2023-12-12T19:02:18.100Z",
      "updatedAt": "2023-12-12T19:02:18.100Z",
      "UserProfile": {
        "id": 2,
        "fullname": "Selena Gomez",
        "birthdate": "1985-05-15T00:00:00.000Z",
        "profilePicture": "https://i.pinimg.com/736x/3f/c3/c1/3fc3c113473a2f3354046c45a484bdf9.jpg",
        "address": "456 Oak Avenue, Town",
        "occupation": "Singer",
        "bio": "I'm one of the best singer in the world",
        "UserId": 2,
        "createdAt": "2023-12-12T19:02:18.132Z",
        "updatedAt": "2023-12-12T19:02:18.132Z"
      }
    },
    ...,
  ]
}
```

_Response (404 - Not Found)_
```json
{
    "message": "Sorry, no users found at this time"
}
```

&nbsp;

## Global Error
_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```