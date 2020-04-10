const User = require('../models/User');
//index, show, store, update, destroy

module.exports = {
    async store (req, res){
        const { filename } = req.file;
        const { email, password, name, description} = req.body;
        

        let user = await User.findOne({ email });
        let pass = await User.findOne({ password });    

        if(!user && !pass){
            user = await User.create({ email, password, name, description, followers, following });
            return res.json(user);
        }
        
       
        if(user){            
            if (!pass){
                return res.json({email: 'already exists'});
            } else{                
                return res.json({email: 'already exists', password: 'already exists'});
            }
        }

        else if (pass){
            return res.json({password: 'already exists'});
        }
      
    }

    

};


module.exports = {
    async show (req, res){
        
        const { email, password} = req.body;
        
        await User.findOne({ email: email, password: password }, function(err, result) {
            if (err) {
              res.send(err);
            } else {
              res.send(result);
            }
          });
       

    
        
    }

    

};