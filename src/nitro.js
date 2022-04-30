const Discord = require('discord.js');
const config = require('../config.js');

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
            console.log(code);

            // Claim the gift
            msg.client.redeemNitro(code).then((res) => {
                // Send an embed to the webhook
                const embed = new Discord.MessageEmbed()
                    .setTitle('Nitro Redeemed')
                    .setURL(`https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`)
                    .setDescription(`**From** ${msg.author.tag} (${msg.author.id})\n
**Location** ${msg.guild.name} ${msg.channel.name} <#${msg.channel.id}>\n
**Time Taken** ${msg.createdTimestamp - Date.now()}ms`)
                    .setColor('#0099ff')
                    .setTimestamp()
                    .setFooter({text: `${code} redeemed!`});
                const webhook = new Discord.WebhookClient({url: config.webhookURL});
                webhook.send({text: '@everyone', embeds: [embed]});

            }).catch((err) => {
                err = `${err}`;
                // Send an embed to the webhook
                const embed = new Discord.MessageEmbed()
                    .setTitle(`${err.split(':')[1]}`)
                    .setURL(`https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`)
                    .setDescription(`**From** ${msg.author.tag} (${msg.author.id})\n
**Location** ${msg.guild.name} ${msg.channel.name} <#${msg.channel.id}>\n
**Time Taken** ${msg.createdTimestamp - Date.now()}ms`)
                    .setColor('#ff0000')
                    .setTimestamp()
                    .setFooter({text: `${code} failed!`});
                const webhook = new Discord.WebhookClient({url: config.webhookURL});
                webhook.send({embeds: [embed]});
            });
        });
    }
};