const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    position: {type: String, required: true},
    card: {type: String, required: true}
});

module.exports = mongoose.model('Player', playerSchema)