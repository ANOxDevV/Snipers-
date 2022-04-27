const fs = require('fs');
const Discord = require('discord.js-selfbot-v13');
const client = new Discord.Client();

const config = require('./config.js');

// Load all commands in './cmds'
const cmdFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));
const cmds = {};
for (const file of cmdFiles) {
    const cmd = require(`./cmds/${file}`);
    cmds[cmd.name] = cmd;
};

client.on('ready', async () => {
    console.log(`${client.user.username} is ready!`);
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
    if (content.includes('discord.gift')) {
        // Get every gift link in the message
        const links = content.match(/discord.gift\/([a-zA-Z0-9]{24})/g);
        if (links) {
            // For each link, get every gift code
            const codes = [];
            for (const link of links) {
                const code = link.split('/')[1];
                codes.push(code);
            };
            // Try to redeem every code
            for (const code of codes) {
                client.reddemNitro(code).then((res) => {
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
            };
        };
    };
});

client.on('messageUpdate', async (msg) => {
    let content = msg.reactions.message.content;
    // Check if there's a 'discord.gift' on the content
    if (content.includes('discord.gift')) {
        // Get every gift link in the message
        const links = content.match(/discord.gift\/([a-zA-Z0-9]{24})/g);
        if (links) {
            // For each link, get every gift code
            const codes = [];
            for (const link of links) {
                const code = link.split('/')[1];
                codes.push(code);
            };
            // Try to redeem every code
            for (const code of codes) {
                client.reddemNitro(code).then((res) => {
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
            };
        };
    };
});

client.login(`${config.token}`);