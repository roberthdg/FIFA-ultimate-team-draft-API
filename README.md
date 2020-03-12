# FUTdraft API

## General info
RESTful API for the FIFA Ultimate Team Draft web application.
	
## Technologies
Project created with:
* NodeJS
* Express.js
* MongoDB Atlas
	
## Endpoints

The REST API endpoints to the FUT Draft app are described below.

### Get draft of 5 players per position (append array of previously drafted players)

### Request 

`post /draft/`

    curl -i -H 'Content-Type: application/json' --request POST -d '{"potision":"ST","role":"attack","draftedPlayers": []}' http://localhost:3030/draft/

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2020 12:36:30 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json

    [{
        "_id": "5e611fb30d5ed40cf434d7d0",
        "role": "attack",
        "position": "ST",
        "nation": "Norway",
        "league": "Bundesliga",
        "club": "Borussia Dortmund",
        "rating": 90,
        "cardImage": "1583423411419haland.png",
        "__v": 0
    },
    {
        "_id": "5e60478aaa50c43474195328",
        "role": "attack",
        "position": "RW",
        "nation": "Brazil",
        "league": "Premier League",
        "club": "Chelsea",
        "rating": 86,
        "cardImage": "1583368074098willian.png",
        "__v": 0
    },
    {
        "_id": "5e605a3511644e39b0487fec",
        "role": "attack",
        "position": "ST",
        "nation": "England",
        "league": "Premier League",
        "club": "Leicester City",
        "rating": 87,
        "cardImage": "1583372853718vardy.png",
        "__v": 0
    },
    {
        "_id": "5e6004fcbde6cc2cc03e4225",
        "role": "attack",
        "position": "LW",
        "nation": "France",
        "league": "La Liga",
        "club": "Barcelona",
        "rating": 90,
        "cardImage": "1583351036594griezmann.png",
        "__v": 0
    },
    {
        "_id": "5e61cdecc96a973b28015efb",
        "role": "attack",
        "position": "RW",
        "nation": "Argentina",
        "league": "La Liga",
        "club": "Barcelona",
        "rating": 96,
        "cardImage": "1583468012352messi.png",
        "__v": 0
    }]

### Search a squad by ID

### Request 

`get /squad/:id`

    curl -i -H 'Accept: application/json' http://localhost:3030/squad/5e6633cec8e0df0024e2a753

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2020 14:25:44 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json

    {
    "squad": {
        "_id": "5e6633cec8e0df0024e2a753",
        "name": "Liga Santander",
        "rating": 88.6,
        "formation": "[1,5,8]",
        "data": "[{\"fieldPosition\":\"GK\"..."
    	}
    }


