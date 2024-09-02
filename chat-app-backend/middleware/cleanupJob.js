// cleanupJob.js
const cron = require('node-cron');
const User = require('../models/User'); // Adjust the path based on your project structure

// Schedule task to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();
    // Remove expired notifications
    await User.updateMany(
      { 'notifications.expiresAt': { $lt: now } },
      { $pull: { notifications: { expiresAt: { $lt: now } } } }
    );
    console.log('Expired notifications removed.');
  } catch (err) {
    console.error('Error removing expired notifications:', err.message);
  }
});
