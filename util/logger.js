/**
 * @author Danspotnytool
 * @description Logger module used to log messages to the console with the time and index and save them to a file
 * 
 */



const fs = require('fs');
const event = require('events');

const config = require('../config.js');

let index = 0;

// Create an object that has functions that would return strings that has colors for terminal
const logger = {};

// Create an event emitter
logger.events = new event.EventEmitter();

// Assign functions to the object
/**
 * @param {string} str The string to be colored in green
 * @returns {string} The string colored in green
 */
logger.green = (str) => {
    return `\x1b[32m${str}\x1b[0m`;
};

/**
 * @param {string} str The string to be colored in blue
 * @returns {string} The string colored in blue
 */
logger.blue = (str) => {
    return `\x1b[34m${str}\x1b[0m`;
};

/**
 * @param {string} str The string to be colored in red
 * @returns {string} The string colored in red
 */
logger.red = (str) => {
    return `\x1b[31m${str}\x1b[0m`;
};

/**
 * @param {boolean} withColor Whether or not to include the time with the color
 * @returns string The time based on the timezone
 */
logger.getTime = (withColor) => {
    const time = new Date().toLocaleString('en-US', {
        timeZone: `${config.timezone}`,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    });
    if (!withColor) {
        return `${time}`;
    };
    return `${logger.blue(`${time}`)}`;
};

/**
 * @param {string} message The message to be written to the file
 */
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

/**
 * @param {string} message The message to be written to the console
 * @param {boolean} doNotWrite Whether or not to write the message to the file
 */
logger.log = (message, doNotWrite) => {
    console.log(`[${logger.green(`${index}`)}] [${logger.getTime(true)}] ${message}`);
    doNotWrite ? null : logger.write(`[${index}] [${logger.getTime(false)}] ${message}`);

    // Emit the log event
    logger.events.emit('log', { index: index, time: Date.now(), message: message });

    index += 1;
};

/**
 * @param {string} message The message to be written to the console
 * @param {boolean} doNotWrite Whether or not to write the message to the file
 */
logger.error =  (message, doNotWrite) => {
    console.log(`[${logger.red(`${index}`)}] [${logger.getTime(true)}] ${logger.red(message)}`);
    doNotWrite ? null : logger.write(`[${index}] [${logger.getTime(false)}] ${logger.red(message)}`);

    // Emit the error event
    logger.events.emit('error', { index: index, time: Date.now(), message: message });

    index += 1;
};

module.exports = logger;