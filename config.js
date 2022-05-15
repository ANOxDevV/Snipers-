require('dotenv').config();

module.exports = {
    prefix: '$', // Prefix for testing commands

    token: `${process.env.TOKEN}`, // Your token
    webhookURL: process.env.WEBHOOK_URL, // Your webhook URL

    timezone: `${process.env.TIMEZONE || 'America/New_York'}`, // Your preferred timezone

    setStatus: 'idle',  // 'online' | 'idle' | 'dnd' | 'invisible' | null
    setCustomStatus: true, // Set user's custom status
    customStatus: { // Custom status
        unicodeEmoji: '😴',
        text: 'Sleeping'
    }
};