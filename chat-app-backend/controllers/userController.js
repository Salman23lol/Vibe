const mongoose = require("mongoose");
const User = require("../models/User");
const Chat = require("../models/Chat");
const jwt = require("jsonwebtoken");

exports.updateUserProfile = async (req, res) => {
  const { imageUrl, phoneNo, username, status } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(req.user.userId);

    // Update fields if they are provided in the request body
    if (imageUrl) {
      user.accountImage = imageUrl;
    }
    if (phoneNo) {
      user.accountPhoneNo = phoneNo;
    }
    if (username) {
      user.username = username;
    }
    if (status) {
      user.status = status;
    }

    // Save the updated user object to the database
    await user.save();

    // Respond with the updated user details
    res.json({
      msg: "User profile updated",
      accountImage: user.accountImage,
      accountPhoneNo: user.accountPhoneNo,
      username: user.username,
      status: user.status,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getUserContacts = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate(
      "contacts.userId",
      "username accountImage accountPhoneNo status email chats"
    ); // Populate contacts

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Map contacts to extract the required fields
    const contacts = user.contacts.map(contact => ({
      _id: contact.userId._id,
      username: contact.userId.username,
      accountImage: contact.userId.accountImage,
      accountPhoneNo: contact.userId.accountPhoneNo,
      email: contact.userId.email,
      status: contact.userId.status,
      chats: contact.userId.chats,
    }));

    res.json(contacts);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.addContact = async (req, res) => {
  const { contactId } = req.body;
  try {
    const user = await User.findById(req.user.userId);
    const contact = await User.findById(contactId);

    if (!contact) {
      return res.status(404).json({ msg: "Contact not found" });
    }

    // Check if user is trying to add themselves as a contact
    if (user._id.toString() === contactId) {
      return res.status(400).json({ msg: "Cannot add yourself as a contact" });
    }

    // Check if the contact has blocked the requester
    if (contact.blockedContacts.includes(user._id)) {
      return res
        .status(400)
        .json({ msg: "You are blocked by the user you are trying to contact" });
    }

    // Check if contact is already added
    if (user.contacts.some((c) => c.userId.toString() === contactId)) {
      return res.status(400).json({ msg: "Contact already added" });
    }

    // Check if contact request already sent
    const existingRequest = contact.notifications.some(
      (notif) =>
        notif.type === "contact_request" &&
        notif.from.toString() === user._id.toString()
    );

    if (existingRequest) {
      return res.status(400).json({ msg: "Contact request already sent" });
    }

    // Send contact request notification
    contact.notifications.push({
      type: "contact_request",
      message: `${user.username} has sent you a contact request.`,
      from: user._id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day expiry
    });
    await contact.save();

    res.status(201).json({ msg: "Contact request sent" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.respondToContactRequest = async (req, res) => {
  const { notificationId, action } = req.body; // action can be "accept" or "deny"

  try {
    // Find the user who is responding to the contact request
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Ensure the notificationId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ msg: "Invalid notification ID" });
    }

    // Find the specific notification from the user's notifications
    const notification = user.notifications.id(notificationId);

    if (!notification || notification.type !== "contact_request") {
      return res.status(404).json({ msg: "Contact request not found" });
    }

    // Find the user who sent the contact request
    const contact = await User.findById(notification.from);

    if (!contact) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (action === "accept") {
      // Add each other as contacts
      user.contacts.push({ userId: notification.from });
      contact.contacts.push({ userId: req.user.userId });

      // Notify the requester that the request was accepted
      contact.notifications.push({
        message: `${user.username} accepted your contact request.`,
        type: "contact_request_response",
        from: user._id,
      });

      // Create a new chat between the users
      let chat = await Chat.findOne({
        participants: { $all: [req.user.userId, contact._id] },
      });

      if (!chat) {
        chat = new Chat({
          participants: [req.user.userId, contact._id],
        });
        await chat.save();

        // Update both users' chats list
        await User.updateOne(
          { _id: req.user.userId },
          { $push: { chats: chat._id } }
        );
        await User.updateOne(
          { _id: contact._id },
          { $push: { chats: chat._id } }
        );
      }

      await user.save();
      await contact.save();

      // Remove the notification after processing
      await User.updateOne(
        { _id: req.user.userId },
        { $pull: { notifications: { _id: notificationId } } }
      );

      res.json({ msg: "Contact request accepted and chat started", chat });
    } else if (action === "deny") {
      // Notify the requester that the request was denied
      contact.notifications.push({
        message: `${user.username} denied your contact request.`,
        type: "contact_request_response",
        from: user._id,
      });

      await contact.save();

      // Remove the notification after processing
      await User.updateOne(
        { _id: req.user.userId },
        { $pull: { notifications: { _id: notificationId } } }
      );

      res.json({ msg: "Contact request denied" });
    } else {
      return res.status(400).json({ msg: "Invalid action" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const notifications = user.notifications;

    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.removeNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Get the notification ID to remove from the request
    const { notificationId } = req.body;

    // Check if the notification ID is provided
    if (!notificationId) {
      return res.status(400).json({ msg: "Notification ID is required" });
    }

    // Find the notification index in the user's notifications array
    const notificationIndex = user.notifications.findIndex(
      (notification) => notification._id.toString() === notificationId
    );

    // If the notification is found, remove it
    if (notificationIndex !== -1) {
      user.notifications.splice(notificationIndex, 1);
      await user.save(); // Save the updated user document
      return res.status(200).json({ msg: "Notification removed successfully" });
    } else {
      return res.status(404).json({ msg: "Notification not found" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.changeStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const user = await User.findById(req.user.userId);
    user.status = status;
    await user.save();

    res.json({ msg: "Status updated" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    // Notify contacts
    await User.updateMany(
      { "contacts.userId": req.user.userId },
      {
        $pull: { contacts: { userId: req.user.userId } },
        $push: {
          notifications: {
            message: `${user.username} has deleted their account.`,
          },
        },
      }
    );

    // Delete user
    await User.findByIdAndDelete(req.user.userId);

    res.json({ msg: "Account deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.removeContact = async (req, res) => {
  const { contactId } = req.body;

  try {
    // Find the user who is removing the contact
    const user = await User.findById(req.user.userId);
    // Find the contact being removed
    const contact = await User.findById(contactId);

    if (!contact) {
      return res.status(404).json({ msg: "Contact not found" });
    }

    // Remove the contact from the user's contact list
    user.contacts = user.contacts.filter(
      (c) => c.userId.toString() !== contactId
    );
    await user.save();

    // Remove the user from the contact's contact list
    contact.contacts = contact.contacts.filter(
      (c) => c.userId.toString() !== req.user.userId
    );
    await contact.save();

    // Delete the chat between the user and the contact
    const chat = await Chat.findOneAndDelete({
      participants: { $all: [req.user.userId, contactId] },
    });

    // Send notification to the removed contact
    contact.notifications.push({
      message: `${user.username} has removed you from their contacts.`,
      type: "contact_removed",
      from: user._id,
    });
    await contact.save();

    res.status(201).json({
      msg: "Contact removed, chat deleted, and notification sent",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.muteContact = async (req, res) => {
  const { contactId } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    const contact = await User.findById(contactId);

    if (contactId === req.user.userId) {
      return res.status(404).json({ msg: "You Can Not Mute Your Self" });
    }

    if (!contact) {
      return res.status(404).json({ msg: "Contact not found" });
    }

    if (user.mutedContacts.includes(contactId)) {
      return res.status(400).json({ msg: "Contact already muted" });
    }

    user.mutedContacts.push(contactId);
    await user.save();

    res.status(201).json({ msg: "Contact muted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.blockContact = async (req, res) => {
  const { contactId } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    const contact = await User.findById(contactId);

    if (contactId === req.user.userId) {
      return res.status(404).json({ msg: "You Can Not Mute Your Self" });
    }

    if (!contact) {
      return res.status(404).json({ msg: "Contact not found" });
    }

    if (user.blockedContacts.includes(contactId)) {
      return res.status(400).json({ msg: "Contact already blocked" });
    }

    user.blockedContacts.push(contactId);
    await user.save();

    res.status(201).json({ msg: "Contact blocked" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.unmuteContact = async (req, res) => {
  const { contactId } = req.body;

  try {
    const user = await User.findById(req.user.userId);

    user.mutedContacts = user.mutedContacts.filter(
      (id) => id.toString() !== contactId
    );
    await user.save();

    res.status(201).json({ msg: "Contact unmuted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.unblockContact = async (req, res) => {
  const { contactId } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    const contact = await User.findById(contactId);

    if (!contact) {
      return res.status(404).json({ msg: "Contact not found" });
    }

    // Ensure the user is not trying to unblock themselves
    if (contactId === req.user.userId.toString()) {
      return res.status(400).json({ msg: "You cannot unblock yourself" });
    }

    // Check if the contact is currently blocked
    if (!user.blockedContacts.includes(contactId)) {
      return res.status(400).json({ msg: "Contact is not blocked" });
    }

    // Remove the contact from blocked list
    user.blockedContacts = user.blockedContacts.filter(
      (id) => id.toString() !== contactId
    );
    await user.save();

    res.status(201).json({ msg: "Contact unblocked" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.findContact = async (req, res) => {
  const { searchTerm, searchType } = req.body;

  if (!searchTerm || !searchType) {
    return res.status(400).json({ msg: "Search term and type are required" });
  }

  try {
    let contact;

    if (searchType === "name") {
      // Use a case-insensitive regular expression to search for partial matches
      const regex = new RegExp(searchTerm, "i");
      contact = await User.find({ username: { $regex: regex } }).select(
        "-password"
      );
    } else if (searchType === "id") {
      contact = await User.findById(searchTerm).select("-password");
    } else {
      return res.status(400).json({ msg: "Invalid search type" });
    }

    if (!contact || (Array.isArray(contact) && contact.length === 0)) {
      return res.status(404).json({ msg: "Contact not found" });
    }

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.suggestContacts = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate(
      "contacts",
      "username accountImage status joinDate"
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Suggest users who are not in the current user's contacts
    const suggestedContacts = await User.find({
      _id: {
        $ne: req.user.userId,
        $nin: user.contacts.map((contact) => contact._id),
      },
    })
      .select("username accountImage status joinDate")
      .limit(10); // Limit the number of suggestions to 10

    res.json(suggestedContacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.validateToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ msg: "Token is required" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Token is valid
    res.status(200).json({ msg: "Token is valid", decoded });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      try {
        // Decode the token without verifying it to get userId
        const decoded = jwt.decode(token);

        // Find the user and update status to offline
        const user = await User.findById(decoded.userId);
        if (user) {
          user.status = "offline";
          await user.save();
        }
      } catch (updateErr) {
        console.error("Error updating user status:", updateErr.message);
      }

      return res.status(401).json({ msg: "Token has expired" });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: "Invalid token" });
    } else {
      console.error("Token verification error:", err.message);
      return res.status(401).json({ msg: "Token verification failed" });
    }
  }
};

exports.getLoggedInUserInfo = async (req, res) => {
  try {
    // Fetch the logged-in user from the database
    const user = await User.findById(req.user.userId).select('-password'); // Exclude password from the response

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getUserInfoById = async (req, res) => {
  const { userId } = req.params; // Get userId from route parameters

  try {
    // Fetch the user from the database by userId, excluding the password field
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.batchFetch = async (req, res) => {
  const { ids } = req.body;
  try {
    const users = await User.find({ _id: { $in: ids } }).select("-password")
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

