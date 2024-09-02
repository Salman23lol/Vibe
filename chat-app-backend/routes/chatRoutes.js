const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

// create chat
router.post('/start-chat', authMiddleware, chatController.startChat);

// Send a message
router.post('/send-message', authMiddleware, chatController.sendMessage);

// Edit a message
router.put('/edit-message', authMiddleware, chatController.editMessage);

// Delete a message
router.post('/delete-message', authMiddleware, chatController.deleteMessage);

// Clear chat
router.post('/clear-chat', authMiddleware, chatController.clearChat);

// Get a specific chat
router.get('/:chatId', authMiddleware, chatController.getChat);

// check if chat exists
router.get('/exists/:contactId', authMiddleware, chatController.checkChatExists);

// Check if a contact has unread messages
router.get('/unread-messages/:contactId', authMiddleware, chatController.checkUnreadMessages);



module.exports = router;    
