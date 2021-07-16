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

              return res.jsonOK(null, "User added!", null);                              

          }).catch(err => {
              
              console.log(err)
              if (err) {
               
                  return res.jsonBadRequest(null, "Duplicate key error.", err);  
              
              } else {
                  return res.jsonBadRequest(null, "Bad request.", err)
              
              }       
                  
          });     
      
                                                                      
}
    

async function list(req: Request, res: Response){
  const { country, email  } = req.query;
  
  let docs: Array<IUser> = [];

  if (country){
      (await User.find({country: country})).forEach(function (doc: IUser){
          docs.push(doc)
      });
  }

  else if(email){
      (await User.find({email: email as string})).forEach(function (doc: IUser){
        docs.push(doc)
          
      })
      
  }
  else{
      (await User.find()).forEach(function (doc: IUser){
          docs.push(doc)
      });
  }  
          
  
         
  if (docs.length === 0){
      return res.jsonNotFound(docs, "No users found", null)
  } else{
      /*docs.forEach(function(doc: <IUser>){
          

      });*/
      return res.jsonOK(docs, "User list retrieved successfuly: " + docs.length, null)
  }
                  
}

export default {
  store, list
};
