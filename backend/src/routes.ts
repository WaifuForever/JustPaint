import * as express from 'express';

import UserController from './controllers/UserController';
import AuthController from './controllers/AuthController';


const routes = express.Router()

routes.get('/', (req: express.Request, res: express.Response) => {
    return res.jsonOK(null, "Hello World", null);

});


routes.post('/user/create', UserController.store);
routes.get('/user/list', UserController.list);
routes.get('/user/read', UserController.read);
routes.put('/user/update', UserController.update);
routes.delete('/user/delete', UserController.remove);

routes.get('/sign-in', AuthController.sign_in)

export default routes;