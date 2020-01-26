const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const models = require('./models');
const multer = require('multer');
var bcrypt = require('bcryptjs');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'src/uploads/')
    }, 
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage, 
    limits: {fileSize: 1024 * 1024 * 5}, 
    fileFilter: fileFilter
});

router.post('/signup', (req, res) => {

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
                .then(result=>{
                    res.status(201).json({
                        message:'User created'
                    });
                })
                .catch(err => {
                    if(err.code==11000) res.status(409).json({error: 'Email already exists'})

                    else res.status(500).json({error:err.message});
                })
        }
    });
   
 });

router.get('/search/:playerId', (req, res) => {
    id=req.params.playerId;
    models.Player.findById(id)
    .select('name position _id')
    .then(doc => {
        if(doc) res.status(200).json({player: doc});
        else res.status(404).json({message: 'Player not found'})
    })
    .catch(err => {
        res.status(500).json({error: err})
    })
});

router.get('/search', (req, res) => {
    models.Player.find()
    .select('name position _id')
    .exec()
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch(err => {
        res.status(500).json({error: err})
    })
});

router.delete('/:playerId', (req,res) => {
    id=req.params.playerId;
    models.Player.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({message:'Player deleted succesfully'});
    })
    .catch(err => {
        res.status(500).json({error: err})
    })
});

router.post('/submit', upload.single('playerCard') ,(req, res) => {
    const player = new models.Player({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        position: req.body.position,
        card: req.file.path
    });

    player.save()
    .then(result => {
        res.status(200).json({createdPlayer: player});
    })
    .catch(err => { 
        res.status(500).json({error: err})
    });

});

router.patch('/:playerId', (req,res) => {
    id=req.params.playerId;
    let updateFields = {}
    for(const fields of req.body) {
        updateFields[fields.propName] = fields.value 
    }
    
    models.Player.update({_id: id}, { $set: updateFields })
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        res.status(500).json({error: err})
    })
});


module.exports = router;