const mongoose = require('mongoose');
const { model } = require('./user');

const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    campsites: [{
        types: mongoose.Schema.Types.ObjectId,
        ref: "Campsite"
    }]
    } 
    ,{
    timestamp: true
});
module.exports = mongoose.model('Favorite', favoriteSchema);