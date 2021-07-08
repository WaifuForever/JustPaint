const mongoose = require('mongoose');


const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },   
    image: {type: String},
    description: {type: String},
    likes: [{ //a array fill with the user ids
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  
    }],
    comments: [{ //a array fill with the user ids
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  
    }],
    
});

module.exports = mongoose.model('User', PostSchema);