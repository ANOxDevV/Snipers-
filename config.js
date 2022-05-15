require('dotenv').config();

module.exports = {
    prefix: '$', // Prefix for testing commands
    token: `${process.env.TOKEN}`, // Your token
    webhookURL: `${process.env.WEBHOOK_URL}`, // Your webhook URL
    timezone: `${process.env.TIMEZONE || 'America/New_York'}` // Your preferred timezone
};