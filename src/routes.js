const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Player = require('./models');

router.get('/search/:playerId', (req, res, next) => {
    id=req.params.playerId;
    Player.findById(id)
    .then(doc => {
        res.status(200).json({
            player: doc,
            message:'handling GET requests'
        });
    })
    .catch(err => {
        res.status(500).json({error: err})
    })
});

router.post('/submit', (req, res, next) => {
    const player = new Player({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        position: req.body.position
    });

    player
        .save()
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(err))

    res.status(200).json({
        message:'handling POST requests',
        createdPlayer: player
    });
});

module.exports = router;