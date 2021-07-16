import * as express from 'express';

import UserController from './controllers/UserController';


const routes = express.Router()

routes.get('/', (req: express.Request, res: express.Response) => {
    return res.jsonOK(null, "Hello World", null);

});


routes.post('/user/create', UserController.store);
routes.get('/user/list', UserController.list);

export default routes;