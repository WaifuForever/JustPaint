const mongoose = require('mongoose');

const ToolSchema = new mongoose.Schema({
    icon: String,
    action: String, 
    
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        
     }
    
}, {
    toJSON: {
        virtuals: true,
    }
});

ToolSchema.virtual('icon_url').get(function(){
    return `http://localhost:3333/files/${this.icon}`
});

module.exports = mongoose.model('Tool', ToolSchema);