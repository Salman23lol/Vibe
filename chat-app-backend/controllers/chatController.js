const Chat = require("../models/Chat");
const User = require("../models/User");

exports.startChat = async (req, res) => {
  const { contactId } = req.body; // The ID of the user to start a chat with

  try {
    // Ensure the contactId is not the same as the logged-in user's ID
    if (contactId === req.user.userId.toString()) {
      return res
        .status(400)
        .json({ msg: "You cannot start a chat with yourself" });
    }

    // Find the logged-in user
    const user = await User.findById(req.user.userId);

    // Check if the contactId is in the user's contacts
    const isContact = user.contacts.some(
      (c) => c.userId.toString() === contactId
    );

    if (!isContact) {
      return res
        .status(400)
        .json({ msg: "Contact not found in your contacts" });
    }

    // Check if a chat already exists between these two users
    let chat = await Chat.findOne({
      participants: { $all: [req.user.userId, contactId] },
    });

    if (chat) {
      return res.status(401).json({ msg:`Chat is Already Start Between ${req.user.userId, contactId}`, chat});
    }

    // Create a new chat with the logged-in user and the contact
    chat = new Chat({
      participants: [req.user.userId, contactId],
    });

    await chat.save();

    // Update both users' chats list
    await User.updateOne(
      { _id: req.user.userId },
      { $push: { chats: chat._id } }
    );
    
    await User.updateOne(
      { _id: contactId },
      { $push: { chats: chat._id } }
    );

    res.status(201).json(chat); // Return the created chat with the chatId
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.sendMessage = async (req, res) => {
  const { chatId, content } = req.body;
  try {
    // Find the chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ msg: "Chat not found" });
    }

    // Find the user sending the message
    const sender = await User.findById(req.user.userId);
    if (!sender) {
      return res.status(404).json({ msg: "Sender not found" });
    }

    // Find the other participant in the chat
    const recipientId = chat.participants.find(id => id.toString() !== req.user.userId);
    if (!recipientId) {
      return res.status(404).json({ msg: "Recipient not found" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ msg: "Recipient not found" });
    }

    // Check if the recipient has blocked the sender
    if (recipient.blockedContacts.includes(req.user.userId)) {
      return res.status(403).json({ msg: `You have been blocked by ${recipient.username} and cannot send messages.` });
    }

    // Check if the sender has blocked the recipient
    if (sender.blockedContacts.includes(recipientId.toString())) {
      return res.status(403).json({ msg: "You have blocked the recipient and cannot send messages." });
    }

    // If not blocked, proceed with sending the message
    chat.messages.push({ sender: req.user.userId, content });
    await chat.save();

    res.json(chat);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.editMessage = async (req, res) => {
  const { chatId, messageId, content } = req.body;
  try {
    const chat = await Chat.findById(chatId);
    const message = chat.messages.id(messageId);

    if (!message) {
      return res.status(404).json({ msg: "Message not found" });
    }

    if (message.sender.toString() !== req.user.userId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    message.content = content;
    message.edited = true;
    await chat.save();

    res.json(chat);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.deleteMessage = async (req, res) => {
  const { chatId, messageId } = req.body;
  try {
    // Find the chat by its ID
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ msg: "Chat not found" });
    }

    // Find the specific message by its ID within the chat's messages array
    const message = chat.messages.id(messageId);

    if (!message) {
      return res.status(404).json({ msg: "Message not found" });
    }

    // Ensure that the logged-in user is the sender of the message
    if (message.sender.toString() !== req.user.userId) {
      return res
        .status(401)
        .json({ msg: "Unauthorized: You can only delete your own messages" });
    }

    // Remove the message from the messages array
    chat.messages = chat.messages.filter(
      (msg) => msg._id.toString() !== messageId
    );
    await chat.save();

    // Respond with the updated chat
    res.status(201).json({msg:"Successfully Delete Message"});
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.clearChat = async (req, res) => {
  const { chatId } = req.body;
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ msg: "Chat not found" });
    }

    // Check if the user is a participant of the chat
    if (!chat.participants.includes(req.user.userId)) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    chat.messages = [];
    await chat.save();

    res.json({ msg: "Chat cleared" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getChat = async (req, res) => {
  const { chatId } = req.params;
  try {
    const chat = await Chat.findById(chatId).populate(
      "participants",
      "username"
    );

    if (!chat) {
      return res.status(404).json({ msg: "Chat not found" });
    }

    // Check if the user is a participant of the chat
    if (
      !chat.participants.some(
        (participant) => participant._id.toString() === req.user.userId
      )
    ) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    res.json(chat);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.checkUnreadMessages = async (req, res) => {
  const { contactId } = req.params;

  try {
    const chats = await Chat.find({
      participants: { $all: [req.user.userId, contactId] },
      "messages.readBy": { $ne: req.user.userId },
    });

    const hasUnreadMessages = chats.some((chat) =>
      chat.messages.some((message) => !message.readBy.includes(req.user.userId))
    );

    res.json({ hasUnreadMessages });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.checkChatExists = async (req, res) => {
  const { contactId } = req.params; // The ID of the contact to check against

  try {
    const chat = await Chat.findOne({
      participants: { $all: [req.user.userId, contactId] },
    });

    if (chat) {
      return res.status(200).json({ exists: true, chatId: chat._id });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
