# FIFA-ultimate-team-draft-api

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)

## General info
RESTful API for the FUT Draft web application.
	
## Technologies
Project is created with:
* Node: 12.14
* npm: 6.13
* MongoDB Atlas
	
# Endpoints

The REST API endpoints to the FUT Draft app are described below.

## Get draft of 5 players per position 

### Request 

`post /draft/`

    curl -i -H 'Accept: application/json' -d 'position=ST' http://localhost:3000/draft/

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2020 12:36:30 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json

    {"id":1,"name":"Salomón Rondón","cardImage":"9128181284salomon-rondon.jpg"}
