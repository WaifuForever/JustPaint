import { Request, Response, NextFunction } from 'express';

import User, { IUser } from '../models/User';

async function store(req: Request, res: Response) {

    const { email, description, gender }: IUser = req.body;
  
                  
          const p1 = new User ({
              email: email,
              description: description,
              gender: gender
              
          });

          p1.save().then(result => {

              return res.json(        
                 "User added"             
              );                              

          }).catch(err => {
              
              console.log(err)
              if (err.name === 'MongoError' && err.code === 11000) {
                  //next(new Error('There was a duplicate key error'));
                  return res.json("There was a duplicate key error");  
              
              } else {
                  return res.json("Bad request")
              
              }       
                  
          });     
      
                                                                      
}
    


async function show (req: Request, res: Response){
        
    const { email, password} = req.body;
    
    await User.findOne({ email: email, password: password }, function(err: any, result: any) {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
   


    
}
export default {
  store
};
