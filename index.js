const fs = require('fs');
const Discord = require('discord.js-selfbot-v13');
const client = new Discord.Client();

const config = require('./config.js');
const logger = require('./util/logger.js');

// Load all commands in './cmds'
const cmdFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));
const cmds = {};
for (const file of cmdFiles) {
    const cmd = require(`./cmds/${file}`);
    cmds[cmd.name] = cmd;
};

// Load srcdirs in './src'
const nitro = require('./src/nitro.js');

client.on('ready', async () => {
    logger.log(`Logged in as ${ logger.green(`${client.user.tag}`) }`);
});

client.on('messageCreate', async (msg) => {
    // Check if the message is a command from the owner
    let content = msg.content;
    if (msg.author.id === client.user.id) {
        if (content.startsWith(config.prefix)) {
            const args = content.slice(config.prefix.length).split(/ +/);
            const commandName = args.shift().toLowerCase();

            if (!cmds[commandName]) {
                return;
            };

            try {
                cmds[commandName].execute(msg, args);
            } catch(err) {
                msg.reply(err);
                console.log(err);
            };
        };
    };

    // Check if there's a 'discord.gift' on the content
    const links = content.match(/discord(?:(?:app)?\.com\/gifts|\.gift)\/([\w-]{2,255})/gi);
    if (links) {
        nitro.execute(links, msg);
    };
});

client.on('messageUpdate', async (msg) => {
    let content = msg.reactions.message.content;

    // Check if there's a 'discord.gift' on the content
    const links = content.match(/discord(?:(?:app)?\.com\/gifts|\.gift)\/([\w-]{2,255})/gi);
    if (links) {
        nitro.execute(links, msg);
    };
});

client.login(`${config.token}`);