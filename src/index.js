import mongoose from 'mongoose';
import app from './app.js';
import logger from './configs/logger.js';
import {Server} from 'socket.io';
import SocketServer from './SocketServer.js';

//env vars
const { DATABASE_URL} = process.env;
const PORT = process.env.PORT || 8000;

mongoose.connection.on('error', () => {
    logger.error(`Mongodb connection error: ${err}`);
    process.exit(1);
})

if (process.env.NODE_ENV!=='production') {
    mongoose.set('debug', true);
}

mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    logger.info('Connected to mongodb');
});
let server;

server = app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
});

//socket io
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.CLIENT_ENDPOINT,
    },
});

io.on('connection', (socket) => {
    console.log(`socket ${socket.id} connected`);
    logger.info('Socket.io Connected successfully')
    SocketServer(socket, io);
})

//handling uncaught errors
const exitHandler = () => {
    if (server) {
        logger.info('Server shutting down gracefully');
        process.exit(1);
    } else {
        process.exit(1);
    }
}

const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
}
process.on('uncaughtException', unexpectedErrorHandler);

//SIGTERM
process.on('SIGTERM', () => {
    if (server) {
        logger.info('Server shutting down gracefully');
        process.exit(1);
    }
})