require('dotenv').config();

module.exports = {
    prefix: '$',
    token: `${process.env.TOKEN}`,
    webhookURL: `${process.env.WEBHOOK_URL}`,
};