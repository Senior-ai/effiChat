import app from './app.js';
import logger from './configs/logger.js';

//env vars
const PORT = process.env.PORT || 8000;
let server;

server = app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
    console.log(`process id: ${process.pid}`);
});


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