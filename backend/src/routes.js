const express = require('express');
const multer = require('multer');


const ToolController = require('./controllers/ToolController');
const SessionController = require('./controllers/SessionController');
const uploadConfig = require('./config/upload');

const routes = express.Router();
const upload = multer(uploadConfig);


routes.get('/', (req, res) => {
    return res.json({ message: "Hello World"});

});

routes.post('/sessions', function(req, res){
    SessionController.store
  });
routes.get('/sessions/login', SessionController.show);


routes.get('/tools/get', (req, res) => {
    return res.json({ message: "Hello World"});
});

routes.post('/tools/add', upload.single('icon'), ToolController.store);






module.exports = routes;