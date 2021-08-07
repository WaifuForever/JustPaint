import { Request, Response, NextFunction } from 'express';
import bcrypt from "bcrypt"
import User, { IUser } from '../models/User';


async function store(req: Request, res: Response) {

    const { email, description, gender, password }: IUser = req.body;
  
        
        let _hash : string|null = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
                
        const p1 = new User ({
            email: email,
            password: _hash,
            description: description,
            gender: gender
            
        });

        _hash = null;
       
        p1.save().then((result: any) => {
            result.password = null
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

async function read(req: Request, res: Response){
    const { user_id  } = req.query;
    
    User.findById(user_id).then((user : (IUser|null)) => {
        if(user === null){
            return res.jsonNotFound(user, "No users found", null)
        }
        return res.jsonOK(user, "User retrieved successfully", null)

    }).catch(err =>{
        return res.jsonNotFound(err, "No users found", null)
    })
                
           
    
                    
}

async function update(req: Request, res: Response){
    const { user_id  } = req.query;
    
    User.findByIdAndUpdate(user_id, req.body).then(doc => {
        if(!doc){
            return res.jsonNotFound(null, "user.notfound", null)
        }
       
        else{   
                   
            
            return res.jsonOK(doc, "user.update.success", null)
        }
    }).catch(err => {       
        return res.jsonServerError(err, null, null)
    })
             
           
    
                    
}

export default {
  store, list, read, update
};
