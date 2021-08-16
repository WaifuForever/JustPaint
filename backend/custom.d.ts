  declare namespace Express {
    export interface Response {
       jsonOK?: any,
       jsonBadRequest?: any,
       jsonUnauthorized?: any,
       jsonNotFound?: any,
       jsonServerError?: any,
  
    }
    export interface Request {
       auth?: any,
       headers? : any,
       new_token?: any
    }
  }