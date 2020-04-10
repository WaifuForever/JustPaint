const mongoose = require('mongoose');


const PostSchema = new mongoose.Schema({
    name: String,
    photo: String,
    description: String,
    likes: Number,
    comments: Number,
});

module.exports = mongoose.model('User', PostSchema);