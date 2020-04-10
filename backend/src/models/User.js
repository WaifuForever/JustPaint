const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    photo: String,
    description: String,
    followers: Number,
    follwing: Number,
});

module.exports = mongoose.model('User', UserSchema);