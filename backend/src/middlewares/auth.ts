import dotenv from 'dotenv';
import CryptoJs from 'crypto-js';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import jwt from '../common/jwt';


dotenv.config()

function auth(roles = []){
    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            const token: (string[]|undefined) = req.headers?.authorization?.split(" ");

            if (typeof roles === 'string') {
                roles = [roles];
            }
            type Payload = {                
                id: string;
                token_version: number;
                exp: number;
                iat: number;

              };
            let payload: Payload;
            try{
                payload = jwt.verifyJwt(token ? token[1] : "", 1)  
                
            
            }catch(err){ 
                //Invalid Token            
                return res.jsonUnauthorized(err, null, null)
                
            }
            

            if (roles.length){   
                //Invalid roles       
                return res.jsonUnauthorized(null, null, null)
                
                
            } else{              
                User.exists({_id: payload.id, active: true, token_version: payload.token_version}).then(result => {
                    if (result){
                        try{                                
                            var current_time = Date.now().valueOf() / 1000;                           
                            if ((payload.exp - payload.iat)/2 > payload.exp - current_time) {
                                let new_token = jwt.generateJwt({id: payload.id, token_version: payload.token_version}, 1)
                                req.new_token = `Bearer ${new_token}`
                                console.log(`New Token: ${new_token}`)
                            } else{
                                console.log("Token not expired")
                            }
                           
                            req.auth = CryptoJs.AES.encrypt(payload.id, `${process.env.SHUFFLE_SECRET}`);
                            payload = {
                                id: "",
                                token_version: -10,
                                exp: 0,
                                iat: 0
                            }
                            next();
                            
                        }   catch(err){
                            console.log(err)
                            //Server error
                            return res.jsonServerError(null, null, null)
                            
                        }           
                        
                    } else{ 
                        return res.jsonUnauthorized(null, null, null)
                        
                    }
                }).catch(err =>{
                    return res.jsonUnauthorized(null, null, err)
                    
                })
            
            }    
        } catch(err){
            return res.jsonUnauthorized(null, null, null)
            
        }        
    }
}