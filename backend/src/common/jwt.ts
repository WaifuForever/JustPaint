require('dotenv').config();
const jwt = require("jsonwebtoken");

const tokenPrivateKey = `${process.env.JWT_ID}`;
const refreshTokenPrivateKey =  `${process.env.JWT_REFRESH_ID}`;

const options = { expiresIn: '10 minutes' };
const refreshOptions = { expiresIn: '12 hours' };



function generateJwt(payload: any, num: Number) {
    switch (num){
        case 1:
            return jwt.sign(payload, tokenPrivateKey, options);
        case 2:
            return jwt.sign(payload, refreshTokenPrivateKey, refreshOptions);
        
        default:
            return null;
    }
    
    
}

function verifyJwt (token: string, num: Number)  {
    switch (num){
        case 1:
            return jwt.verify(token, tokenPrivateKey);
        case 2:
            return jwt.verify(token, refreshTokenPrivateKey);
        
        default:
            return null;
    }
    
}

export = {
    generateJwt, verifyJwt
}

