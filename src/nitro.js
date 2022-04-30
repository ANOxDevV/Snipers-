const Discord = require('discord.js');
const phin = require('phin').unpromisified;
const config = require('../config.js');
const logger = require('../util/logger.js');



/**
 * @param {string} code The code to be sent to the nitro api
 * @returns {Promise<string>}
 */
const getType = async (code) => {
    const url = `https://discord.com/api/v8/entitlements/gift-codes/${code}`;
    const promise = new Promise((resolve, reject) => {
        phin({
            url: url,
            method: 'GET',
            parse: 'json'
        }, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            };
        });
    });
    return promise;
};



/**
 * @param {string} code The code to be sent to the nitro api
 * @param {any} msg
 */
const claimNitro = async (code, msg) => {
    const nitro = {
        code: code,
        type: '',
        from: `${msg.author.tag}`,
        location: `${msg.url}`,
        timeSent: `${msg.createdTimestamp}`,
        timeTaken: null
    };
    phin({
        url: `https://discord.com/api/v8/entitlements/gift-codes/${nitro.code}/redeem`,
        method: 'POST',
        parse: 'json',
        headers: {
            'Authorization': `${config.token}`,
            'User-Agent': `${config.userAgent}`
        },
        data: JSON.stringify({
            channel_id: `${msg.channel.id}`
        })
    }, async (err, res) => {
        if (err) {
            // Create a new embed to send to the webhook
            const embed = new Discord.MessageEmbed()
                .setTitle('Nitro Error')
                .setDescription(`An error occured while trying to redeem the nitro code.\n\n${err}`)
                .setColor('#ff0000')
                .setTimestamp();

            // Send the embed to the webhook
            const webhook = new Discord.WebhookClient({url: config.webhookURL});
            webhook.send({embeds: [embed]});

            return logger.error(err);
        };
        // Get time taken to redeem the nitro code
        nitro.timeTaken = nitro.timeSent - Date.now();

        // 200 = code redeemed
        // 400 = code already redeemed by someone else
        // 404 = code not found

        // Get the type of nitro code
        if (res.statusCode !== 404) {
            await getType(nitro.code).then(res => {
                nitro.type = `${res.body.store_listing.sku.name}`;
            }).catch(err => {
                logger.error(err);
            });
        };

        if (res.statusCode === 200) {
            // Create a new embed to send to the webhook
            const embed = new Discord.MessageEmbed()
                .setTitle('Nitro Code Redeemed')
                .setDescription(`${nitro.from} sent a ${nitro.type}`)
                .addField('Code', `${code}`)
                .addField('Author', `${nitro.from}`)
                .addField('Location', `${nitro.location}`)
                .addField('Time Taken', `${nitro.timeTaken}`)
                .setColor('#00ff00')
                .setTimestamp()
                .setFooter({
                    text: `Danspotnytool Nitro Sniper Bot ${require('../package.json').version}`
                });

            // Send the embed to the webhook
            const webhook = new Discord.WebhookClient({url: config.webhookURL});
            webhook.send({
                content: '@everyone',
                embeds: [embed]
            });
        } else if (res.statusCode === 400) {
            // Create a new embed to send to the webhook
            const embed = new Discord.MessageEmbed()
                .setTitle('Nitro Code Already Redeemed')
                .setDescription(`${nitro.from} sent a ${nitro.type}`)
                .addField('Code', `${code}`)
                .addField('Author', `${nitro.from}`)
                .addField('Location', `${nitro.location}`)
                .addField('Time Taken', `${nitro.timeTaken}`)
                .setColor('#ff0000')
                .setTimestamp()
                .setFooter({
                    text: `Danspotnytool Nitro Sniper Bot ${require('../package.json').version}`
                });

            // Send the embed to the webhook
            const webhook = new Discord.WebhookClient({url: config.webhookURL});
            webhook.send({
                embeds: [embed]
            });
        } else if (res.statusCode === 404) {
            // Create a new embed to send to the webhook
            const embed = new Discord.MessageEmbed()
                .setTitle('Unknown Gift Code')
                .setDescription(`${nitro.from} sent an Unknown Gift Code`)
                .addField('Code', `${code}`)
                .addField('Author', `${nitro.from}`)
                .addField('Location', `${nitro.location}`)
                .addField('Time Taken', `${nitro.timeTaken}`)
                .setColor('#000000')
                .setTimestamp()
                .setFooter({
                    text: `Danspotnytool Nitro Sniper Bot ${require('../package.json').version}`
                });

            // Send the embed to the webhook
            const webhook = new Discord.WebhookClient({url: config.webhookURL});
            webhook.send({
                embeds: [embed]
            });
        } else {};
    });
};



module.exports = {
    description: 'Claim Nitro',
    async execute(links, msg) {
        links.forEach(async (link) => {
            // Remove the https and http at the end of the string
            let thisGift = `${link}`;
            if (thisGift.endsWith('https') || thisGift.endsWith('http')) {
                // Remove the https
                const hIndex = thisGift.lastIndexOf('h');
                thisGift = thisGift.substring(0, hIndex);
            };

            // Get the gift code
            const code = thisGift.split('/')[1];

            // Claim the nitro
            claimNitro(code, msg);
        });
    }
};