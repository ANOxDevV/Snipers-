require('dotenv').config();

module.exports = {
    prefix: '$',
    token: `${process.env.TOKEN}`,
    webhookURL: `${process.env.WEBHOOK_URL}`,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9004 Chrome/91.0.4472.164 Electron/13.6.6 Safari/537.36',
};