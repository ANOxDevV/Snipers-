
const Discord = require('discord.js-selfbot-v13');

const config = require('./config.js');
const logger = require('./util/logger.js');

// Load srcdirs in './src'
const nitro = require('./src/nitro.js');



const altTokens = config.altTokens;
const altAccounts = [];


let readyCount = 0;
const onReady = async () => {
    readyCount += 1;
    if (readyCount !== altTokens.length) { return };

    logger.log(`${altTokens.length > 1 ? 'All ' : ''}${altTokens.length} alt token${altTokens.length > 1 ? 's' : ''} ${altTokens.length > 1 ? 'are' : 'is'} logged in`);
};



altTokens.forEach(async (token) => {
    const client = new Discord.Client({
        autoCookie: true
    });

    client.on('ready', async () => {
        onReady();

        // Set the alt's status
        client.setting.setCustomStatus({
            status: `${config.altStatus}`,
        });
    });

    client.on('messageCreate', async (msg) => {
        // Check if the message is a command from the owner
        let content = msg.content;
        if (!content) { return };

        // Check if there's a 'discord.gift' on the content
        const links = content.match(/discord(?:(?:app)?\.com\/gifts|\.gift)\/([\w-]{2,255})/gi);
        if (links) {
            nitro.execute(links, msg);
        };
    });

    client.on('messageUpdate', async (msg) => {
        let content = msg.reactions.message.content;
        if (!content) { return };

        // Check if there's a 'discord.gift' on the content
        const links = content.match(/discord(?:(?:app)?\.com\/gifts|\.gift)\/([\w-]{2,255})/gi);
        if (links) {
            nitro.execute(links, msg);
        };
    });

    client.login(token).catch((err) => {
        logger.log(`Could not login to ${logger.green(`${token}`)}`);
    });
});



// Check if there are no alt tokens
if (altTokens.length === 0) {
    logger.log('No alt tokens found');
};