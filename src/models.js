const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    position: {type: String, required: true},
    cardImage: {type: String, required: true}
});

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String, 
        required: true, 
        unique: true, 
        match: /\S+@\S+\.\S+/
    },
    password: {type: String, required: true},
});

var Player = mongoose.model('Player', playerSchema);
var User = mongoose.model('User', userSchema);

module.exports = {Player: Player, User: User}