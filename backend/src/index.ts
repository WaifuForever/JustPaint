import * as dotenv from "dotenv";
import express from 'express';
import * as bodyParser from 'body-parser';

import mongoose from 'mongoose';
import cors from 'cors';

import routes from './routes';
//import {response} from './middlewares/response'

dotenv.config();

mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-c09yq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
useNewUrlParser: true,
useUnifiedTopology: true
});

const PORT: number = parseInt(process.env.PORT as string, 10);


const app: express.Application = express();

const server = require('http').Server(app);


const options: cors.CorsOptions = {
    
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
    ],
    //credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT, UPDATE,PATCH, POST,DELETE',
    origin: 'http://localhost:3000/',
    //preflightContinue: false,
};

app.use(bodyParser.json());
app.use(cors());

//app.use(response);

app.use(routes);

//app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });;