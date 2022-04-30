/**
 * @author Danspotnytool
 * @description Logger module used to log messages to the console with the time and index and save them to a file
 * 
 */



const fs = require('fs');
const event = require('events');

let index = 0;

// Create an object that has functions that would return strings that has colors for terminal
const logger = {};

// Create an event emitter
logger.events = new event.EventEmitter();

// Assign functions to the object
logger.green = (str) => {
    return `\x1b[32m${str}\x1b[0m`;
};
logger.blue = (str) => {
    return `\x1b[34m${str}\x1b[0m`;
};
logger.red = (str) => {
    return `\x1b[31m${str}\x1b[0m`;
};
logger.getTime = (withColor) => {
    const time = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Manila',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    });
    if (!withColor) {
        return `${time} PHT`;
    };
    return `${logger.blue(`${time} PHT`)}`;
};
logger.write = (message) => {
    // Check if the file exists
    if (!fs.existsSync('../logs.txt')) {
        fs.writeFileSync('../logs.txt', '');
    };
    const file = `${__dirname}/../logs.txt`;
    fs.appendFile(file, `${message}\n`, (err) => {
        if (err) {
            throw err;
        };
    });
};
logger.log = (message) => {
    console.log(`[${logger.green(`${index}`)}] [${logger.getTime(true)}] ${message}`);
    logger.write(`[${index}] [${logger.getTime(false)}] [LOG] ${message}`);

    logger.events.emit('log', { index: index, time: Date.now(), message: message });

    index += 1;
};
logger.error =  (message) => {
    console.log(`[${logger.red(`${index}`)}] [${logger.getTime(true)}] ${logger.red(message)}`);
    logger.write(`[${index}] [${logger.getTime(false)}] [ERROR] ${message}`);

    logger.events.emit('error', { index: index, time: Date.now(), message: message });

    index += 1;
};

module.exports = logger;