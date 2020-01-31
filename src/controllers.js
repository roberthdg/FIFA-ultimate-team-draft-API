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
        var decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        return res.status(200).json({
            accessToken: generateAccessToken(decoded.email, decoded._id)
            });
      } catch(err) { 
        return res.status(401).json({error: "Auth failed"})
      }
}
    

exports.playerDraft = (req, res) => {
    //selects 5 random players of a given position
    models.Player.aggregate([{ $match: {"position": req.body.position} }, { $sample: { size: 5 } }]).exec()
    .then(doc => res.status(200).json(doc))
    .catch(err => res.status(500).json({error: err}));
}

exports.playerSubmit = (req, res) => {
    const player = new models.Player({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        position: req.body.position,
        cardImage: req.file.path
    });
    player.save()
    .then(res.status(200).json({createdPlayer: player}))
    .catch(err => res.status(500).json({error: err}));
}

exports.playerSearch = (req, res) => {
    id=req.params.playerId;
    models.Player.findById(id)
    .select('name position _id')
    .then(doc => {
        if(doc) res.status(200).json({player: doc});
        else res.status(404).json({message: 'Player not found'})
    })
    .catch(err => res.status(500).json({error: err}));
}

exports.playerList = (req, res) => {
    models.Player.find().select('name position _id').exec()
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