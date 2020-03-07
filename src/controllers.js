const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const models = require('./models');

function generateAccessToken(email, id) {
    return jwt.sign({
       email: email,
       _id: id
    }, process.env.ACCESS_TOKEN_SECRET, {
       expiresIn: "1h"
    });  
}

function generateRefreshToken(email, id) {
    return jwt.sign({
       email: email,
       _id: id
    }, process.env.REFRESH_TOKEN_SECRET)
}

exports.userLogin = (req, res) => { 
    models.User.find({email: req.body.email}).exec()
    .then(user=>{
        if(user.length<1) return res.status(401).json({error: "Auth failed"});

        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(result == true) {
                const accessToken = generateAccessToken(user[0].email, user[0]._id);
                const refreshToken = generateRefreshToken(user[0].email, user[0]._id);
                res.status(200).json({message: "successful login", accessToken: accessToken, refreshToken: refreshToken});
            }
            else res.status(401).json({error: "Auth failed"})
        });
    })
    .catch(err => res.status(500).json({error: err}))
}

exports.userSignup = (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) =>  {
        if(err) {
            return res.status(500).json({
                error:err
            });
        } else {
            const user = new models.User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
            });
            
            user.save()
                .then(result=> {
                    res.status(201).json({
                        message: 'User registered suscessfully',
                        accessToken: generateAccessToken(user.email, user._id),
                        refreshToken: generateRefreshToken(user.email, user._id)
                    });
                })
                .catch(err => {
                    if(err.code==11000) res.status(409).json({error: 'Email already exists'})
                    else res.status(500).json({error:err.message});
                })
        }
    });
}

exports.refreshToken = (req, res) => {
    //generates new access token
    try {
        let refreshToken = req.body.token;
        let decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        return res.status(200).json({
            accessToken: generateAccessToken(decoded.email, decoded._id)
        });
    } catch(err) { 
        return res.status(401).json({error: "Auth failed"})
      }
}

exports.playerDraft = (req, res) => {
    //selects 5 random players given a position and role
    models.Player.aggregate([
        { $match: { $or: [{"position": req.body.position}, {"role": req.body.role}] } }, 
        { $match: { "cardImage": {$nin: req.body.draftedPlayers} } }, 
        { $sample: { size: 5 } }])
    .exec()
    .then(doc => res.status(200).json(doc))
    .catch(err => res.status(500).json({error: err}));
}

exports.playerSubmit = (req, res) => {
    const player = new models.Player({
        _id: new mongoose.Types.ObjectId(),
        role: req.body.role,
        position: req.body.position,
        nation: req.body.nation,
        league: req.body.league,
        club: req.body.club,
        rating: req.body.rating,
        cardImage: req.file.filename
    });
    player.save()
    .then(res.status(200).json({createdPlayer: player}))
    .catch(err => res.status(500).json({error: err}));
}

exports.playerSearch = (req, res) => {
    id=req.params.playerId;
    models.Player.findById(id)
    .select('nation position rating _id')
    .then(doc => {
        if(doc) res.status(200).json({player: doc});
        else res.status(404).json({message: 'Player not found'})
    })
    .catch(err => res.status(500).json({error: err}));
}

exports.playerList = (req, res) => {
    models.Player.find().select('position role nation league club rating cardImage _id').exec()
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch(err => res.status(500).json({error: err}));
}

exports.playerDelete = (req,res) => {
    id=req.params.playerId;
    models.Player.remove({_id: id}).exec()
    .then(res.status(200).json({message:'Player deleted succesfully'}))
    .catch(err => res.status(500).json({error: err}));
}

exports.playerUpdate = (req,res) => {
    id=req.params.playerId;
    let updateFields = {}
    for(const fields of req.body) {
        updateFields[fields.name] = fields.value 
    }
    models.Player.update({_id: id}, { $set: updateFields }).exec()
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json({error: err}));
}

exports.squadSubmit = (req, res) => {
    console.log(req.body)
    const squad = new models.Squad({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        rating: req.body.rating,
        formation: req.body.formation,
        data: req.body.data
    });
    squad.save()
    .then(res.status(200).json({squad: squad}))
    .catch(err => res.status(500).json({error: err}));
}

exports.squadSearch = (req, res) => {
    id=req.params.squadId;
    models.Squad.findById(id)
    .select('data rating formation name')
    .then(doc => {
        if(doc) res.status(200).json({squad: doc});
        else res.status(404).json({message: 'Squad not found'})
    })
    .catch(err => res.status(500).json({error: err}));
}

exports.squadLeaderboard = (req, res) => {
    models.Squad.find().select('rating name _id')
    .sort({rating: -1})
    .limit(50)
    .exec()
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch(err => res.status(500).json({error: err}));
}
