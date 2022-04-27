module.exports = {
    name: 'ping',
    description: 'Ping!',
    async execute(msg, args) {
        const botPing = await msg.reply('Pinging...');
        botPing.edit(`Pong! Latency is ${botPing.createdTimestamp - msg.createdTimestamp}ms. API Latency is ${Math.round(msg.client.ws.ping)}ms.`);

        // Delete the message after 5 seconds
        setTimeout(() => {
            try {
                botPing.delete();
            } catch(err) {};
        }, 5000);
    }
};