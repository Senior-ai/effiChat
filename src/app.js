import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import createHttpError from 'http-errors';
import routes from './routes/index.js';

dotenv.config();
const app = express(); //express init

//Morgan
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

app.use(helmet()); //helmet init

app.use(express.json()); //parse json request url
app.use(express.urlencoded({extended: true})); //parse json request body

app.use(ExpressMongoSanitize()); //sanitize requests

app.use(cookieParser()); //cookieParser init

app.use(compression()); //gzip compression

app.use(fileUpload({useTempFiles: true})); //file upload middleware

app.use(cors({origin: 'http://localhost:3000' //allow cors requests from react dev server
})); //cors middleware

//routes
app.use('/apiv1', routes);

app.use(async(req,res,next) => {
    next(createHttpError.NotFound('This route does not exist'));
})

//http error handling
app.use(async(err,req,res,next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    })
})

app.get('/', (req, res) => {
    res.send('test');
});

export default app;