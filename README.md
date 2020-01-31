# FIFA-ultimate-team-draft-api

## General info
RESTful API for the FUT Draft web application.
	
## Technologies
Project created with:
* Node v12.14
* npm v6.13
* MongoDB Atlas
	
## Endpoints

The REST API endpoints to the FUT Draft app are described below.

### Get draft of 5 players per position 

### Request 

`post /draft/`

    curl -i -H 'Accept: application/json' -d 'position=ST' http://localhost:3000/draft/

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2020 12:36:30 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json

    [{"id":1,"name":"Salomón Rondón", "cardImage":"9128181284salomon-rondon.jpg"},
    {"id":56,"name":"Luis Suarez", "cardImage":"988312383luis-suarez.jpg"},
    {"id":89,"name":"Pierre-Emerick Aubameyang", "cardImage":"9128181284pierre-aubameyang.jpg"},
    {"id":12,"name":"Timo Werner", "cardImage":"9128181284timo-werner.jpg"},
    {"id":34,"name":"Jamie Vardy", "cardImage":"9128181284jamie-vardy.jpg"}]

### Search a player by ID

### Request 

`get /search/:id`

    curl -i -H 'Accept: application/json' http://localhost:3000/search/100

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2020 14:25:44 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json

    {"id":100,"name":"Lionel Messi","cardImage":"213131234lionel-messi.jpg"}

