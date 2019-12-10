const express = require('express');
const app = express();
const winston = require('winston');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const config = require('./configuration/config.json');

const logger = () => {
    const winstonLogger = new winston.Logger({
        transports: [
            new winston.transports.File({
                level: 'debug',
                filename: './endpoint_hits.log',
                handleExceptions: true,
                json: true,
                maxsize: 5242880, // 5MB
                maxFiles: 5,
                colorize: true,
                timestamp: true
            }),
            new winston.transports.Console({
                level: 'debug',
                handleExceptions: true,
                json: false,
                colorize: true,
                timestamp: true
            })
        ],
        exitOnError: false
    });

    winstonLogger.stream = {
        write: (message, encoding) => winstonLogger.info(message)
    };

    return morgan('dev', { stream: winstonLogger.stream });
}

const bootstrap = () => {
    app.use(bodyParser.json());
    app.listen(config.INTERNAL_PORT);
    app.use(logger());

    // Endpoint
    app.post('/alexa', (req, res, next) => {
        console.log('You called Alexa endpoint');
        return res.status(200).send({});
    });
};


bootstrap();