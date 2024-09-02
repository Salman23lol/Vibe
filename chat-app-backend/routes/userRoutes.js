const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Add contact
router.post('/add-contact', authMiddleware, userController.addContact);

// Respond to contact request (accept/deny)
router.post('/respond-contact-request', authMiddleware, userController.respondToContactRequest);

// get Notification
router.get("/notifications", authMiddleware, userController.getNotifications);

// remove Notification
router.post("/delete/notification", authMiddleware, userController.removeNotifications);

// UnBlock a contact
router.post('/unblock-contact', authMiddleware, userController.unblockContact);

// Unmute a contact
router.post('/unmute-contact', authMiddleware, userController.unmuteContact);

// Block a contact
router.post('/block-contact', authMiddleware, userController.blockContact);

// Mute a contact
router.post('/mute-contact', authMiddleware, userController.muteContact);

// Remove a contact
router.post('/remove-contact', authMiddleware, userController.removeContact);

// Personal Routes

// Get contacts list of a user
router.get('/contacts', authMiddleware, userController.getUserContacts);

// Delete account
router.delete('/delete-account', authMiddleware, userController.deleteAccount);

// Change status
router.post('/change-status', authMiddleware, userController.changeStatus);

// Change account image
router.post('/change-account-image', authMiddleware, userController.changeAccountImage);

// Change account phone number
router.post('/change-account-phoneNo', authMiddleware, userController.changeAccountPhoneNo);

// Suggest contacts
router.get('/suggestion-contacts', authMiddleware, userController.suggestContacts);

// find contact
router.post('/find-contact', authMiddleware, userController.findContact);

// Validate JWT token
router.post('/validate-token', userController.validateToken);

// Example of a batch fetch endpoint
router.post('/batch-fetch', userController.batchFetch);

router.get('/info', authMiddleware, userController.getLoggedInUserInfo);

router.get('/info/:userId', authMiddleware, userController.getUserInfoById);

module.exports = router;
