import { Request, Response, NextFunction } from 'express';
import bcrypt from "bcrypt";
import jwt from "../common/jwt"
import User, { IUser } from '../models/User';

async function sign_in(req: Request, res: Response){        
  
    const tken: string | undefined | string[] = req.headers.authorization;
    
    if(!tken){
        return res.jsonUnauthorized(null, null, null)         
    }
    const [hashType, hash]: Array<string> = tken.split(' ');
    
    if(hashType !== "Basic"){
        return res.jsonUnauthorized(null, null, null)              
         
    }
  
    const [email, password]: Array<string> = Buffer.from(hash, "base64").toString().split(":");
   
    let user : IUser|null = await User.findOne({ email: email}).select('password')
    
    if(user === null){
        return res.jsonNotFound(null, null, null)

    }

    const match = user ? await bcrypt.compare(password, user.password) : null;
    
    if(!match){
        return res.jsonBadRequest(null, null, null)
        
    } else{
        
        const token = jwt.generateJwt({id: user._id}, 1);
        const refreshToken = jwt.generateJwt({id: user._id}, 2);
        
        req.headers.authorization = `Bearer ${token}`           
        res.cookie('jid', refreshToken, { httpOnly: true, path: "/refresh-token"})
        
        
        user= null;
        return res.jsonOK(null, "sign-in well succeed", {token})
        
    }

    

  
    
}

export default {
   sign_in
};
  